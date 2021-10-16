import os
from typing import Pattern

os.environ["TF_CPP_MIN_LOG_LEVEL"] = "3"
import spacy_udpipe
import spacy
from spacy.matcher import Matcher
from ApplicationService.Dtos.RelationDto import RelationDto
from ApplicationService.Dtos.DocumentDto import DocumentDto

from natasha import (
    Segmenter,
    MorphVocab,

    NewsEmbedding,
    NewsMorphTagger,
    NewsSyntaxParser,
    NewsNERTagger,

    PER,
    NamesExtractor,

    Doc
)


segmenter = Segmenter()
morph_vocab = MorphVocab()

emb = NewsEmbedding()
morph_tagger = NewsMorphTagger(emb)
syntax_parser = NewsSyntaxParser(emb)
ner_tagger = NewsNERTagger(emb)

names_extractor = NamesExtractor(morph_vocab)

text = 'Обью'
doc = Doc(text)

doc.segment(segmenter)
doc.tag_morph(morph_tagger)
doc.tag_ner(ner_tagger)

for span in doc.spans:
    span.normalize(morph_vocab)
print({_.text: _.normal for _ in doc.spans if _.text != _.normal})

# path = "/home/user/Sorge/lib/python3.8/site-packages/spacy_udpipe/models/kazakh-ud-2.0-170801.udpipe"

# sentence = "Ертіс өзені Өскемен арқылы өтеді"
# nlp = spacy_udpipe.load_from_path("ky", path)
# doc = nlp(sentence)


# def get_verbs(doc):
#     matcher = Matcher(nlp.vocab)
#     pattern = [[{"POS": "ADP", "OP": "*"}, {"DEP": "ROOT"}], [{"DEP": "ROOT"}]]
#     matcher.add("Fluff", pattern)

#     matches = matcher(doc.doc)
#     verbs = []
#     for match_id, start, end in matches:
#         verbs.append(doc.doc[start:end].text)
#     verbs.sort(key=lambda s: len(s), reverse=True)

#     return verbs[0]


# def noun(doc, pattern):
#     matcher = Matcher(nlp.vocab)
#     matcher.add("Noun", pattern)
#     matches = matcher(doc.doc)

#     nouns = []
#     for match_id, start, end in matches:
#         nouns.append(doc.doc[start:end].text)

#     if any(nouns):
#         nouns.sort(key=lambda s: len(s), reverse=True)
#         return nouns[0]
#     return None


# verbs = get_verbs(doc)
# print(verbs)
# if any(verbs):

#     pattern = [[{"IS_SENT_START": True, "OP": "+"}, {"POS": "ADJ", "OP": "*"}]]
#     left = noun(doc, pattern)

#     pattern = [
#         [
#             {"IS_SENT_START": False, "POS": "PART", "OP": "*"},
#             {"IS_SENT_START": False, "POS": "NOUN", "OP": "+"},
#             {"POS": "AUX", "OP": "*"},
#             {"POS": "NOUN", "OP": "*"},
#         ]
#     ]
#     right = noun(doc, pattern)

#     print((left, verbs, right))

# for token in doc:
#     print(
#         token.text,
#         token.lemma_,
#         token.pos_,
#         token.tag_,
#         token.dep_,
#         token.shape_,
#         token.is_alpha,
#         token.is_stop,
#     )
