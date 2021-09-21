import sys

from ufal.udpipe import Model, Pipeline, ProcessingError
model = Model.load("kazakh-ud-2.0-170801.udpipe")
if not model:
    sys.stderr.write("Cannot load model from file '%s'\n" % "kazakh-ktb")
    sys.exit(1)

text = "Ертіс Павлодар арқылы өтеді"

pipeline = Pipeline(model, "tokenize", Pipeline.DEFAULT, Pipeline.DEFAULT, "conllu")
error = ProcessingError()
processed = pipeline.process(text, error)
if error.occurred():
    sys.stderr.write("An error occurred when running run_udpipe: ")
    sys.stderr.write(error.message)
    sys.stderr.write("\n")
    sys.exit(1)
sys.stdout.write(processed)