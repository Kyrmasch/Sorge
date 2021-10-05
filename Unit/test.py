# import sys

# from ufal.udpipe import Model, Pipeline, ProcessingError
# model = Model.load("kazakh-ud-2.0-170801.udpipe")
# if not model:
#     sys.stderr.write("Cannot load model from file '%s'\n" % "kazakh-ktb")
#     sys.exit(1)

# text = "Ертіс Павлодар арқылы өтеді"

# pipeline = Pipeline(model, "tokenize", Pipeline.DEFAULT, Pipeline.DEFAULT, "conllu")
# error = ProcessingError()
# processed = pipeline.process(text, error)
# if error.occurred():
#     sys.stderr.write("An error occurred when running run_udpipe: ")
#     sys.stderr.write(error.message)
#     sys.stderr.write("\n")
#     sys.exit(1)
# sys.stdout.write(processed)

import spacy
from spacy.tokens import DocBin

# nlp = spacy.blank("ru")
# training_data = [
#   (
#       "Иртыш протекает через города Усть-Каменогорск, Павлодар, Семей", 
#         [(0, 5, "OBJECT"),
#             (6, 21, "EDGE"),
#             (29, 45, "SUBJECT"),
#             (47, 55, "SUBJECT"),
#             (57, 62, "SUBJECT")
#         ]
#    ),
#    (
#        "Павлодар стоит на Иртыше",
#        [(0, 8, "OBJECT"),
#             (9, 17, "EDGE"),
#             (18, 24, "SUBJECT")
#        ]
#    )
# ]
# # the DocBin will store the example documents
# db = DocBin()
# for text, annotations in training_data:
#     doc = nlp(text)
#     ents = []
#     for start, end, label in annotations:
#         span = doc.char_span(start, end, label=label)
#         print(span)
#         ents.append(span)
#     doc.ents = ents
#     db.add(doc)
# db.to_disk("./ru.relation.spacy")

npl = spacy.load("/home/user/Sorge/Sorge/Unit/ru_realction/model-last")
doc = npl("Усть-Каменогрск стоит на Иртыше")
for ent in doc.ents:
    print(ent.text, ent.start_char, ent.end_char, ent.label_)