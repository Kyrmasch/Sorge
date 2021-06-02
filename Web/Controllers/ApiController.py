from flask import (
    request,
    request,
)
import simplejson
from UseCases.DepentencyInjection import parser, pdf
from ApplicationService.Dtos.ParseDto import ParseDto
from ApplicationService.Dtos.ResultTablesDto import ResultTablesDto
import os

def get_tables():
    data = request.json
    resultTablesDto = ResultTablesDto([])
    if data["url"] is not None:
        parseDto = ParseDto(data["url"])
        filename, file_extension = os.path.splitext(data["url"])
        if (file_extension == ".pdf"):
            resultTablesDto: ResultTablesDto = pdf.get_data(parseDto)
        else:
            resultTablesDto: ResultTablesDto = parser.get_data(parseDto)

    result = simplejson.dumps(
        {"result": resultTablesDto.tables}, ignore_nan=True, encoding="utf-8"
    )

    return result
