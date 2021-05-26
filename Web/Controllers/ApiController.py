from flask import (
    request,
    request,
)
import simplejson
from UseCases.DepentencyInjection import parser
from UseCases.Dto.Parser.ParseDto import ParseDto
from UseCases.Dto.Parser.ResultTablesDto import ResultTablesDto


def get_tables():
    data = request.json
    tables = []
    if data["url"] is not None:
        parseDto = ParseDto(data["url"])
        resultTablesDto = parser.get_data(parseDto)

    result = simplejson.dumps(
        {"result": resultTablesDto.tables}, ignore_nan=True, encoding="utf-8"
    )

    return result
