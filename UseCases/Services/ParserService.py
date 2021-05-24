import pandas as pd
from interface import implements
from UseCases.Interfaces.IParserService import IParserService

class ParserService(implements(IParserService)):
    def __init__(self, config):
        pass

    def get_data(self, url) -> str:
        if url is not None:
            tables = pd.read_html(url, encoding='utf-8')
            if len(tables) > 0:
                list = []
                for t in tables:
                    json = t.to_dict('records')
                    list.append(json)
                return list

        return []
