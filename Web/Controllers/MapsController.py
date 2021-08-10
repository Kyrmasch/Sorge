import simplejson
from flask import (
    request,
    jsonify,
    request,
    redirect,
    url_for,
)
import time

def build():
    data = request.json
    text = data["text"]
    time.sleep(5)
    return simplejson.dumps({"result": "maps"}, ignore_nan=True, encoding="utf-8") 