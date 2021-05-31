from typing import List
import pandas as pd
from interface import implements
from UseCases.Parser.Interfaces.IParserService import IParserService
from UseCases.Parser.Dto.ParseDto import ParseDto
from UseCases.Parser.Dto.ResultTablesDto import ResultTablesDto

class ParserService(implements(IParserService)):
    def __init__(self, config):
        pass

    def get_data(self, data: ParseDto) -> ResultTablesDto:

        if data.url is not None:
            tables = pd.read_html(data.url, encoding="utf-8")
            if len(tables) > 0:
                list = []
                for t in tables:
                    json = t.to_dict("records")
                    list.append(json)
                return ResultTablesDto(list)

        return ResultTablesDto([])
