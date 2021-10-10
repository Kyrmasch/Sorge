class ModelItemDto(object):
    def __init__(self, key: str, text: str, disabled: bool = False, ishead: bool = False, isdeliver= False):
        self.key        = key
        self.text       = text
        self.disabled   = disabled
        self.ishead     = ishead
        self.isdeliver  = isdeliver