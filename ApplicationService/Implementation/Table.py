from interface import implements
from ApplicationService.Interfaces.ITable import ITable
from ApplicationService.Dtos.MaxMinDto import MaxMinDto
import numpy as np
from itertools import groupby
import pandas as pd
from pandas.util import hash_pandas_object
import os
import codecs
import string
import simplejson
import io
import json


class Table(implements(ITable)):
    def __init__(self, config) -> None:
        self.config = config
        self.wd = os.getcwd()

    def concatRows(self, df, indexs, spliter: str = " "):
        rows = df[df.index.isin(indexs)]

        heads = []
        for ind, column in enumerate(rows.columns):
            incoms = rows[column].tolist()
            incoms = [
                str(incom).replace("=", "") for incom in incoms if str(incom) != "nan"
            ]
            head = spliter.join(incoms)
            heads.append(head)

        return heads

    def merge(self, df):
        nan_values = df[df.isna().any(axis=1)]
        Lnan = list(nan_values.index.values)
        if len(Lnan) > 1:
            maxmin = []
            for k, g in groupby(enumerate(Lnan), lambda x: x[0] - x[1]):
                items = [i[1] for i in g]
                if len(items) > 1:
                    maxmin.append(MaxMinDto(min=items[0], max=items[-1]))

            if len(maxmin) > 0:
                for mm in maxmin:
                    indexs = list(range(mm.min, mm.max + 1))
                    row = self.concatRows(df, indexs, " ")

                    if len(row) == len(df.columns):
                        replace = {}
                        for ind, column in enumerate(df.columns):
                            replace[column] = row[ind]

                        df.loc[mm.min] = replace

                        indexs.pop(0)
                        df = df.drop(indexs)

        return df

    def transform(self, df):
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
                heads = self.concatRows(df, LDrop)
                if len(heads) == Ncolumn:
                    Cnames = {}
                    for ind, column in enumerate(df.columns):
                        Cnames[column] = (
                            "Unnamed" not in column
                            and "%s %s" % (column, heads[ind])
                            or heads[ind]
                        )
                    df = df.rename(columns=Cnames)

            # NOTE: Все строки с заполненностью
            # меньше 20% удалить
            for index, value in Lempty.items():
                if ((value * 100) / Ncolumn) < 20 and df.index[index] not in LDrop:
                    LDrop.append(df.index[index])

            df = df.drop(LDrop)

        return df

    def punctuation(self, df):
        for col in df.columns:
            a = df[col].unique()
            if len(a) == 1:
                if a[0] in string.punctuation:
                    print(a[0])

        return df

    def aks(self, dataframe):

        df = dataframe.replace(r"\r+|\n+|\t+|\/+", " ", regex=True)
        df = df.replace(r"\s+", " ", regex=True)
        df = df.dropna(axis=1, how="all")

        try:
            df = self.transform(df)
        except:
            pass

        df = self.merge(df)

        df = df.replace(np.nan, "-", regex=True)
        df = df.replace(",", "-", regex=False)

        # self.punctuation(df)

        return df

    def save_json(self, df, core):
        sha = abs(hash_pandas_object(df).sum())
        path = "%s/ApplicationService/Files/tables/%s.json" % (self.wd, sha)
        save = False
        if os.path.exists(path) == False:
            save = True
            table = df.to_json(orient="index", force_ascii=False)
            try:
                with io.open(path, "w") as f:
                    json.dump(
                        {"table": table, "core": [core], "guid": ["%s" % (sha)]},
                        f,
                        sort_keys=True,
                        indent=4,
                        ensure_ascii=False,
                    )
            except Exception as e:
                print(str(e))
        else:
            save = True

        return save, str(sha)

    def getCoreColumn(self, dataFrame):
        dtypes = dataFrame.dtypes
        columns = [(i, c) for (i, c) in dtypes.items() if c == type(object)]
        rows = dataFrame.shape[0]
        column = None
        for i, c in columns:
            unique = dataFrame[i].unique()
            p = (rows * 100) / len(unique)
            if p > 80:
                try:
                    v = str(dataFrame[i].iloc[1])
                    if v.isnumeric() == False:
                        dataFrame[i] = dataFrame[i].str.replace("\d+ ", "", regex=True)
                        column = i
                        break
                except Exception as err:
                    print(str(err))
                    pass

        return column, dataFrame
