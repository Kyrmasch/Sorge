import numpy as np

def NaN(dataframe):
    df = dataframe.replace(r"\r+|\n+|\t+|\/+", " ", regex=True)
    df = df.replace(r"\s+", " ", regex=True)
    df = df.dropna(axis=1, how="all")
    df = df.replace(np.nan, "-", regex=True)
    df.dropna(axis=1, how='any', inplace=True)

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