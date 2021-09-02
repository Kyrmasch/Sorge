import os
import re
import string
from typing import List

import pandas as pd
from interface import implements
from nltk.corpus import stopwords
from rake_nltk import Metric, Rake
from UseCases.KeyWords.Interfaces.IKeyWordService import IKeyWordService

os.environ["TF_CPP_MIN_LOG_LEVEL"] = "3"

import operator
import string

import pymorphy2
import rulemma
import rupostagger
import rutokenizer
import spacy
from Infrastructure.Implementation.kaznlp.lid.lidnb import LidNB
from Infrastructure.Implementation.kaznlp.morphology.analyzers import \
    AnalyzerDD
from Infrastructure.Implementation.kaznlp.morphology.taggers import TaggerHMM
from Infrastructure.Implementation.kaznlp.normalization.ininorm import \
    Normalizer
from Infrastructure.Implementation.kaznlp.tokenization.tokhmm import \
    TokenizerHMM
from Infrastructure.Implementation.kaznlp.tokenization.tokrex import \
    TokenizeRex
from nltk.tokenize import sent_tokenize, word_tokenize
from sklearn.decomposition import LatentDirichletAllocation
from sklearn.feature_extraction.text import CountVectorizer, TfidfVectorizer
from UseCases.KeyWords.Implementation.KnowledgeGraph import KnowledgeGraph


class KeyWordService(implements(IKeyWordService)):
    def __init__(self, config):
        self.wd = os.getcwd()

        self.morph = pymorphy2.MorphAnalyzer()

        self.ru_lemmatizer = rulemma.Lemmatizer()
        self.ru_lemmatizer.load()
        self.ru_tokenizer = rutokenizer.Tokenizer()
        self.ru_tokenizer.load()
        self.ru_tagger = rupostagger.RuPosTagger()
        self.ru_tagger.load()

        self.mdl = os.path.join(
            self.wd,
            "Infrastructure",
            "Implementation",
            "kaznlp",
            "tokenization",
            "tokhmm.mdl",
        )
        self.kz_tokenizer = TokenizerHMM(model=self.mdl)
        self.kz_analyzer = AnalyzerDD()
        self.kz_analyzer.load_model(
            os.path.join(
                self.wd,
                "Infrastructure",
                "Implementation",
                "kaznlp",
                "morphology",
                "mdl",
            )
        )
        self.kz_tagger = TaggerHMM(lyzer=self.kz_analyzer)
        self.kz_tagger.load_model(
            os.path.join(
                self.wd,
                "Infrastructure",
                "Implementation",
                "kaznlp",
                "morphology",
                "mdl",
            )
        )

        self.knowledge = KnowledgeGraph()

    def stopwords_from_file(self, stop_words, lang):
        try:
            with open(
                "%s/ApplicationService/Files/stopwords/%s.txt" % (self.wd, lang)
            ) as f:
                words = f.read().splitlines()
                stop_words.extend(words)
        except Exception as e:
            print(str(e))

        return stop_words

    def get_stop_words(self, lang="russian"):
        if lang == "kazakh":
            stop_words = self.stopwords_from_file([], lang)
            return stop_words
        else:
            stop_words = stopwords.words(lang)
            stop_words = self.stopwords_from_file(stop_words, lang)
            return stop_words

    def split_sentence(self, data):
        return sent_tokenize(data)

    def delete_punctuation(self, data, all=True):
        punctuations = list(string.punctuation)
        if all == False:
            punctuations = []

        punctuations.append("«")
        punctuations.append("»")
        punctuations.append("—")
        punctuations.append("–")

        tokens = [i for i in word_tokenize(data) if i not in punctuations]
        return " ".join(tokens).lower()

    def tokenize(self, text, lang="russian", punctuation=True):

        text = self.delete_punctuation(text, punctuation)

        words = []

        if lang == "kazakh":
            for sentence in self.kz_tokenizer.tokenize(text):
                lower_sentence = map(lambda x: x.lower(), sentence)
                for i, a in enumerate(self.kz_tagger.tag_sentence(lower_sentence)):
                    if "_R_ET" not in str(a) and "_R_EB" not in str(a):
                        try:
                            lemma = str(a).split("_")[0]
                            words.append(lemma)
                        except:
                            pass
        else:
            tokens = self.ru_tokenizer.tokenize(text)
            tags = self.ru_tagger.tag(tokens)
            lemmas = self.ru_lemmatizer.lemmatize(tags)

            for word, tags, lemma, *_ in lemmas:
                if "VERB" not in tags:
                    words.append(lemma)

        return " ".join(words)

    def correct_endings(self, pattern, adj, noun):
        l_oe = ["ч", "щ"]
        gender = self.morph.parse(noun)[0].tag.gender
        k = adj[: len(adj) - 2]
        l = k[-1]
        oe = l in l_oe
        if gender == "femn":
            return pattern.format(adj=("%sая" % (k)), noun=noun)
        if gender == "neut":
            return pattern.format(
                adj=oe == True and ("%sее" % (k)) or ("%sое" % (k)), noun=noun
            )

    def correct(self, data):
        tokens = self.ru_tokenizer.tokenize(data)
        tags = self.ru_tagger.tag(tokens)
        lemmas = self.ru_lemmatizer.lemmatize(tags)

        ww = []
        for word, tags, lemma, *_ in lemmas:
            ww.append((word, tags.split("|")[0]))
        if len(ww) > 1:
            if ww[0][1] == "ADJ" and ww[1][1] == "NOUN":
                return self.correct_endings("{adj} {noun}", ww[0][0], ww[1][0])
            elif ww[1][1] == "ADJ" and ww[0][1] == "NOUN":
                return self.correct_endings("{adj} {noun}", ww[1][0], ww[0][0])

        return data

    def knowledge(self, data, lang):
        if lang in ["russian", "english"]:
            sentences = self.knowledge.getSentences(data, lang)
            nlp_model = spacy.load(
                lang == "russain" and "ru_core_news_sm" or "en_core_web_sm"
            )

            triples = []
            for sentence in sentences:
                triples.append(self.knowledge.processSentence(sentence, nlp_model))

            print(triples)

    def rake_extract(self, data, lang="russian"):
        data = u"%s" % (data)
        stop_words = set(self.get_stop_words(lang))
        text = self.tokenize(data, lang, False)

        self.knowledge(data, lang)

        max_length = 2

        r = Rake(
            stopwords=stop_words,
            min_length=1,
            max_length=max_length,
            language=lang,
            ranking_metric=Metric.WORD_FREQUENCY,
        )
        r.extract_keywords_from_text(text)

        words = r.get_ranked_phrases_with_scores()

        result = []
        for w in words:
            text = w[1]
            score = w[0]
            if lang == "russian":
                try:
                    text = self.correct(text)
                except Exception as e:
                    print(str(e))
            result.append((score, text))

        return result

    def tf_extract(self, data, lang="russian"):
        stop_words = self.get_stop_words(lang)
        ls = self.split_sentence(data)

        text_array = []
        for item in ls:
            text = self.delete_punctuation(item)
            text = self.tokenize(text, lang)
            text_array.append(text)

        corpus = pd.DataFrame(text_array)
        corpus = corpus.rename(columns={0: "Description"})

        vectorizer = TfidfVectorizer(stop_words=stop_words)
        X = vectorizer.fit_transform(corpus["Description"])
        result = [tuple(a) for a in zip(X.toarray()[0], vectorizer.get_feature_names())]
        result = [a for a in result if a[0] > 0]

        return result
