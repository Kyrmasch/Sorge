import numpy as np

def NaN(dataframe):
    df = dataframe.replace(r"\r+|\n+|\t+|\/+", " ", regex=True)
    df = df.replace(r"\s+", " ", regex=True)
    df = df.dropna(axis=1, how="all")
    df = df.replace(np.nan, "-", regex=True)

    return df