import os

from ApplicationService.Dtos.RelationTripletsParamsDto import RelationTripletsParamsDto
from ApplicationService.Dtos.TextSpanDto import TextSpanDto
os.environ["TF_CPP_MIN_LOG_LEVEL"] = "3"

import re
from typing import List
from interface import implements
from ApplicationService.Interfaces.IRelation import IRelation
from spacy.matcher import Matcher
from ApplicationService.Dtos.RelationDto import RelationDto
from ApplicationService.Dtos.DocumentDto import DocumentDto


class RelationService(implements(IRelation)):
    def __init__(self, config):
        self.lang = "english"

    def get_triplets(self, args: RelationTripletsParamsDto) -> List[tuple]:

        self.lang = args.lang
        triplets: List[tuple] = []

        for line in args.sentences:
            nlp_line = args.nlp(line)

            if args.develop_mode == True:
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

            relations : List[RelationDto] = []
            if args.lang in ["english", "russian"]:
                doc = DocumentDto(args.nlp, nlp_line)
                relations = self.extract_relations(doc, args.develop_mode)
            elif args.lang == "kazakh":
                relations = self.extract_relations_kz(args.nlp, nlp_line, args.develop_mode)

            for relation in relations:
                rel_tuple: tuple = relation.get_tuple()
                matchers = relation.get_matchers()

                exists = [t for t in triplets if t[0] == rel_tuple[0] and t[2] == rel_tuple[2]]
                if any(exists) == False:
                    print((rel_tuple[0], rel_tuple[1], rel_tuple[2], matchers))
                    triplets.append((rel_tuple[0], rel_tuple[1], rel_tuple[2], matchers))

        return triplets

    def extract_relations_kz(self, nlp, doc, developer = False) -> List[RelationDto]:
        
        triplets: List[RelationDto] = []

        verb = self.get_verbs_kz(nlp, doc)
        if verb is not None:

            left_pattern = {
                "ADJ (OP*) + NOUN": [{"IS_SENT_START": True, "OP": "+"}, {"POS": "ADJ", "OP": "*"}]
            }
            left, left_matcher = self.get_noun_kz(nlp, doc, left_pattern)

            right_pattern = {
                "AUX (OP*) + PART (OP*) + NOUN (IS_SENT_START = False)":
                    [
                        {"IS_SENT_START": False, "POS": "PART", "OP": "*"},
                        {"IS_SENT_START": False, "POS": "NOUN", "OP": "+"},
                        {"POS": "AUX", "OP": "*"},
                        {"POS": "NOUN", "OP": "*"},
                    ]
            }
            right, right_matcher = self.get_noun_kz(nlp, doc, right_pattern)

            if left is not None and right is not None:
                if developer == True:
                    print((left.text, verb.text, right.text))

                triplets.append(RelationDto(
                    TextSpanDto(left), 
                    TextSpanDto(verb), 
                    TextSpanDto(right),
                    left_matcher,
                    right_matcher
                    )
                )

        return triplets

    def construct_text_spans(self, doc, matches):
        ret_spans = []
        matchs = {}

        for match_id, start, end in matches:
            matchs[doc.span(start, end).sentence] = match_id
            ret_spans.append(doc.span(start, end))
        return ret_spans, matchs

    def extract_relations(self, doc, developer=False) -> List[RelationDto]:

        relation_spans = self.get_relation_spans(doc)

        noun_phrase_dict = {}

        noun_phrase_dict["NOUN"]                                    = [{"POS": "NOUN"}]
        noun_phrase_dict["PROPN (IS_STOP = False)"]                 = [{"POS": "PROPN", "IS_STOP": False}]
        noun_phrase_dict["PRON (IS_STOP = False)"]                  = [{"POS": "PRON", "IS_STOP": False}]

        if self.lang == "russian":
            noun_phrase_dict["NOUN + NOUN (OP+)"]                   = [{"POS": "NOUN"}, {"POS": "NOUN", "OP": "+"}]
            noun_phrase_dict["NOUN + NOUN (OP+)"]                   = [{"POS": "NOUN"}, {"POS": "PROPN", "OP": "+"}]
            noun_phrase_dict["ADJ (OP+) + NOUN"]                    = [{"POS": "ADJ", "OP": "+"}, {"POS": "NOUN"}]
            noun_phrase_dict["PROPN (OP+) + PROPN"]                 = [{"POS": "PROPN", "OP": "+"}, {"POS": "PROPN"}]
            noun_phrase_dict["NOUN (OP+) + LEMMA(-) + NOUN (OP+)"]  = [{"POS": "NOUN", "OP": "+"},{"LEMMA": "-", "OP": "+"},{"POS": "NOUN", "OP": "+"}]
        
        relations = []

        for span in relation_spans:
            left_noun, left_match_pattern = self.find_nearest_pattern(
                doc, noun_phrase_dict, span, True, developer
            )
            right_noun, right_match_pattern = self.find_nearest_pattern(
                doc, noun_phrase_dict, span, False, developer
            )

            if (not left_noun is None) and (not right_noun is None):
                relations.append(RelationDto(left_noun, span, right_noun, 
                                                left_match_pattern, 
                                                right_match_pattern))
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
        syntactical_constraint_matches, matchs = self.construct_text_spans(
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
        for _, start, end in matches:
            verbs.append(doc.doc[start:end].text)
        return verbs

    def get_verbs_kz(self, nlp, doc):
        matcher = Matcher(nlp.vocab)
        pattern = [[{"POS": "ADP", "OP": "*"}, {"DEP": "ROOT"}], [{"DEP": "ROOT"}]]
        matcher.add("Verb", pattern)

        matches = matcher(doc.doc)
        verbs = []
        for _, start, end in matches:
            verbs.append(doc.doc[start:end])

        verbs.sort(key=lambda s: len(s.text), reverse=True)
        return any(verbs) and verbs[0] or None

    def get_noun_kz(self, nlp, doc, pattern):
        matcher = Matcher(nlp.vocab)

        for k,v in pattern.items():
            matcher.add(k, [v])

        matches = matcher(doc.doc)

        nouns = []
        matchers = {}
        for match_id, start, end in matches:
            matchers[doc.doc[start:end].text] = match_id
            nouns.append(doc.doc[start:end])

        if any(nouns):
            nouns.sort(key=lambda s: len(s.text), reverse=True)
            return nouns[0], self.get_mather_by_word(
                                doc.doc.vocab, 
                                matchers, 
                                nouns[0].text
                            )
        return None, None

    def find_nearest_pattern(
        self, doc, pattern, text_span, search_before, developer=False
    ):
        matcher = doc.matcher
        
        for k,v in pattern.items():
            matcher.add(k, [v])

        matches = matcher(doc.doc)
        spans, matches_list = self.construct_text_spans(doc, matches)
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
            return None, None

        if developer == True:
            for span in spans_to_search:
                print("Span: %s" % (span.sentence))
        
        _ready = False
        _span = spans_to_search[0]
        _matcher = None
        
        if len(spans_to_search) > 2:
            for span in spans_to_search:
                if (
                    "-" in span.sentence
                    and len(span.sentence) > 1
                    and span.sentence.startswith("-") == False
                    and span.sentence.endswith("-") == False
                ):
                    _span = span
                    _ready = True
                    break
            if _ready == False:
                if spans_to_search[1].sentence.startswith(spans_to_search[0].sentence):
                    _span = spans_to_search[1]

        return _span, \
               self.get_mather_by_word(
                   doc.doc.vocab,
                   matches_list, 
                   _span.sentence)

    def get_mather_by_word(self, vocab, matchers, word):
        if any(matchers):
            if word in matchers:
                return vocab.strings[matchers[word]]
        return "None"

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

    def find_dublicates(self, nlp, line, developer = False):
        nlp_line = nlp(line)
        doc = DocumentDto(nlp, nlp_line)

        if developer == True:
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

        matcher = doc.matcher
        pattern = [
            [
                {"POS": "NOUN", "OP": "+"},
                {"LEMMA": "-", "OP": "+"},
                {"POS": "NOUN", "OP": "+"},
                {"POS": "PUNCT", "LEMMA": ",", "OP": "+"},
                {"POS": "NOUN"},
            ],
            [
                {"POS": "NOUN", "OP": "+"},
                {"POS": "PUNCT", "LEMMA": ",", "OP": "+"},
                {"POS": "PROPN"},
            ],
            [
                {"POS": "NOUN", "OP": "+"},
                {"POS": "PUNCT", "LEMMA": ",", "OP": "+"},
                {"POS": "NOUN"},
            ],
            [
                {"POS": "PROPN", "OP": "+"},
                {"POS": "PUNCT", "LEMMA": ",", "OP": "+"},
                {"POS": "PROPN"},
            ],
        ]
        matcher.add("Dublicates", pattern)
        matches = matcher(doc.doc)

        spans = []
        for _, start, end in matches:
            ent = doc.doc[start:end].text.split(",")
            for e in ent:
                if e not in spans and " " not in e.strip():
                    spans.append(e.strip())

        if any(spans):
            spans.sort(key=lambda s: len(s), reverse=True)

        entities = []
        for word in spans:
            if developer == True:
                print("Dublicate: %s" % (word))
            if word not in entities and " " not in word:
                exist = [r for r in entities if word in r]
                if len(exist) == 0:
                    entities.append(word)

        sentences = []
        if len(entities) > 1:
            for e in entities:
                if developer == True:
                    print("Dublicate sentence: %s" % (e))
                sentence = line
                for s in entities:
                    if e != s:
                        sentence = sentence.replace("%s ," % (s), "")
                        sentence = sentence.replace(", %s" % (s), "")
                        sentence = sentence.replace(s, "")
                sentence = re.sub(" +", " ", sentence)
                sentence = re.sub(", ,", " ", sentence)
                sentence = sentence.strip()
                if sentence[-1] == ",":
                    sentence = sentence[:-1].strip()
                if sentence[-1] == ".":
                    sentence = sentence[:-1].strip()

                if sentence not in sentences:
                    sentences.append(sentence)
        else:
            sentences.append(line)

        if developer == True:
            for s in sentences:
                print("Sentence: %s" % (s))

        return sentences
