import gc
import os
import re
import string
from typing import List

import pandas as pd
import pymorphy2
import spacy
import spacy_udpipe
from ApplicationService.DepentencyInjection import knowlege_graph, relation, spacy_relation
from ApplicationService.Dtos.RelationTripletsParamsDto import \
    RelationTripletsParamsDto
from interface import implements
from nltk.corpus import stopwords
from nltk.tokenize import sent_tokenize, word_tokenize
from rake_nltk import Metric, Rake
from sklearn.feature_extraction.text import TfidfVectorizer
from UseCases.KeyWords.Interfaces.Dtos.KeyWordDto import KeyWordDto
from UseCases.KeyWords.Interfaces.Dtos.TokenizeParamsDto import \
    TokenizeParamsDto
from UseCases.KeyWords.Interfaces.Dtos.TripletsDto import TripletsDto
from UseCases.KeyWords.Interfaces.Dtos.TripletsParamsDto import \
    TripletsParamsDto
from UseCases.KeyWords.Interfaces.IKeyWordService import IKeyWordService
from UseCases.Wikipedia.Implementation.WikiService import WikiService
import concurrent.futures

develop_mode = False

class KeyWordService(implements(IKeyWordService)):
    def __init__(self, config):
        self.wd = os.getcwd()
        self.morph = pymorphy2.MorphAnalyzer()

        self.wiki = WikiService(None)

    def stopwords_from_file(self, stop_words: List[str], lang: str):
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
        punctuations.append(" — ")

        tokens = [i for i in word_tokenize(data) if i not in punctuations]
        return " ".join(tokens)

    def tokenize(self, args: TokenizeParamsDto, model):

        text = self.delete_punctuation(args.text, args.punctuation)
        words = []

        doc = model(text)

        for token in doc:
            ready_lemma = token.text[0].isupper() and token.lemma_.capitalize() or token.lemma_
            if (args.just_lemma == True):
                ready_lemma = token.lemma_

            if args.verb == False:
                if "VERB" != token.pos_:
                    words.append(ready_lemma)
            else:
                words.append(ready_lemma)
        
        gc.collect()

        return " ".join(words).replace(" - ", "-")

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

    def correct(self, data: str, model = None) -> str:
        
        nlp = model is None and spacy.load("ru_core_news_sm") or model
        doc = nlp(data)

        semantics = []

        for token in doc:
            semantics.append((token.text, token.pos_))

        if len(semantics) > 1:
            if semantics[-2][1] == "ADJ" and semantics[-1][1] == "NOUN":
                adj = ""
                for s in semantics[:-1]:
                    adj = adj + "%s " % (s[0])
                return self.correct_endings(
                    "{adj} {noun}", adj.strip(), semantics[-1][0]
                )
            elif semantics[1][1] == "ADJ" and semantics[0][1] == "NOUN":
                return self.correct_endings(
                    "{adj} {noun}", semantics[1][0], semantics[0][0]
                )

        return data

    def correct_triplets(self, triplets, model) -> List[tuple]:
        
        """
        Скорректировать триплеты - только для русского языка
        Parameters:
        
        triplets: массив tuple
        """
        
        corrects = []
        if triplets is not None:
            for t in triplets:
                
                left = self.correct(t[0].replace(" - ", "-"), model)
                predicate = t[1]
                right = self.correct(t[2].replace(" - ", "-"), model)
                matchers = t[3]

                corrects.append((left, predicate, right, matchers))
            triplets = corrects
        return corrects

    def get_model(self, lang: str):
        
        """
        Получение модели Spacy
        Parameters:
        
        lang: Язык
        """

        if lang     == "english":
            return spacy.load("en_core_web_sm")
        elif lang   == "russian":
            return spacy.load("ru_core_news_sm")
        elif lang   == "kazakh":
            return spacy_udpipe.load_from_path(
                "ky",
                "%s/ApplicationService/Files/udpipe/%s.udpipe"
                % (self.wd, "kazakh-ud-2.0-170801"),
            )
        return None

    
    def get_triples(self, args: TripletsParamsDto) -> List[TripletsDto]:
        
        """
        Получение триплетов
        Авторы: Курмаш Апаев, Алия Нугуманова
        Parameters:
        
        args: TripletsParamsDto
        """

        nlp_model = self.get_model(args.lang)
        if nlp_model is None:
            return []

        stop = self.get_stop_words(args.lang)
        data = u"%s" % (args.data) 
        for s in [" — ", " - ", "−"]:
            data = data.replace(s, " ")

        for w in stop:
            nlp_model.vocab[w].is_stop = True

        triplets: List[tuple] = []

        if args.method == "knowlegegraph":
            sentences = knowlege_graph.getSentences(data, nlp_model, args.lang)
            triplets = knowlege_graph.get_triplets(RelationTripletsParamsDto(nlp_model, sentences))
        
        if args.method == "bert":
            data = re.sub(" +", " ", data)
            sentences: List[str] = []
            for line in self.split_sentence(data):
                if line.endswith("."):
                    line = line[:-1]
                sentences.append(line)
                
            if args.lang == "russian":
                with concurrent.futures.ThreadPoolExecutor() as executor:
                    future = executor.submit(
                        spacy_relation.get_triplets, 
                        RelationTripletsParamsDto(
                        "/home/user/Sorge/Sorge/ApplicationService/Files/models/ru_geo_gpu_v1", 
                        sentences, 
                        args.lang, 
                        develop_mode
                    ))
                    triplets = future.result()
                    
                    del future
            
        if args.method == "spacy":
            if args.lang in ["russian"]:
                 data = self.tokenize(
                     TokenizeParamsDto(data, args.lang, False, True), 
                     nlp_model
                    )
            
            data = re.sub(" +", " ", data)

            sentences: List[str] = []
            for line in self.split_sentence(data):
                if line.endswith("."):
                    line = line[:-1]
                sentences += relation.find_dublicates(nlp_model, line)

            triplets = relation.get_triplets(
                RelationTripletsParamsDto(nlp_model, sentences, args.lang, develop_mode)
            )
            if args.lang == "russian":
                triplets = self.correct_triplets(triplets, nlp_model)

        del nlp_model
        gc.collect()
        
        return [TripletsDto(t[0], t[1], t[2], t[3]) for t in triplets]

    def rake_extract(self, data: str, lang: str = "russian") -> List[KeyWordDto]:
        model = self.get_model(lang)
        
        data = u"%s" % (data)
        stop_words = set(self.get_stop_words(lang))
        text: str = self.tokenize(
            TokenizeParamsDto(data, lang, False, False, True),
            model
        )

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
        result: List[KeyWordDto] = []

        for w in words:
            text = w[1]
            score = w[0]
            if lang == "russian":
                try:
                    text = self.correct(text, model)
                except Exception as e:
                    print(str(e))

            result.append(KeyWordDto(text, score))

        del model

        gc.collect()

        return result

    def tf_extract(self, data: str, lang: str = "russian") -> List[KeyWordDto]:
        model = self.get_model(lang)

        stop_words = self.get_stop_words(lang)
        ls = self.split_sentence(data)

        text_array = []
        for item in ls:
            text = self.delete_punctuation(item)
            text = self.tokenize(
                TokenizeParamsDto(text, lang, True, False, True),
                model
            )
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
