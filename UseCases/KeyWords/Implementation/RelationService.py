from interface import implements
from UseCases.KeyWords.Interfaces.IRelationService import IRelationService
import spacy
from spacy.matcher import Matcher
from UseCases.KeyWords.Interfaces.Dtos.RelationDto import RelationDto
from UseCases.KeyWords.Interfaces.Dtos.DocumentDto import DocumentDto

class RelationService(implements(IRelationService)):
    def __init__(self):
        pass

    def get_triplets(self, nlp, array):
        
        triplets = []
        for line in array:
            nlp_line = nlp(line)
            doc = DocumentDto(nlp, nlp_line)
            relations = self.extract_relations(doc)
            for relation in relations:
                triplets.append((relation.left_phrase.sentence, relation.relation_phrase.sentence, relation.right_phrase.sentence))

        return triplets

    def construct_text_spans(self, doc, matches):
        ret_spans = []
        for match_id, start, end in matches:
            ret_spans.append(doc.span(start, end))
        return ret_spans

    def extract_relations(self, doc):
        relation_spans = self.get_relation_spans(doc)
        noun_phrase_pattern = [[{"POS":"NOUN"}], [{"POS": "PROPN"}], [{"POS": "PRON"}]]
        
        relations = []

        for span in relation_spans:
            left_noun = self.find_nearest_pattern(doc, noun_phrase_pattern, span, True)
            right_noun = self.find_nearest_pattern(doc, noun_phrase_pattern, span, False)

            if (not left_noun is None) and (not right_noun is None):
                relations.append(RelationDto(left_noun, span, right_noun))
        return relations
            


    def get_relation_spans(self, doc):
        verbs = self.get_verbs(doc)
        fluff_pattern = [[{"POS":"VERB"}, {"POS": "PART", "OP": "*"}, {"POS": "ADV", "OP":"*"}], 
                            [{"POS": "VERB"},  {"POS": "ADP", "OP": "*"}, {"POS": "DET", "OP":"*"},
                            {"POS": "AUX", "OP": "*"},  
                            {"POS": "ADJ", "OP":"*"}, {"POS": "ADV", "OP": "*"}]]
        matcher = doc.matcher
        matcher.add("Fluff", fluff_pattern)
        syntactical_constraint_matches = self.construct_text_spans(doc, matcher(doc.doc))

        relation_spans = []
        for verb in verbs:
            verb_spans = [span for span in syntactical_constraint_matches if verb in span.sentence]
            joined_spans = self.merge_overlapping_consecutive_word_span(verb_spans)
            longest_span = self.find_longest_span(joined_spans)
            relation_spans.append(longest_span)
        return relation_spans

            

    def get_verbs(self, doc):
        matcher = doc.matcher
        fluff_pattern = [[{"POS":"VERB"}]]
        matcher.add("Fluff", fluff_pattern)
        matches = matcher(doc.doc)
        verbs = []
        for match_id, start, end in matches:
            verbs.append(doc.doc[start:end].text)
        return verbs

    def find_nearest_pattern(self, doc, pattern, text_span, search_before):
        matcher = doc.matcher
        matcher.add("PatternNear", pattern)
        matches = matcher(doc.doc)
        nearest_pattern = None
        spans = self.construct_text_spans(doc, matches)
        sorted_spans = sorted(spans, key=lambda s : s.start_index)

        spans_to_search = []
        if search_before:
            spans_to_search = [span for span in sorted_spans if span.start_index < text_span.start_index]
            spans_to_search.reverse()

        else:
            spans_to_search = [span for span in sorted_spans if span.start_index > text_span.start_index]

        if len(spans_to_search) == 0:
            return None

        return spans_to_search[0]


    def merge_overlapping_consecutive_word_span(self, text_spans):
        sorted_spans = sorted(text_spans, key=lambda s : s.start_index)
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