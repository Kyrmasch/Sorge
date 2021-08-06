from flask import current_app
from flask_login import LoginManager, login_user, logout_user
from Entity.Models.User import UserEntity
from interface import implements
from Infrastructure.Interfaces.Auth.IAuthManager import IAuthManager
from Infrastructure.Interfaces.Auth.Exceptions.exception import AuthCredentionsException
from Infrastructure.Interfaces.Auth.Dto.LoginDto import LoginDto
from Infrastructure.Interfaces.Auth.Dto.SignInDto import SignInDto


class AuthManager(implements(IAuthManager)):
    def __init__(self, config):
        self.loginManager = LoginManager()
        self.loginManager.user_loader(self.load_user)

        self.loginManager.login_view = "login"

        users = []
        users.append(UserEntity(0, "admin", "Администратор", "4899443", 'sorge'))
        users.append(UserEntity(1, "admin", "Администратор", "122335719", 'maps'))

        self.users = users

    def load_user(self, id):
        result = None
        for u in self.users:
            if int(id) == int(u.id):
                result = u
        return result

    def get_user(self, loginDto: LoginDto) -> SignInDto:
        user = None

        if loginDto.login is None or loginDto.password is None:
            raise AuthCredentionsException()

        for u in self.users:
            if u.login == loginDto.login and u.password == loginDto.password:
                user = SignInDto(u, False)

        if user is None:
            raise AuthCredentionsException()

        return user

    def signin(self, signinDto: SignInDto) -> bool:
        if signinDto.user is not None:
            login_user(signinDto.user, remember=signinDto.remember)
            return True
        return False

    def signout(self):
        logout_user()
