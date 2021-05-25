from interface import Interface


class IDbContext(Interface):
    def check(self):
        pass

    def add(self, array):
        pass

    def update(self, array):
        pass

    def get(self, id):
        pass

    def remove(self, id):
        pass
