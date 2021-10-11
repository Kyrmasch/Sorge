from typing import List


class RelationTripletsParamsDto(object):
    def __init__(
        self,
        nlp,
        sentences: List[str] = [],
        lang: str = "english",
        develop_mode: bool = False,
    ) -> None:
        self.nlp = nlp
        self.sentences = sentences
        self.lang = lang
        self.develop_mode = develop_mode
