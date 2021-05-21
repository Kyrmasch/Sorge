import pandas as pd

class ParcerProvider(object):
    def __init__(self, config):
        pass

    def get_data(self, url) -> str:
        if url is not None:
            tables = pd.read_html(url, encoding='utf-8')
            if len(tables) > 0:
                list = []
                for t in tables:
                    json = t.to_dict('records')
                    list.append(json)
                return list

        return []
