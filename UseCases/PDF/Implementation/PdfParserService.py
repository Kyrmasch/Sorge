from typing import List
from interface import implements
from UseCases.PDF.Interfaces.IPdfParserService import IPdfParserService
from ApplicationService.Dtos.ParseDto import ParseDto
from ApplicationService.Dtos.ResultTablesDto import ResultTablesDto
import tabula
import pandas as pd
import string
import numpy as np
from Utils.DataFrame import NaN

class PdfParserService(implements(IPdfParserService)):
    def __init__(self, config):
        pass

    def get_data(self, data: ParseDto) -> ResultTablesDto:
        
        if data.url is not None:
            tables = tabula.read_pdf(data.url, pages='all', multiple_tables=True) #320-328
            list = []
            for t in tables:
                df = NaN(t)
                json = df.to_dict("records")
                list.append(json)
            return ResultTablesDto(list)

        return ResultTablesDto([])
