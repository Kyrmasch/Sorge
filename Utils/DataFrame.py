import numpy as np


def buidlNewHead(df, indexs):
    rows = df.iloc[indexs]

    heads = []
    for ind, column in enumerate(rows.columns):
        incoms = rows[column].tolist()
        incoms = [str(incom) for incom in incoms if str(incom) != "nan"]
        head = " ".join(incoms)
        heads.append(head)

    return heads


def transform(df):
    Ncolumn = df.shape[1]

    Lempty = df.apply(lambda x: x.count(), axis=1)
    if Lempty.shape[0] > 0:
        LDrop = []
        # NOTE: Все не полные до первой строки
        # с полными значениями во всех столбцах
        for index, value in Lempty.items():
            if value == Ncolumn:
                break
            LDrop.append(df.index[index])

        # NOTE: Из всех что нашли предположим это
        # были реальные заголовки - сформируем и заменим
        if len(LDrop) > 0:
            heads = buidlNewHead(df, LDrop)
            if len(heads) == Ncolumn:
                Cnames = {}
                for ind, column in enumerate(df.columns):
                    Cnames[column] = heads[ind]
                df = df.rename(columns=Cnames)

        # NOTE: Все строки с заполненностью
        # меньше 20% удалить
        for index, value in Lempty.items():
            if ((value * 100) / Ncolumn) < 20 and df.index[index] not in LDrop:
                LDrop.append(df.index[index])

        df = df.drop(LDrop)

    return df


def NaN(dataframe):

    df = dataframe.replace(r"\r+|\n+|\t+|\/+", " ", regex=True)
    df = df.replace(r"\s+", " ", regex=True)
    df = df.dropna(axis=1, how="all")
    df = transform(df)
    df = df.replace(np.nan, "-", regex=True)
    return df


def GetCoreColumn(dataFrame):
    dtypes = dataFrame.dtypes
    columns = [(i, c) for (i, c) in dtypes.items() if c == type(object)]
    rows = dataFrame.shape[0]
    column = None
    for i, c in columns:
        unique = dataFrame[i].unique()
        if rows == len(unique):
            column = i
            break

    return column
