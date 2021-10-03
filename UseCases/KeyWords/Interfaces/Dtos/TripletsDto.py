from typing import List

class TripletsDto(object):
    def __init__(self, left: str, relation: str, rigth: str, matchers = None):
        self.left       = left
        self.relation   = relation
        self.rigth      = rigth
        self.matchers   = matchers

    def to_tuple(self):
        return (self.left, self.relation, self.rigth, self.matchers)