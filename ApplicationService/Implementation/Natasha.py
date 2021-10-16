from natasha import (
    Segmenter,
    MorphVocab,
    NewsEmbedding,
    NewsMorphTagger,
    NewsSyntaxParser,
    NewsNERTagger,
    PER,
    NamesExtractor,
    Doc,
)


class NatashaService:
    def __init__(self, config):
        self.segmenter = Segmenter()
        self.morph_vocab = MorphVocab()

        emb = NewsEmbedding()
        self.morph_tagger = NewsMorphTagger(emb)
        self.ner_tagger = NewsNERTagger(emb)

    def get_lammas(self, text: str, queue=None) -> dict:
        lemmas = {}

        doc = Doc(text)

        doc.segment(self.segmenter)
        doc.tag_morph(self.morph_tagger)
        doc.tag_ner(self.ner_tagger)

        for span in doc.spans:
            span.normalize(self.morph_vocab)
        lemmas = {_.text: _.normal for _ in doc.spans if _.text != _.normal}

        if queue is not None:
            queue.put(lemmas)

        return lemmas
