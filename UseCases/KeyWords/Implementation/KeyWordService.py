from typing import List
from interface import implements
import pandas as pd
import os
import numpy as np
from UseCases.KeyWords.Interfaces.IKeyWordService import IKeyWordService
from rake_nltk import Metric, Rake
from nltk.corpus import stopwords
from nltk import WordNetLemmatizer
from multiprocessing import Pool
import nltk
from nltk.stem import SnowballStemmer
import re


class KeyWordService(implements(IKeyWordService)):
    def __init__(self, config):
        pass

    def tokenize(self, text):
        pass

    def rake_extract(self, data, lang="russian"):
        stop_words = set(stopwords.words(lang))
        e = self.tokenize(data)
        print(e)

        r = Rake(stopwords=stop_words, max_length=2)
        r.extract_keywords_from_text(data)
        print(r.get_ranked_phrases())
        return []

    def tf_extract(self, data, lang="russian"):
        return []
