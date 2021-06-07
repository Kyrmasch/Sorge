import numpy as np


def NaN(dataframe):

    df = dataframe.replace(r"\r+|\n+|\t+|\/+", " ", regex=True)
    df = df.replace(r"\s+", " ", regex=True)

    Ncolumn = df.shape[1]

    Lempty = df.apply(lambda x: x.count(), axis=1)
    if Lempty.shape[0] > 0:
        LDrop = []
        for index, value in Lempty.items():
            if value == Ncolumn:
                break
            LDrop.append(df.index[index])

        for index, value in Lempty.items():
            if ((value * 100) / Ncolumn) < 20 and df.index[index] not in LDrop:
                LDrop.append(df.index[index])

        df = df.drop(LDrop)

    df = df.dropna(axis=1, how="all")
    df = df.replace(np.nan, "-", regex=True)
    df.dropna(axis=1, how="any", inplace=True)

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
