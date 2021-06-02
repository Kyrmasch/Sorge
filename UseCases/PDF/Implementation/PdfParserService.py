from typing import List
import pandas as pd
from interface import implements
from UseCases.PDF.Interfaces.IPdfParserService import IPdfParserService
from ApplicationService.Dtos.ParseDto import ParseDto
from ApplicationService.Dtos.ResultTablesDto import ResultTablesDto
import tabula
import pandas as pd

class PdfParserService(implements(IPdfParserService)):
    def __init__(self, config):
        pass

    def get_data(self, data: ParseDto) -> ResultTablesDto:
        
        if data.url is not None:
            tables = tabula.read_pdf(data.url, pages='all')
            list = []
            for t in tables:
                json = t.to_dict("records")
                list.append(json)
            return ResultTablesDto(list)

        return ResultTablesDto([])
