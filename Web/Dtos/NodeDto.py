class NodeDto(object):
    def __init__(self, id, value, label, borderWidth = 1):
        self.id = id
        self.value = value
        self.label  = label
        self.borderWidth = borderWidth > 5  and 5 or borderWidth