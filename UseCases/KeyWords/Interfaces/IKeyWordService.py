from interface import Interface

class IKeyWordService(Interface):
    def rake_extract(self, data, lang="english"):
        pass

    def tf_extract(self, data, lang="english"):
        pass

