
from typing import List


class ResultTablesDto(object):
    def __init__(self, tables: List, cores: List = [], guids: List = []):
        self.tables = tables
        self.core_columns = cores
        self.guids = guids
