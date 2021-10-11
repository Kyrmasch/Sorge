from interface import Interface
from ApplicationService.Dtos.ParseDto import ParseDto
from ApplicationService.Dtos.ResultTablesDto import ResultTablesDto


class IHtmlParserService(Interface):
    def get_data(self, data: ParseDto) -> ResultTablesDto:
        pass
