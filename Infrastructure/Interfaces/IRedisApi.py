from interface import Interface

class IRedisApi(Interface):

    def send(self, redis):
        pass

    def write(self, key, message):
        pass
