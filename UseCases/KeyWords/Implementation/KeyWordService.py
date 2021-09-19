import os
import re
import string
from typing import List
from numpy import number

import pandas as pd
from interface import implements
from nltk.corpus import stopwords
from rake_nltk import Metric, Rake
from UseCases.KeyWords.Interfaces.IKeyWordService import IKeyWordService

import networkx as nx
import string

import pymorphy2
import rulemma
import rupostagger
import rutokenizer
import spacy
from Infrastructure.Implementation.kaznlp.morphology.analyzers import AnalyzerDD
from Infrastructure.Implementation.kaznlp.morphology.taggers import TaggerHMM
from Infrastructure.Implementation.kaznlp.normalization.ininorm import Normalizer
from Infrastructure.Implementation.kaznlp.tokenization.tokhmm import TokenizerHMM
from Infrastructure.Implementation.kaznlp.tokenization.tokrex import TokenizeRex
from nltk.tokenize import sent_tokenize, word_tokenize
from sklearn.feature_extraction.text import TfidfVectorizer
from ApplicationService.DepentencyInjection import relation, knowlege_graph
from UseCases.KeyWords.Interfaces.Dtos.KeyWordDto import KeyWordDto

from UseCases.Wikipedia.Implementation.WikiService import WikiService

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

        self.wiki = WikiService(None)

    def stopwords_from_file(self, stop_words: List[str], lang):
        try:
            with open(
                "%s/ApplicationService/Files/stopwords/%s.txt" % (self.wd, lang)
            ) as f:
                words = f.read().splitlines()
                stop_words.extend(words)
        except Exception as e:
            pass

        return stop_words

    def get_stop_words(self, lang: str = "russian"):
        if lang == "kazakh":
            stop_words = self.stopwords_from_file([], lang)
            return stop_words
        else:
            stop_words = stopwords.words(lang)
            stop_words = self.stopwords_from_file(stop_words, lang)
            return stop_words

    def split_sentence(self, data):
        return sent_tokenize(data)

    def delete_punctuation(self, data: str, all: bool = True):
        punctuations = list(string.punctuation)
        if all == False:
            punctuations = []

        punctuations.append("«")
        punctuations.append("»")
        punctuations.append("—")
        punctuations.append("–")

        tokens = [i for i in word_tokenize(data) if i not in punctuations]
        return " ".join(tokens).lower()

    def tokenize(self, text: str, lang: str = "russian", punctuation: bool = True, verb: bool = False):

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
                if (verb == False):
                    if "VERB" not in tags:
                        words.append(lemma)
                else:
                    words.append(lemma)

        return " ".join(words)

    def correct_endings(self, pattern: str, adj: str, noun: str) -> str:
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

        return pattern.format(adj=adj, noun=noun)

    def correct(self, data: str) -> str:
        tokens = self.ru_tokenizer.tokenize(data)
        tags = self.ru_tagger.tag(tokens)
        lemmas = self.ru_lemmatizer.lemmatize(tags)

        semantics = []
        for word, tags, lemma, *_ in lemmas:
            semantics.append((word, tags.split("|")[0]))
        if len(semantics) > 1:
            if semantics[0][1] == "ADJ" and semantics[1][1] == "NOUN":
                return self.correct_endings(
                    "{adj} {noun}", semantics[0][0], semantics[1][0]
                )
            elif semantics[1][1] == "ADJ" and semantics[0][1] == "NOUN":
                return self.correct_endings(
                    "{adj} {noun}", semantics[1][0], semantics[0][0]
                )

        return data

    def get_triples(self, data, lang: string, method = "knowlegegraph", 
                                            entities: List[tuple] = []) -> List[tuple]:

        stop = self.get_stop_words(lang)
        data = u"%s" % (data).lower()
        data = data.replace("«", "").replace("»", "")

        if lang in ["russian", "english"]:
            
            # ru2_combined_400ks_96
            # ru_core_news_sm
            
            model_name = "en_core_web_sm"
            if (lang == "russian"):
                model_name = "ru_core_news_sm"
            elif (lang == "kazakh"):
                pass

            nlp_model = spacy.load(model_name)
            for w in stop:
                nlp_model.vocab[w].is_stop = True

            triplets = []
            if method == "basic":
                data = self.tokenize(data, lang, False, False)
                sentences = self.split_sentence(data)
                edges = []

                for s in sentences:
                    doc = nlp_model(u'%s' % (s))
                    
                    
                    for token in doc:
                        for child in token.children:
                            edges.append(('{0}'.format(token.lower_),
                                        '{0}'.format(child.lower_)))

                graph = nx.Graph(edges)
                for entity1 in entities:
                    for entity2 in entities:
                        if entity1[1] == entity2[1]:
                            continue
                        
                        print(entity1[1], entity2[1])
                        try:
                            print(nx.shortest_path_length(graph, source=entity1[1], target=entity2[1]))
                            print(nx.shortest_path(graph, source=entity1[1], target=entity2[1]))
                        except:
                            pass

            elif method == "knowlegegraph":
                sentences   = knowlege_graph.getSentences(data, nlp_model, lang) 
                triplets    = knowlege_graph.get_triplets(nlp_model, sentences)
            elif method == "spacy":
                if lang == "russian":
                    data = self.tokenize(data, lang, False, True)
                    for s in stop:
                        data = data.replace(" %s " % (s), " ")
                        data = data.replace("(%s " % (s), " ")
                        data = re.sub(' +', ' ', data)
                sentences = self.split_sentence(data)
                triplets    = relation.get_triplets(nlp_model, sentences)
                
            return triplets

    def rake_extract(self, data: str, lang: str = "russian") -> List[KeyWordDto]:
        data = u"%s" % (data)
        stop_words = set(self.get_stop_words(lang))
        text = self.tokenize(data, lang, False)

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

            result.append(KeyWordDto(text, score))

        return result

    def tf_extract(self, data: str, lang: str = "russian") -> List[KeyWordDto]:
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
        result = [KeyWordDto(a[1], a[0]) for a in result if a[0] > 0]

        return result

    def wiki_relation(self, entity: str):
        wds = self.wiki.get_wd_short(entity)
        if wds is not None:
            if wds.shape[1] > 0:
                try:
                    wd = wds["s.value"].iloc[0]
                    wd = "wd:%s" % (wd.rsplit("/", 1)[-1])
                    subjects = self.wiki.get_relation(wd)
                    print(subjects)
                except Exception as e:
                    print(str(e))
