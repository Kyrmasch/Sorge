from interface import Interface

class IKnowledgeGraphService(Interface):
    def getSentences(self, text, lang):
        pass

    def processSentence(self, sentence, nlp_model):
        pass

