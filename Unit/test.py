import textacy

text = "Концептуальная карта это разновидность схемы, где наглядно представлены связи между концепциями и идеями."
doc = textacy.make_spacy_doc(text, "ru_core_news_sm")

doc._.preview