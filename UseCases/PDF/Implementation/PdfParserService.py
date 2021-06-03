from typing import List
from interface import implements
from UseCases.PDF.Interfaces.IPdfParserService import IPdfParserService
from ApplicationService.Dtos.ParseDto import ParseDto
from ApplicationService.Dtos.ResultTablesDto import ResultTablesDto
import tabula
import pandas as pd
import string
import numpy as np

class PdfParserService(implements(IPdfParserService)):
    def __init__(self, config):
        pass

    def get_data(self, data: ParseDto) -> ResultTablesDto:
        
        if data.url is not None:
            tables = tabula.read_pdf(data.url, pages='327-328') #320-328
            list = []
            for t in tables:
                
                df = t.replace(r'\r+|\n+|\t+|\/+',' ', regex=True)
                df = df.replace(r'\s+',' ', regex=True)
                df = df.dropna(axis=1, how='all')
                df = df.replace(np.nan, '-', regex=True)
                json = df.to_dict("records")
                list.append(json)
            return ResultTablesDto(list)

        return ResultTablesDto([])
