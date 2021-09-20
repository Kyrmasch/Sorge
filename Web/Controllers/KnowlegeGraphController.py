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
from UseCases.KeyWords.Interfaces.Dtos.KeyWordDto import KeyWordDto
from Web.Dtos.NodeDto import NodeDto
from Web.Dtos.EdgeDto import EdgeDto


def map_knowlegegraph_build():
    """
    Построить
    Построить Knowlege Graph из текста
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
                  relation:
                    shema:
                    $ref: '#/components/schemas/RelationMethod'
                  language:
                    shema:
                    ref: '#/components/schemas/Languages'
            examples:
                Default:
                  value:
                    text: ""
                    relation: "spacy"
                    language: "english"
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
    language = data["language"]
    method = data["relation"]

    graph = getGraph(language, text, method)

    return simplejson.dumps(
        {"data": graph.__dict__}, ignore_nan=True, encoding="utf-8", ensure_ascii=False
    )


def getGraph(language, text, method = "knowlegegraph") -> GetGraphDto:

    triples = keywords.get_triples(text, language, method)

    nodes = []
    edges = []

    ls_keywords = []

    for t in triples:
        o = t[0]
        r = t[1]
        s = t[2]

        Io = []
        Is = []

        if (o != ""):
            Io = [x for x, y in enumerate(ls_keywords) if y[1] == o]
            if len(Io) == 0:
                ls_keywords.append((1, o))
                Io = [x for x, y in enumerate(ls_keywords) if y[1] == o]
                nodes.append(NodeDto(Io[0] + 1, 0, o).__dict__)
        
        if (s != ""):
            Is = [x for x, y in enumerate(ls_keywords) if y[1] == s]
            if len(Is) == 0:
                ls_keywords.append((1, s))
                Is = [x for x, y in enumerate(ls_keywords) if y[1] == s]
                nodes.append(NodeDto(Is[0] + 1, 0, s).__dict__)       

        if (len(Io) > 0) and (len(Is) > 0):
            edges.append(EdgeDto(
                Io[0] + 1, 
                Is[0] + 1, 
                0, 
                r,
                0).to_json())


    return GetGraphDto(nodes, edges, ls_keywords)
