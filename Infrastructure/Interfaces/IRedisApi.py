from interface import Interface

class IRedisApi(Interface):

    def send(self):
        pass

    def write(self, key, message):
        pass
