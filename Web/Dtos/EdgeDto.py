class EdgeDto(object):
    def __init__(self, _from, to, value, label, length = 0):
        self._from = _from
        self.to  = to
        self.value  = value
        self.label = label
        self.length = length

    def to_json(self):
        edge = {
            "from": self._from,
            "to": self.to,
            "label": self.label,
            "font": {
                "align": "top"
            }
        }

        if self.value > 0:
            edge["value"] = self.value

        if self.length > 0:
            edge["length"] =  self.length
        
        return edge