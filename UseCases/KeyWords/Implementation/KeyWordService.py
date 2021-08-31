from typing import List
from interface import implements
import pandas as pd
from UseCases.KeyWords.Interfaces.IKeyWordService import IKeyWordService
from rake_nltk import Rake
from nltk.corpus import stopwords
import rutokenizer
import rupostagger
import rulemma
import string
import re, os, string
from nltk.tokenize import word_tokenize
from sklearn.feature_extraction.text import TfidfVectorizer


class KeyWordService(implements(IKeyWordService)):
    def __init__(self, config):
        pass

    def get_stop_words(self, lang="russian"):
        stop_words = stopwords.words(lang)
        stop_words.append("который")
        stop_words.append("также")
        return stop_words

    def tokenize(self, text, lang="russian"):

        punctuations = list(string.punctuation)
        punctuations.append("«")
        punctuations.append("»")
        punctuations.append("—")

        tokens = [i for i in word_tokenize(text) if i not in punctuations]
        text = " ".join(tokens).lower()

        lemmatizer = rulemma.Lemmatizer()
        lemmatizer.load()

        tokenizer = rutokenizer.Tokenizer()
        tokenizer.load()

        tagger = rupostagger.RuPosTagger()
        tagger.load()

        tokens = tokenizer.tokenize(text)
        tags = tagger.tag(tokens)
        lemmas = lemmatizer.lemmatize(tags)

        words = []

        for word, tags, lemma, *_ in lemmas:
            if "VERB" not in tags:
                words.append(lemma)

        return " ".join(words)

    def rake_extract(self, data, lang="russian"):

        stop_words = set(self.get_stop_words(lang))
        data = self.tokenize(data)

        r = Rake(stopwords=stop_words, min_length=1, max_length=2)
        r.extract_keywords_from_text(data)
        words = r.get_ranked_phrases_with_scores()

        return words

    def tf_extract(self, data, lang="russian"):
        stop_words = self.get_stop_words(lang)

        return []
