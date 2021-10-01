from interface import Interface
from typing import List
from UseCases.KeyWords.Interfaces.Dtos.TokenizeParamsDto import TokenizeParamsDto
from UseCases.KeyWords.Interfaces.Dtos.TripletsParamsDto import TripletsParamsDto

class IKeyWordService(Interface):

    def get_model(self, lang: str):
        pass
    
    def get_triples(self, args: TripletsParamsDto) -> List[tuple]:
        pass

    def tokenize(self, args: TokenizeParamsDto):
        pass
    
    def rake_extract(self, data: str, lang: str ="russian"):
        pass

    def tf_extract(self, data: str, lang: str ="russian"):
        pass

    def wiki_relation(self, entity: str):
        pass

