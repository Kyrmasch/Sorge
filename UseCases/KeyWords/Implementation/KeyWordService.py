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
import operator
from nltk.tokenize import sent_tokenize
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.decomposition import LatentDirichletAllocation

class KeyWordService(implements(IKeyWordService)):
    def __init__(self, config):
        self.lemmatizer = rulemma.Lemmatizer()
        self.lemmatizer.load()

        self.tokenizer = rutokenizer.Tokenizer()
        self.tokenizer.load()

        self.tagger = rupostagger.RuPosTagger()
        self.tagger.load()

    def get_stop_words(self, lang = "russian"):
        stop_words = stopwords.words(lang)
        stop_words.append("который")
        stop_words.append("также")
        return stop_words

    def split_sentence(self, data):
        return sent_tokenize(data)

    def delete_punctuation(self, data):
        punctuations = list(string.punctuation)
        punctuations.append("«")
        punctuations.append("»")
        punctuations.append("—")

        tokens = [i for i in word_tokenize(data) if i not in punctuations]
        return " ".join(tokens).lower()

    def tokenize(self, text, lang = "russian"):

        text = self.delete_punctuation(text)

        tokens  = self.tokenizer.tokenize(text)
        tags    = self.tagger.tag(tokens)
        lemmas  = self.lemmatizer.lemmatize(tags)

        words = []

        for word, tags, lemma, *_ in lemmas:
            if "VERB" not in tags:
                words.append(lemma)

        return " ".join(words)

    def rake_extract(self, data, lang = "russian"):
        stop_words = set(self.get_stop_words(lang))
        data = self.tokenize(data)

        r = Rake(stopwords=stop_words, min_length=1, max_length=2)
        r.extract_keywords_from_text(data)
        words = r.get_ranked_phrases_with_scores()

        return words

    def tf_extract(self, data, lang = "russian"):
        stop_words = self.get_stop_words(lang)
        ls = self.split_sentence(data)

        text_array = []
        for item in ls:
            text = self.delete_punctuation(item)
            text = self.tokenize(text, lang)
            text_array.append(text)

        corpus = pd.DataFrame(text_array)
        corpus = corpus.rename(columns={0: 'Description'})
        
        vectorizer = TfidfVectorizer(stop_words=stop_words)
        X = vectorizer.fit_transform(corpus['Description'])
        result = [tuple(a) for a in zip(X.toarray()[0], vectorizer.get_feature_names())]
        
        return result
