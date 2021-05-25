from interface import Interface


class IParserService(Interface):
    def get_data(self, url: str) -> list:
        pass
