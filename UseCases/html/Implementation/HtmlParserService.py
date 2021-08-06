from typing import List
import pandas as pd
from interface import implements
from UseCases.html.Interfaces.IHtmlParserService import IHtmlParserService
from ApplicationService.Dtos.ParseDto import ParseDto
from ApplicationService.Dtos.ResultTablesDto import ResultTablesDto
from ApplicationService.DepentencyInjection import table as Atable
from bs4 import BeautifulSoup
import requests

class HtmlParserService(implements(IHtmlParserService)):
    def __init__(self, config):
        pass

    def get_data(self, data: ParseDto) -> ResultTablesDto:
        if data.url is not None:
            Rlist = []
            cores = []

            headers = {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '3600',
                'User-Agent': 'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:52.0) Gecko/20100101 Firefox/52.0'
            }

            req = requests.get(data.url, headers)
            soup = BeautifulSoup(req.content, 'html.parser')

            tables = pd.read_html(soup.prettify(), encoding="utf-8")
            if len(tables) > 0:
                list = []
                for dataframe in tables:
                    dataframe, isSave = Atable.aks(dataframe)
                    core, dataframe = Atable.getCoreColumn(dataframe)
                    if (core is not None):
                        cores.append(core)
                    json = dataframe.to_dict("records")
                    Rlist.append(json)

                    Tresult = ResultTablesDto(Rlist)
                    Tresult.core_columns = cores
                    list.append(json)
                
                Tresult = ResultTablesDto(Rlist)
                Tresult.core_columns = cores

                return Tresult

        return ResultTablesDto([])
