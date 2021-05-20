from flask_login import UserMixin


class UserEntity(UserMixin):
    def __init__(self, id, login, name, password):
        self.id = id
        self.login = login
        self.name = name
        self.password = password

    def get(self, id):
        return self
