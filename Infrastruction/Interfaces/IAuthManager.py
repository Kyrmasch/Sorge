from interface import Interface

class IAuthManager(Interface):

    def get_user(self, login, password):
        pass

    def signin(self, user, remember=None):
        pass

    def signout(self):
        pass