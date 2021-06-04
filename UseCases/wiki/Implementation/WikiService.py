from typing import List
from interface import implements
from UseCases.wiki.Interfaces.IWikiService import IWikiService
import wikipedia
import numpy as np
from Utils.DataFrame import NaN

wikipedia.set_lang("ru")

class WikiService(implements(IWikiService)):
    def __init__(self, config):
        pass

    def search(self, word: str) -> List:
        if word is not None:
            return wikipedia.search(word)
        return []

    def get_page(self, page: str):
        return wikipedia.page(page).links
