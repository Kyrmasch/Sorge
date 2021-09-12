import spacy
from spacy.matcher import Matcher
from ApplicationService.Dtos.SwapSpanDto import SwapSpanDto
from ApplicationService.Dtos.TextSpanDto import TextSpanDto


class DocumentDto:

    def __init__(self, nlp, doc):
        self.nlp = nlp
        self.doc = doc
        self.swap_list = []

    @property
    def matcher(self):
       return Matcher(self.nlp.vocab)

    def swap(self, span_1, span_2):
        new_swap = SwapSpanDto(span_2, span_1)
        self.swap_list.append(new_swap)
        self.swap_list = sorted(self.swap_list, key=lambda s: s.swap_start)

    def print(self, original_document = False):
        
        if original_document or len(self.swap_list) == 0:
            return self.doc[0:len(self.doc)].text
        
        else:

            printed_doc = ""
            last_swap_end = 0
            last_index = len(self.swap_list) - 1

            for (index, swapped_span) in enumerate(self.swap_list):

                previous_text = ""
                next_text = ""

                if index > 0 and self.swap_list[index - 1].swap_end != swapped_span.swap_start:
                    previous_end = self.swap_list[index - 1].swap_end
                    previous_span = TextSpanDto(self.doc[previous_end:swapped_span.swap_start])
                    previous_text = previous_span.sentence

                elif index == 0 and swapped_span.swap_start > 0:
                    previous_text = self.doc[0:swapped_span.swap_start].text
            
                swap_text = swapped_span.new_span.sentence
                components = [printed_doc, previous_text, swap_text]
                non_empty_components = (t for t in components if len(t) > 0 and (not t is None))
                printed_doc =  " ".join(non_empty_components)

            last_span = self.swap_list[last_index]
            if last_span.swap_end < len(self.doc):
                next_text = self.doc[swapped_span.swap_end:(len(self.doc))].text
                printed_doc = printed_doc + " " + next_text

            return printed_doc


    def span(self, start, end):
        return TextSpanDto(self.doc[start:end])