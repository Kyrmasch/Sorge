from flask import current_app
from flask_login import LoginManager, login_required

loginManager = LoginManager()

class AuthProvider(object):

    def __init__(self, config):
        loginManager.login_view  = 'login'
        self.loginManager = loginManager

    @loginManager.user_loader
    def load_user(self, user):
        return None