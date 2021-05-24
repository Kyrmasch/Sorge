from flask import (
    request,
    request,
)
import simplejson
from UseCases.Services.ParserService import ParserService

parcer = ParserService({})

def get_tables():
    data = request.json
    tables = []
    if data["url"] is not None:
        url = data["url"]
        tables = parcer.get_data(url)

    result = simplejson.dumps({"result": tables}, ignore_nan=True, encoding='utf-8')

    return result
