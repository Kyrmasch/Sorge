from ApplicationService.Dtos.SettingsUrlDto import SettingsUrlDto
from Web.Dtos.GetTablesDto import GetTablesDto
from flask import (
    request,
    request,
)
from flask_login import current_user
import simplejson
from UseCases.DepentencyInjection import html, pdf, image, wiki
from ApplicationService.Dtos.ParseDto import ParseDto
from ApplicationService.Dtos.ResultTablesDto import ResultTablesDto
import os

def get_tabs():
    tabs = []

    if current_user.system == 'sorge':
        tabs.append({
                    'text': 'Парсер', 'code': '', 'itemKey': 1
                })
    elif current_user.system == 'maps':
        tabs.append({
                    'text': 'Концепт карта', 'code': 'maps', 'itemKey': 1
                })
    
    tabs.append({
                    'text': 'Настройки', 'code': 'settings', 'itemKey': 2
                })

    return simplejson.dumps(tabs, ignore_nan=True, encoding="utf-8")

def get_tables():
    data = request.json
    resultTablesDto = ResultTablesDto([])
    if data["url"] is not None:
        parseDto = ParseDto(data["url"])
        parseDto.settings = (
            data["settings"] is not None
            and SettingsUrlDto(
                _from = data["settings"]["from"], 
                _to = data["settings"]["to"], 
                _merge = data["settings"]["merge"])
            or SettingsUrlDto(0, 0)
        )

        _, file_extension = os.path.splitext(data["url"])

        if file_extension in [".pdf"]:
            resultTablesDto: ResultTablesDto = pdf.get_data(parseDto)
        elif file_extension in [".jpg", ".png", "jpeg"]:
            resultTablesDto: ResultTablesDto = image.get_data_cv(parseDto)
        else:
            resultTablesDto: ResultTablesDto = html.get_data(parseDto)

    result = simplejson.dumps(
        GetTablesDto(resultTablesDto.tables, resultTablesDto.core_columns).__dict__,
        ignore_nan=True,
        encoding="utf-8",
    )

    return result


def get_wiki():
    data = request.json
    pages = []
    info = None
    if data["word"] is not None:
        pages = wiki.search(data["word"])
        wds = wiki.get_wd(data["word"])

        if wds is not None:
            if wds.shape[1] > 0:
                wds = wds[
                    wds["type.value"] == "http://www.wikidata.org/entity/Q4830453"
                ]
                try:
                    wd = wds["item.value"].iloc[0]
                    wd = "wd:%s" % (wd.rsplit("/", 1)[-1])
                    props = wiki.get_props(wd)
                    ls = props["objectLabel.value"].tolist()
                    info = ", ".join(ls)
                except:
                    pass
    
    return simplejson.dumps(
        {"pages": pages, "info": info}, ignore_nan=True, encoding="utf-8"
    )
