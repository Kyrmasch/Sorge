from interface import Interface
from UseCases.Dto.Parser.ParseDto import ParseDto
from UseCases.Dto.Parser.ResultTablesDto import ResultTablesDto

class IParserService(Interface):
    def get_data(self, data: ParseDto) -> ResultTablesDto:
        pass
