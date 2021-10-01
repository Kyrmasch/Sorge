from operator import le
import os

from ApplicationService.Dtos.TextSpanDto import TextSpanDto

os.environ["TF_CPP_MIN_LOG_LEVEL"] = "3"

import re
from typing import List
from interface import implements
from ApplicationService.Interfaces.IRelation import IRelation
import spacy
from spacy.matcher import Matcher
from ApplicationService.Dtos.RelationDto import RelationDto
from ApplicationService.Dtos.DocumentDto import DocumentDto


class RelationService(implements(IRelation)):
    def __init__(self, config):
        self.lang = "english"

    def get_triplets(
        self, nlp, sentences, lang="english", developer=False
    ) -> List[str]:

        self.lang = lang
        triplets = []

        for line in sentences:
            nlp_line = nlp(line)

            if developer == True:
                print(line)
                for token in nlp_line:
                    print(
                        token.text,
                        token.lemma_,
                        token.pos_,
                        token.tag_,
                        token.dep_,
                        token.shape_,
                        token.is_alpha,
                        token.is_stop,
                    )

            relations = []
            if lang == "english" or lang == "russian":
                doc = DocumentDto(nlp, nlp_line)
                relations = self.extract_relations(doc, developer)
            elif lang == "kazakh":
                relations = self.extract_relations_kz(nlp, nlp_line, developer)

            for relation in relations:
                if lang == "english" or lang == "russian":
                    value = (
                        relation.left_phrase.sentence,
                        relation.relation_phrase.sentence,
                        relation.right_phrase.sentence,
                    )
                elif lang == "kazakh":
                    value = relation

                exists = [t for t in triplets if t[0] == value[0] and t[2] == value[2]]
                if len(exists) == 0:
                    triplets.append(value)

        return triplets

    def extract_relations_kz(self, nlp, doc, developer=False):
        triplets = []

        verbs = self.get_verbs_kz(nlp, doc)
        if any(verbs):
            left_pattern = [
                [{"IS_SENT_START": True, "OP": "+"}, {"POS": "ADJ", "OP": "*"}]
            ]
            left = self.get_noun_kz(nlp, doc, left_pattern)

            right_pattern = [
                [
                    {"IS_SENT_START": False, "POS": "PART", "OP": "*"},
                    {"IS_SENT_START": False, "POS": "NOUN", "OP": "+"},
                    {"POS": "AUX", "OP": "*"},
                    {"POS": "NOUN", "OP": "*"},
                ]
            ]
            right = self.get_noun_kz(nlp, doc, right_pattern)

            if developer == True:
                print((left, verbs, right))
                
            triplets.append((left, verbs, right))

        return triplets

    def construct_text_spans(self, doc, matches):
        ret_spans = []
        for match_id, start, end in matches:
            ret_spans.append(doc.span(start, end))
        return ret_spans

    def extract_relations(self, doc, developer=False):

        relation_spans = self.get_relation_spans(doc)
        noun_phrase_pattern = []

        noun_phrase_pattern.append([{"POS": "NOUN"}])
        noun_phrase_pattern.append([{"POS": "PROPN", "IS_STOP": False}])
        noun_phrase_pattern.append([{"POS": "PRON", "IS_STOP": False}])

        if self.lang == "russian":
            noun_phrase_pattern.append([{"POS": "NOUN"}, {"POS": "NOUN", "OP": "+"}])
            noun_phrase_pattern.append([{"POS": "NOUN"}, {"POS": "PROPN", "OP": "+"}])
            noun_phrase_pattern.append([{"POS": "ADJ", "OP": "+"}, {"POS": "NOUN"}])
            noun_phrase_pattern.append([{"POS": "PROPN", "OP": "+"}, {"POS": "PROPN"}])
            noun_phrase_pattern.append(
                [
                    {"POS": "NOUN", "OP": "+"},
                    {"LEMMA": "-", "OP": "+"},
                    {"POS": "NOUN", "OP": "+"},
                ]
            )

        relations = []

        for span in relation_spans:
            left_noun = self.find_nearest_pattern(
                doc, noun_phrase_pattern, span, True, developer
            )
            right_noun = self.find_nearest_pattern(
                doc, noun_phrase_pattern, span, False, developer
            )

            if (not left_noun is None) and (not right_noun is None):
                relations.append(RelationDto(left_noun, span, right_noun))
        return relations

    def get_relation_spans(self, doc):
        verbs = self.get_verbs(doc)

        pattern = [
            [{"POS": "VERB"}, {"POS": "PART", "OP": "*"}, {"POS": "ADV", "OP": "*"}],
            [
                {"POS": "VERB"},
                {"POS": "ADP", "OP": "*"},
                {"POS": "DET", "OP": "*"},
                {"POS": "AUX", "OP": "*"},
                {"POS": "ADJ", "OP": "*"},
                {"POS": "ADV", "OP": "*"},
            ],
        ]
        if self.lang == "russian":
            pattern = [
                [{"POS": "VERB"}, {"POS": "ADP", "OP": "*"}],
                [
                    {"POS": "VERB"},
                    {"POS": "PART", "OP": "*"},
                    {"POS": "ADV", "OP": "*"},
                ],
                [
                    {"POS": "VERB"},
                    {"POS": "ADP", "OP": "*"},
                    {"POS": "DET", "OP": "*"},
                    {"POS": "AUX", "OP": "*"},
                    {"POS": "ADV", "OP": "*"},
                ],
            ]

        matcher = doc.matcher
        matcher.add("Relation", pattern)
        syntactical_constraint_matches = self.construct_text_spans(
            doc, matcher(doc.doc)
        )

        relation_spans = []
        for verb in verbs:
            verb_spans = [
                span for span in syntactical_constraint_matches if verb in span.sentence
            ]
            joined_spans = self.merge_overlapping_consecutive_word_span(verb_spans)
            longest_span = self.find_longest_span(joined_spans)
            relation_spans.append(longest_span)
        return relation_spans

    def get_verbs(self, doc):
        matcher = doc.matcher
        fluff_pattern = [[{"POS": "VERB"}]]
        matcher.add("Fluff", fluff_pattern)
        matches = matcher(doc.doc)
        verbs = []
        for match_id, start, end in matches:
            verbs.append(doc.doc[start:end].text)
        return verbs

    def get_verbs_kz(self, nlp, doc):
        matcher = Matcher(nlp.vocab)
        pattern = [[{"POS": "ADP", "OP": "*"}, {"DEP": "ROOT"}], [{"DEP": "ROOT"}]]
        matcher.add("Verb", pattern)

        matches = matcher(doc.doc)
        verbs = []
        for match_id, start, end in matches:
            verbs.append(doc.doc[start:end].text)

        verbs.sort(key=lambda s: len(s), reverse=True)
        return verbs[0]

    def get_noun_kz(self, nlp, doc, pattern):
        matcher = Matcher(nlp.vocab)
        matcher.add("Noun", pattern)
        matches = matcher(doc.doc)

        nouns = []
        for match_id, start, end in matches:
            nouns.append(doc.doc[start:end].text)

        if any(nouns):
            nouns.sort(key=lambda s: len(s), reverse=True)
            return nouns[0]
        return None

    def find_nearest_pattern(
        self, doc, pattern, text_span, search_before, developer=False
    ):
        matcher = doc.matcher
        matcher.add("PatternNear", pattern)
        matches = matcher(doc.doc)
        nearest_pattern = None
        spans = self.construct_text_spans(doc, matches)
        sorted_spans = sorted(spans, key=lambda s: s.start_index)

        spans_to_search = []
        if search_before:
            spans_to_search = [
                span
                for span in sorted_spans
                if span.start_index < text_span.start_index
            ]
            spans_to_search.reverse()

        else:
            spans_to_search = [
                span
                for span in sorted_spans
                if span.start_index > text_span.start_index
            ]

        if len(spans_to_search) == 0:
            return None

        if developer == True:
            for span in spans_to_search:
                print("Span: %s" % (span.sentence))

        if len(spans_to_search) > 2:
            for span in spans_to_search:
                if (
                    "-" in span.sentence
                    and len(span.sentence) > 1
                    and span.sentence.startswith("-") == False
                    and span.sentence.endswith("-") == False
                ):
                    return span
            if spans_to_search[1].sentence.startswith(spans_to_search[0].sentence):
                return spans_to_search[1]

        return spans_to_search[0]

    def merge_overlapping_consecutive_word_span(self, text_spans):
        sorted_spans = sorted(text_spans, key=lambda s: s.start_index)
        current_index = 0
        next_index = 1
        merged_overlapping_spans = []
        overlapped_indices = []

        while next_index <= len(sorted_spans) - 1:

            span = sorted_spans[current_index]
            next_span = sorted_spans[next_index]
            potential_overlap = span.join(next_span)

            if potential_overlap is None:
                current_index = next_index
                next_index = next_index + 1
                merged_overlapping_spans.append(span)
            else:
                overlapped_indices.append(next_index)
                sorted_spans[current_index] = potential_overlap
                next_index = next_index + 1

        if next_index - current_index > 1:
            merged_overlapping_spans.append(sorted_spans[current_index])

        last_cons_index = len(sorted_spans) - 1
        if not (last_cons_index in overlapped_indices):
            merged_overlapping_spans.append(sorted_spans[last_cons_index])

        if len(merged_overlapping_spans) == 0:
            return self.merged_cons_spans

        return merged_overlapping_spans

    def find_latest_span(self, text_spans):
        if len(text_spans) == 0:
            return None

        sorted_spans = sorted(text_spans, key=lambda s: s.end_index, reverse=True)
        return sorted_spans[0]

    def find_earliest_span(self, text_spans):
        if len(text_spans) == 0:
            return None

        sorted_spans = sorted(text_spans, key=lambda s: s.start_index)
        return sorted_spans[0]

    def find_longest_span(self, text_spans):
        if len(text_spans) == 0:
            return None

        sorted_spans = sorted(text_spans, key=lambda s: s.length, reverse=True)
        return sorted_spans[0]
