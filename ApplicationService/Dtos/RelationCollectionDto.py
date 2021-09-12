class RelationCollectionDto:

    def __init__(self, relations):
        self.relations = relations

    @property
    def left_phrases(self):
        return None

    @property
    def right_phrases(self):
        return None

    @property
    def relation_phrases(self):
        return None

    def join(self, other):
        return None