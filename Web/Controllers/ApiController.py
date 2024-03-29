from ApplicationService.Dtos.SettingsUrlDto import SettingsUrlDto
from Web.Dtos.GetTablesDto import GetTablesDto
from Web.Dtos.GetWikiDto import GetWikiDto
from Web.Dtos.GetTabsDto import GetTabsDto
from Web.Dtos.TabItemDto import TabItemDto
from flask import Response, request
import asyncio
from flask_login import current_user
import simplejson
from UseCases.DepentencyInjection import html, pdf, image, wiki
from ApplicationService.Dtos.ParseDto import ParseDto
from ApplicationService.Dtos.ResultTablesDto import ResultTablesDto
import os
import json


def get_tabs():
    tabs = []

    if current_user.system == "sorge":
        tabs.append(TabItemDto("Парсер", "", 1).__dict__)
        tabs.append(TabItemDto("Sorge Api", "api", 2).__dict__)
    elif current_user.system == "maps":
        tabs.append(TabItemDto("Концепт карта", "maps", 1).__dict__)
        tabs.append(TabItemDto("Sorge Api", "api", 2).__dict__)
        tabs.append(TabItemDto("Prodigy", "prodigy", 3).__dict__)
        # tabs.append(TabItemDto("Prodigy Api", "prodigy_api", 4).__dict__)

    return simplejson.dumps(
        GetTabsDto(current_user.system, tabs).__dict__,
        ignore_nan=True,
        encoding="utf-8",
    )


def parse_get_tables():
    """
    Парсер таблиц
    Получение таблиц из указанной ссылки
    Автоматическое определения типа входящего документа (html, pdf, jpg)
    ---
    tags:
      - Api
    requestBody:
        required: true
        content:
          application/json:
            schema:
                type : object
                properties:
                  url:
                    type: string
            examples:
                Url:
                  value:
                    url: "https://aviapoisk.kz/raspisanie/aeroporta/ustkamenogorsk"
    security:
        - ApiKeyAuth: []
    responses:
      200:
        description: Массив таблиц с ключевым столбцом
        content:
            application/json:
              schema:
                $ref: '#/components/schemas/ResultTables'
    """

    data = request.json
    resultTablesDto = ResultTablesDto([])
    if data["url"] is not None:
        parseDto = ParseDto(data["url"])
        parseDto.settings = (
            "settings" in data
            and SettingsUrlDto(
                _from=data["settings"]["from"],
                _to=data["settings"]["to"],
                _merge=data["settings"]["merge"],
            )
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
        GetTablesDto(
            resultTablesDto.tables, resultTablesDto.core_columns, resultTablesDto.guids
        ).__dict__,
        ignore_nan=True,
        encoding="utf-8",
        ensure_ascii=False,
    )

    return result


def parse_get_table_by_guid(guid = "7075105353550151027"):
    """
    Получить сохраненные таблицы
    Получить таблицы сохраненные после выполнения парсинга по GUID
    ---
    tags:
      - Developer
    requestBody:
        required: true
        content:
          application/json:
            schema:
                type : object
                properties:
                  guid:
                    type: string
            examples:
                Saved:
                  value:
                    guid: "7075105353550151027"
    security:
        - ApiKeyAuth: []
    responses:
      200:
        description: Массив таблиц с ключевым столбцом
        content:
            application/json:
              schema:
                $ref: '#/components/schemas/ResultTables'
    """

    table = (GetTablesDto([], [], []).__dict__,)

    if guid is not None:
        try:
            with open(
                "%s/ApplicationService/Files/tables/%s.json" % (os.getcwd(), guid),
                encoding="utf-8",
            ) as json_file:
                content = json.load(json_file)
                content["table"] = json.loads(content["table"])
                table = (
                    GetTablesDto(
                        content["table"], content["core"], content["guid"]
                    ).__dict__,
                )
        except Exception as e:
            print(str(e))
        finally:
            pass

    result = simplejson.dumps(
        table, ignore_nan=True, encoding="utf-8", ensure_ascii=False, indent=4, sort_keys=True
    )

    return Response(result, 
            mimetype='application/json',
            headers={'Content-Disposition':'attachment;filename=%s.json' % (guid)})


def parse_get_wiki():
    """
    Информация из википедии
    Получить дополнительную информацию для объекта главного столбца
    ---
    tags:
      - Api
    requestBody:
        required: true
        content:
          application/json:
            schema:
                type : object
                properties:
                  word:
                    type: string
            examples:
                Wiki:
                  value:
                    word: "КазмунайГаз"
    security:
        - ApiKeyAuth: []
    responses:
      200:
        description: Дополнительная информация
        content:
            application/json:
              schema:
                $ref: '#/components/schemas/Wiki'
    """

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
        GetWikiDto(pages, info).__dict__,
        ignore_nan=True,
        encoding="utf-8",
        ensure_ascii=False,
    )
