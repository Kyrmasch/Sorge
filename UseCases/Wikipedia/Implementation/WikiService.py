from typing import List
from interface import implements
from UseCases.Wikipedia.Interfaces.IWikiService import IWikiService
import wikipedia
import numpy as np
import pandas as pd
from SPARQLWrapper import SPARQLWrapper, JSON

wikipedia.set_lang("ru")


class WikiService(implements(IWikiService)):
    def __init__(self, config):
        self.sparql = SPARQLWrapper("https://query.wikidata.org/sparql")

    def search(self, word: str) -> List:
        if word is not None:
            return wikipedia.search(word)
        return []

    def get_page(self, page: str):
        return wikipedia.page(page).links

    def execute_query(self, query: str):
        self.sparql.setQuery(query)
        self.sparql.setReturnFormat(JSON)
        results = self.sparql.query().convert()
        return pd.json_normalize(results["results"]["bindings"])

    def get_wd(self, word: str):
        query = (
            'SELECT * { \
                    VALUES ?searchTerm { "%s" } \
                    SERVICE wikibase:mwapi { \
                        bd:serviceParam wikibase:api "EntitySearch". \
                        bd:serviceParam wikibase:endpoint "www.wikidata.org". \
                        bd:serviceParam wikibase:limit 10 . \
                        bd:serviceParam mwapi:search ?searchTerm. \
                        bd:serviceParam mwapi:language "en". \
                        ?item wikibase:apiOutputItem mwapi:item. \
                        ?num wikibase:apiOrdinal true. \
                    } \
                    ?item (wdt:P279|wdt:P31) ?type \
                } \
                ORDER BY  DESC(?type)'
            % (word)
        )

        try:
            return self.execute_query(query)
        except:
            return None

    def get_props(
        self,
        wd: str,
        props: str = "wdt:P31|wdt:P452|wdt:P159|wdt:P112|wdt:P1037|wdt:P17|wdt:P1454|wdt:P1056",
    ):
        query = (
            'SELECT ?objectLabel ?outcoming  WHERE { \
                    %s (%s) ?object. \
                    ?object wikibase:statements ?outcoming. \
                    SERVICE wikibase:label { bd:serviceParam wikibase:language "ru". } \
                    } \
                    ORDER BY DESC(?outcoming)'
            % (wd, props)
        )
        return self.execute_query(query)

    def get_all_props(self, wd: str):
        query = (
            'SELECT ?predicate ?pLabel ?oLabel WHERE { \
                    %s ?predicate ?o. \
                    BIND(IRI(REPLACE(STR(?predicate), "prop/direct/", "entity/")) AS ?p) \
                    SERVICE wikibase:label { bd:serviceParam wikibase:language "ru". }'
            % (wd)
        )
        return self.execute_query(query)
