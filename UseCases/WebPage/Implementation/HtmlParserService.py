from typing import List
from numpy import true_divide
import pandas as pd
from interface import implements
from UseCases.WebPage.Interfaces.IHtmlParserService import IHtmlParserService
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
            guids = []

            headers = {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '3600',
                'User-Agent': 'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:52.0) Gecko/20100101 Firefox/52.0'
            }

            req = requests.get(data.url, headers)
            soup = BeautifulSoup(req.content, 'html.parser')

            try:
                tables = pd.read_html(soup.prettify(), encoding="utf-8")
                if len(tables) > 0:
                    for df in tables:
                        if df.shape[0] > 3:
                            df = Atable.aks(df)
                            core, df = Atable.getCoreColumn(df)
                            if (core is not None):
                                cores.append(core)

                            save, sha = Atable.save_json(df, core)
                            if sha is not None and save == True:
                                guids.append(sha)
                            json = df.to_dict("records")
                            Rlist.append(json)

                    return ResultTablesDto(Rlist, cores, guids)
            except:
                pass

        return ResultTablesDto([])
