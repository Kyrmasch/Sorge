from interface import Interface
from Infrastructure.Dto.Auth.LoginDto import LoginDto
from Infrastructure.Dto.Auth.SignInDto import SignInDto

class IAuthManager(Interface):
    def get_user(self, loginDto: LoginDto):
        pass

    def signin(self, signinDto: SignInDto):
        pass

    def signout(self):
        pass
