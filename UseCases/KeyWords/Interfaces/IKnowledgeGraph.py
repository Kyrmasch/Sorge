from interface import Interface

class IKnowledgeGraph(Interface):
    def getSentences(self, text, lang):
        pass

    def processSentence(self, sentence, nlp_model):
        pass

