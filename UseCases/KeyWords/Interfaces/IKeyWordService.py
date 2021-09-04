from interface import Interface
from typing import List

class IKeyWordService(Interface):
    def rake_extract(self, data: str, lang: str ="russian"):
        pass

    def tf_extract(self, data: str, lang: str ="russian"):
        pass

