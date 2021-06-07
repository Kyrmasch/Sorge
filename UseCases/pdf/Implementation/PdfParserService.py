from typing import List
from interface import implements
from UseCases.pdf.Interfaces.IPdfParserService import IPdfParserService
from ApplicationService.Dtos.ParseDto import ParseDto
from ApplicationService.Dtos.ResultTablesDto import ResultTablesDto
import tabula
import pandas as pd
import camelot
import numpy as np
from Utils.DataFrame import NaN, GetCoreColumn


class PdfParserService(implements(IPdfParserService)):
    def __init__(self, config):
        pass

    def get_data(self, data: ParseDto) -> ResultTablesDto:
        if data.url is not None:
            try:
                pages = "all"
                if data.settings._from > 0 or data.settings._to > 0:
                    pages = "%s-%s" % (data.settings._from, data.settings._to)
                
                tables = tabula.read_pdf(
                    data.url,
                    pages=pages,
                    lattice=False,
                    java_options=[
                        "-Dorg.slf4j.simpleLogger.defaultLogLevel=off",
                        "-Dorg.apache.commons.logging.Log=org.apache.commons.logging.impl.NoOpLog",
                    ],
                )

                list = []
                cores = []

                for t in tables:
                    df = NaN(t)

                    core = GetCoreColumn(df)
                    if core is not None:
                        cores.append(core)

                    json = df.to_dict("records")
                    list.append(json)

                Tresult = ResultTablesDto(list)
                Tresult.core_columns = cores

                return Tresult
            except Exception as err:
                print(str(err))

        return ResultTablesDto([])
