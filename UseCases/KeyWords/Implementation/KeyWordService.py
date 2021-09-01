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

from Infrastructure.Implementation.kaznlp.normalization.ininorm import Normalizer

from Infrastructure.Implementation.kaznlp.tokenization.tokrex import TokenizeRex
from Infrastructure.Implementation.kaznlp.tokenization.tokhmm import TokenizerHMM
from Infrastructure.Implementation.kaznlp.lid.lidnb import LidNB
from Infrastructure.Implementation.kaznlp.morphology.analyzers import AnalyzerDD
from Infrastructure.Implementation.kaznlp.morphology.taggers import TaggerHMM

class KeyWordService(implements(IKeyWordService)):
    def __init__(self, config):
        self.ru_lemmatizer = rulemma.Lemmatizer()
        self.ru_lemmatizer.load()
        self.ru_tokenizer = rutokenizer.Tokenizer()
        self.ru_tokenizer.load()
        self.ru_tagger = rupostagger.RuPosTagger()
        self.ru_tagger.load()

        self.mdl = os.path.join('/home/user/Sorge/Sorge/Infrastructure/Implementation/kaznlp', 'tokenization', 'tokhmm.mdl')
        self.kz_tokenizer = TokenizerHMM(model = self.mdl)
        self.kz_analyzer = AnalyzerDD()
        self.kz_analyzer.load_model(os.path.join('/home/user/Sorge/Sorge/Infrastructure/Implementation/kaznlp', 'morphology', 'mdl'))
        self.kz_tagger = TaggerHMM(lyzer=self.kz_analyzer)
        self.kz_tagger.load_model(os.path.join('/home/user/Sorge/Sorge/Infrastructure/Implementation/kaznlp', 'morphology', 'mdl'))

    def get_stop_words(self, lang = "russian"):
        if lang == "kazakh":
            stop_words = []
            stop_words.append("бұл")
            stop_words.append("мен")
            stop_words.append("сен")
            stop_words.append("өз")
            return stop_words
        else:
            stop_words = stopwords.words(lang)
            stop_words.append("который")
            stop_words.append("также")
            stop_words.append("именно")
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
        words = []

        if lang == "kazakh":
            for sentence in self.kz_tokenizer.tokenize(text):
                lower_sentence = map(lambda x: x.lower(), sentence)
                for i, a in enumerate(self.kz_tagger.tag_sentence(lower_sentence)):
                    if '_R_ET' not in str(a) and '_R_EB' not in str(a):                       
                        try:
                            lemma = str(a).split('_')[0]
                            words.append(lemma) 
                        except:
                            pass
        else:       
            tokens  = self.ru_tokenizer.tokenize(text)
            tags    = self.ru_tagger.tag(tokens)
            lemmas  = self.ru_lemmatizer.lemmatize(tags)

            for word, tags, lemma, *_ in lemmas:
                if "VERB" not in tags:
                    words.append(lemma)

        return " ".join(words)

    def rake_extract(self, data, lang = "russian"):
        stop_words = set(self.get_stop_words(lang))
        data = self.tokenize(data, lang)
        max_length = 2

        r = Rake(stopwords=stop_words, min_length=1, max_length=max_length, language=lang)
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
