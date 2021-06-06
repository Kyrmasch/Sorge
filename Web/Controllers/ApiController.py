from Web.Dtos.GetTablesDto import GetTablesDto
from flask import (
    request,
    request,
)
import simplejson
from UseCases.DepentencyInjection import html, pdf, image, wiki
from ApplicationService.Dtos.ParseDto import ParseDto
from ApplicationService.Dtos.ResultTablesDto import ResultTablesDto
import os

def get_tables():
    data = request.json
    resultTablesDto = ResultTablesDto([])
    if data["url"] is not None:
        parseDto = ParseDto(data["url"])
        filename, file_extension = os.path.splitext(data["url"])
       
        if (file_extension in [".pdf"]):
            resultTablesDto: ResultTablesDto = pdf.get_data(parseDto)
        elif (file_extension in [".jpg", ".png", "jpeg"]):
            resultTablesDto: ResultTablesDto = image.get_data_cv(parseDto)
        else:
            resultTablesDto: ResultTablesDto = html.get_data(parseDto)

    result = simplejson.dumps(
        GetTablesDto(resultTablesDto.tables, resultTablesDto.core_columns).__dict__, 
        ignore_nan=True, 
        encoding="utf-8"
    )

    return result

def get_wiki():
    data = request.json
    pages = []
    if data["word"] is not None:
        pages = wiki.search(data["word"])
    return simplejson.dumps({ 'pages': pages }, 
        ignore_nan=True, 
        encoding="utf-8")