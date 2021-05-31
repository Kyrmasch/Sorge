from interface import Interface
from UseCases.Parser.Dto.ParseDto import ParseDto
from UseCases.Parser.Dto.ResultTablesDto import ResultTablesDto

class IParserService(Interface):
    def get_data(self, data: ParseDto) -> ResultTablesDto:
        pass
