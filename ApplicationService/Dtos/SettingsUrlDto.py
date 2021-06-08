
class SettingsUrlDto(object):
    def __init__(self, _from: int, _to: int, _merge: bool = False):
        self._from = int(_from)
        self._to = int(_to)
        self._merge = _merge
