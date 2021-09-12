class RelationDto:

    def __init__(self, left_phrase, relation_phrase, right_phrase):
        self.left_phrase = left_phrase
        self.relation_phrase = relation_phrase
        self.right_phrase = right_phrase

    def __eq__(self, other):
        return self.left_phrase == other.left_phrase and self.relation_phrase == other.relation_phrase and self.right_phrase == other.right_phrase
    
    def __str__(self):
        return f'({self.left_phrase.sentence}, {self.relation_phrase.sentence}, {self.right_phrase.sentence})'