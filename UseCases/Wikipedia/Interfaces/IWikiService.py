from typing import List
from interface import Interface
from ApplicationService.Dtos.ParseDto import ParseDto
from ApplicationService.Dtos.ResultTablesDto import ResultTablesDto

class IWikiService(Interface):
    def search(self, word: str) -> List:
        pass
