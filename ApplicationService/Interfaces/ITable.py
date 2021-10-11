from interface import Interface


class ITable(Interface):
    def concatRows(self, df, indexs, spliter: str = " "):
        pass

    def merge(self, df):
        pass

    def transform(self, df):
        pass

    def aks(self, dataframe):
        pass

    def getCoreColumn(self, dataFrame):
        pass
