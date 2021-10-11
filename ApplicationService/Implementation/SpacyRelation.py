import gc
import os

from ApplicationService.Dtos.RelationTripletsParamsDto import RelationTripletsParamsDto

os.environ["TF_CPP_MIN_LOG_LEVEL"] = "3"

import spacy
from ApplicationService.Modules.SpacyRelationPipeline import (
    make_relation_extractor,
    score_relations,
)
from ApplicationService.Modules.SpacyRelationModel import (
    create_relation_model,
    create_classification_layer,
    create_instances,
    create_tensors,
)
from spacy.tokens import DocBin, Doc

from typing import List
from interface import implements
from ApplicationService.Interfaces.IRelation import IRelation


class SpacyRelationService(implements(IRelation)):
    def __init__(self, config):
        self.nlp = None
        self.relationAlias = {
            "river-mouth": "впадает в",
            "river-region": "находится в",
            "river-source": "вытекает из",
            "river-construct": "сооружение на реке",
            "river-settlement": "сооружение на реке",
            "other": "другое",
        }

    def get_triplets(self, args: RelationTripletsParamsDto, queue=None) -> List[tuple]:

        triplets = []

        nlp = spacy.load(args.nlp)

        for text in args.sentences:
            doc_entities = nlp(text)
            entities = []

            for ent in doc_entities.ents:
                if args.develop_mode == True:
                    print(ent.text, ent.start_char, ent.end_char, ent.label_)

                entities.append((ent.start_char, ent.end_char, ent.label_))

            sentence = [(text, entities)]

            for text, annotations in sentence:
                words = [t.text for t in doc_entities]
                spaces = [t.whitespace_ for t in doc_entities]
                pred = Doc(
                    nlp.vocab,
                    words=words,
                    spaces=spaces,
                )

                ents = []
                for start, end, label in annotations:
                    span = doc_entities.char_span(start, end, label=label)
                    ents.append(span)
                pred.ents = ents

                for _, proc in nlp.pipeline:
                    pred = proc(pred)

                for value, rel_dict in pred._.rel.items():
                    for e in pred.ents:
                        for b in pred.ents:
                            if e.start == value[0] and b.start == value[1]:
                                if e.text != b.text:
                                    m = max(rel_dict, key=lambda k: rel_dict.get(k))
                                    if rel_dict[m] > 0.2:
                                        pr = "{:8.3f}".format(rel_dict[m]).strip()

                                        if args.develop_mode == True:
                                            print(
                                                f"Сущности: {e.text, b.text} --> Связь: {m} {pr}"
                                            )

                                        include = [
                                            t
                                            for t in triplets
                                            if t[0] == e.text and t[2] == b.text
                                        ]
                                        if not any(include):
                                            triplets.append(
                                                (
                                                    e.text,
                                                    m.lower() in self.relationAlias
                                                    and self.relationAlias[m.lower()]
                                                    or m,
                                                    b.text,
                                                    (e.label_, pr, b.label_),
                                                )
                                            )

        if queue is not None:
            queue.put(triplets)

        return triplets
