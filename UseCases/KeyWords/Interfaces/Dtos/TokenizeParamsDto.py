import string
from typing import List

class TokenizeParamsDto(object):
    def __init__(self, text: str, lang: str = "russian", punctuation: bool = True, verb: bool = False, just_lemma = False) -> None:
        self.text           = text
        self.lang           = lang
        self.punctuation    = punctuation
        self.verb           = verb
        self.just_lemma     = just_lemma