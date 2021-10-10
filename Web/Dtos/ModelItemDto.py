class ModelItemDto(object):
    def __init__(self, key: str, text: str, disabled: bool = False):
        self.key        = key
        self.text       = text
        self.disabled   = disabled