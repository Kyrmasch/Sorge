import spacy
from spacy.matcher import Matcher

class SwapSpanDto:

    def __init__(self, new_span, swapped_span):
        self.new_span = new_span
        self.swapped_span = swapped_span

    @property
    def swap_start(self):
        return self.swapped_span.start_index

    @property
    def swap_end(self):
        return self.swapped_span.end_index

    def swapped_text(self):
        return self.new_span.sentence

    def intersects(self, other):
        if self.swap_start >= other.swap_start and self.swap_start <= other.swap_end:
            return True
        if self.swap_end >= other.swap_start and self.swap_end <= other.swap_end:
            return True
        if other.swap_start >= self.swap_start and other.swap_start <= self.swap_end:
            return True
        if other.swap_end >= self.swap_start and other.swap_end <= self.swap_end:
            return True
        return False