from numpy import result_type
from Web.Dtos.GetGraphDto import GetGraphDto
import simplejson
from flask import (
    request,
    request,
)

from collections import Counter
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

    display_keywords = []

    if triples is not None:

      counter_array = []
      for t in triples:
        counter_array.append(t[0])
        counter_array.append(t[2])

      counter = dict(Counter(counter_array))

      for t in triples:
          _Object = t[0]
          _Relation = t[1]
          _Subject = t[2]

          Io = []
          Is = []

          if (_Object != ""):
              Io = [x for x, y in enumerate(display_keywords) if y[1] == _Object]
              if len(Io) == 0:
                  display_keywords.append((1, _Object))
                  Io = [x for x, y in enumerate(display_keywords) if y[1] == _Object]
                  nodes.append(NodeDto(Io[0] + 1, 0,  _Object, counter.get(_Object, 1)).__dict__)
          
          if (_Subject != ""):
              Is = [x for x, y in enumerate(display_keywords) if y[1] == _Subject]
              if len(Is) == 0:
                  display_keywords.append((1, _Subject))
                  Is = [x for x, y in enumerate(display_keywords) if y[1] == _Subject]
                  nodes.append(NodeDto(Is[0] + 1, 0,_Subject, counter.get(_Subject, 1)).__dict__)       

          if (len(Io) > 0) and (len(Is) > 0):
              edges.append(EdgeDto(
                  Io[0] + 1, 
                  Is[0] + 1, 
                  0, 
                  _Relation,
                  0).to_json())


    return GetGraphDto(nodes, edges, display_keywords)
