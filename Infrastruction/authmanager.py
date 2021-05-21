from Entity.user import UserEntity
from flask import current_app
from flask_login import LoginManager, login_user, logout_user
from Entity.user import UserEntity

loginManager = LoginManager()
users = []
users.append(UserEntity(0, "admin", "Администратор", "4899443"))


class AuthProvider(object):
    def __init__(self, config):
        loginManager.login_view = "login"
        self.loginManager = loginManager
        self.users = users

    @loginManager.user_loader
    def load_user(id):
        result = None
        for u in users:
            if int(id) == int(u.id):
                result = u
        return result

    def get_user(self, login, password):
        user = None
        for u in self.users:
            if u.login == login and u.password == password:
                user = u
        return user

    def signin(self, user, remember=None):
        if user is not None:
            login_user(user, remember=remember)
            return True
        return False

    def signout(self):
        logout_user()
