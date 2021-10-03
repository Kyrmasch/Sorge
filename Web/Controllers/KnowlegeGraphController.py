from typing import List
from numpy import result_type
from UseCases.KeyWords.Interfaces.Dtos.TripletsDto import TripletsDto
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
from UseCases.KeyWords.Interfaces.Dtos.TripletsParamsDto import TripletsParamsDto
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

    triples: List[TripletsDto] = keywords.get_triples(TripletsParamsDto(text, language, method))

    for t in triples:
      print(t.to_tuple())

    nodes    = []
    edges    = []
    matchers = []
    entities = []

    if any(triples):

      counter_array = []
      for item in triples:
        counter_array.append(item.left)
        counter_array.append(item.rigth)

      counter = dict(Counter(counter_array))

      for item in triples:
          Io = []
          Is = []

          if (item.left != ""):
              Io = [x for x, y in enumerate(entities) if y[1] == item.left]
              if len(Io) == 0:
                  entities.append((1, item.left))
                  Io = [x for x, y in enumerate(entities) if y[1] == item.left]

                  count = counter.get(item.left, 1)
                  nodes.append(NodeDto(Io[0] + 1, 0,  item.left, count).__dict__)
          
          if (item.rigth != ""):
              Is = [x for x, y in enumerate(entities) if y[1] == item.rigth]
              if len(Is) == 0:
                  entities.append((1, item.rigth))
                  Is = [x for x, y in enumerate(entities) if y[1] == item.rigth]

                  count = counter.get(item.rigth, 1)
                  nodes.append(NodeDto(Is[0] + 1, 0, item.rigth, count).__dict__)       

          if (len(Io) > 0) and (len(Is) > 0):
              edges.append(EdgeDto(
                  Io[0] + 1, 
                  Is[0] + 1, 
                  0, 
                  item.relation,
                  0)
                  .to_json())
              matchers.append(item.matchers)


    return GetGraphDto(nodes, edges, entities, matchers)
