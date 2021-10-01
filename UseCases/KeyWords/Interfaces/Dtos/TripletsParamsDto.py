from typing import List

class TripletsParamsDto(object):
    def __init__(self, data: str, lang: str, method="knowlegegraph", entities: List[tuple] = []) -> None:
        self.data       = data
        self.lang       = lang
        self.method     = method
        self.entities   = entities