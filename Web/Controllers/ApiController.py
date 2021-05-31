from flask import (
    request,
    request,
)
import simplejson
from UseCases.DepentencyInjection import parser
from UseCases.Parser.Dto.ParseDto import ParseDto
from UseCases.Parser.Dto.ResultTablesDto import ResultTablesDto


def get_tables():
    data = request.json
    resultTablesDto = ResultTablesDto([])
    if data["url"] is not None:
        parseDto = ParseDto(data["url"])
        resultTablesDto: ResultTablesDto = parser.get_data(parseDto)

    result = simplejson.dumps(
        {"result": resultTablesDto.tables}, ignore_nan=True, encoding="utf-8"
    )

    return result
