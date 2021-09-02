from spacy.lang.en import English
from spacy.lang.ru import Russian
import networkx as nx
import matplotlib.pyplot as plt


class KnowledgeGraph(object):
    def __init__(self):
        pass

    def getSentences(self, text, lang):
        nlp = lang == "russian" and Russian() or English()
        nlp.add_pipe("sentencizer")
        document = nlp(text)
        l = [sent.text.strip() for sent in document.sents]
        return l

    def printToken(self, token):
        print(token.text, "->", token.dep_)

    def appendChunk(self, original, chunk):
        return original + " " + chunk

    def isRelationCandidate(self, token):
        deps = ["ROOT", "adj", "attr", "agent", "amod"]
        return any(subs in token.dep_ for subs in deps)

    def isConstructionCandidate(self, token):
        deps = ["compound", "prep", "conj", "mod"]
        return any(subs in token.dep_ for subs in deps)

    def processSubjectObjectPairs(self, tokens):
        subject = ""
        object = ""
        relation = ""
        subjectConstruction = ""
        objectConstruction = ""
        for token in tokens:
            if "punct" in token.dep_:
                continue
            if self.isRelationCandidate(token):
                relation = self.appendChunk(relation, token.lemma_)
            if self.isConstructionCandidate(token):
                if subjectConstruction:
                    subjectConstruction = self.appendChunk(
                        subjectConstruction, token.text
                    )
                if objectConstruction:
                    objectConstruction = self.appendChunk(
                        objectConstruction, token.text
                    )
            if "subj" in token.dep_:
                subject = self.appendChunk(subject, token.text)
                subject = self.appendChunk(subjectConstruction, subject)
                subjectConstruction = ""
            if "obj" in token.dep_:
                object = self.appendChunk(object, token.text)
                object = self.appendChunk(objectConstruction, object)
                objectConstruction = ""

        if True == False:
            print(subject.strip(), ",", relation.strip(), ",", object.strip())

        return (subject.strip(), relation.strip(), object.strip())

    def processSentence(self, sentence, nlp_model):
        tokens = nlp_model(sentence)
        return self.processSubjectObjectPairs(tokens)

    def printGraph(self, triples):
        G = nx.Graph()
        for triple in triples:
            G.add_node(triple[0])
            G.add_node(triple[1])
            G.add_node(triple[2])
            G.add_edge(triple[0], triple[1])
            G.add_edge(triple[1], triple[2])

        pos = nx.spring_layout(G)
        plt.figure()
        nx.draw(G, pos, edge_color='black', width=1, linewidths=1,
                node_size=500, node_color='seagreen', alpha=0.9,
                labels={node: node for node in G.nodes()})
        plt.axis('off')
        plt.savefig("Graph.png", format="PNG")
