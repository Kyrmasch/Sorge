import pandas as pd


class ParcerProvider(object):
    def __init__(self, config):
        pass

    def get_data(self, url) -> str:
        if url is not None:
            tables = pd.read_html(url)
            if len(tables) > 0:
                return tables

        return []
