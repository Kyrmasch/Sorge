from numpy import result_type
from Web.Dtos.GetGraphDto import GetGraphDto
import simplejson
from flask import (
    request,
    jsonify,
    request,
    redirect,
    url_for,
)
import os
import time
from UseCases.DepentencyInjection import keywords
from langdetect import detect
from UseCases.KeyWords.Interfaces.Dtos.KeyWordDto import KeyWordDto
from Web.Dtos.NodeDto import NodeDto
from Web.Dtos.EdgeDto import EdgeDto


def check_lang():
    data = request.json
    text = data["text"]
    lang = detect(text)

    result = "kazakh"
    if lang == "en":
        result = "english"
    elif lang == "ru":
        result = "russian"

    kz_letters = ["ә", "і", "ң", "ғ", "ү", "ұ", "қ", "ө"]
    for l in kz_letters:
        if l in text:
            result = "kazakh"
            break

    return simplejson.dumps(
        {"value": result}, ignore_nan=True, encoding="utf-8", ensure_ascii=False
    )


def get_example_text():
    example = open(
        "%s/ApplicationService/Files/examples/russian.txt" % (os.getcwd()), "r"
    )
    text = example.read()
    return simplejson.dumps(
        {"value": text}, ignore_nan=True, encoding="utf-8", ensure_ascii=False
    )


def map_build():
    """
    Построить
    Построить концепт карту из текста
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
                  text:
                    type: string
                  method:
                    type: string
                    enum: ["rake", "tfidf"]
                  language:
                    type: string
                    enum: ["russian", "english", "kazakh"]
            examples:
                Default:
                  value:
                    text: ""
                    method: "rake"
                    language: "russian"
    security:
        - ApiKeyAuth: []
    responses:
      200:
        description: Концепт карта
        content:
            application/json:
              schema:
                $ref: '#/components/schemas/Graph'
    """
    data = request.json
    text = data["text"]
    method = data["method"]
    language = data["language"]

    graph = getGraph(method, language, text)

    return simplejson.dumps(
        {"data": graph.__dict__}, ignore_nan=True, encoding="utf-8", ensure_ascii=False
    )


def getGraph(method, language, text) -> GetGraphDto:

    keys = []
    if method == "rake":
        keys = keywords.rake_extract(text, language)
    elif method == "tfidf":
        keys = keywords.tf_extract(text, language)

    nodes = []
    ls_keywords = []

    index = 1
    for key in keys:
        if key.word is not None:
            if len(key.word.strip()) > 0:
                nodes.append(NodeDto(index, key.score, key.word).__dict__)
                ls_keywords.append((key.score, key.word))
                index = index + 1

    triplets = keywords.get_triples(text, language, "not", entities = ls_keywords)

    edges = [
        {"from": 2, "to": 8, "value": 3, "title": "3 emails per week"},
        {"from": 2, "to": 9, "value": 5, "title": "5 emails per week"},
        {"from": 2, "to": 10, "value": 1, "title": "1 emails per week"},
        {"from": 4, "to": 6, "value": 8, "title": "8 emails per week"},
        {"from": 5, "to": 7, "value": 2, "title": "2 emails per week"},
        {"from": 4, "to": 5, "value": 1, "title": "1 emails per week"},
        {"from": 9, "to": 10, "value": 2, "title": "2 emails per week"},
        {"from": 2, "to": 3, "value": 6, "title": "6 emails per week"},
        {"from": 3, "to": 9, "value": 4, "title": "4 emails per week"},
        {"from": 5, "to": 3, "value": 1, "title": "1 emails per week"},
        {"from": 2, "to": 7, "value": 4, "title": "4 emails per week"},
    ]

    return GetGraphDto(nodes, edges, ls_keywords)
