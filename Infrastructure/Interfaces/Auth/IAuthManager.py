from interface import Interface
from Infrastructure.Interfaces.Auth.Dto.LoginDto import LoginDto
from Infrastructure.Interfaces.Auth.Dto.SignInDto import SignInDto

class IAuthManager(Interface):
    def get_user(self, loginDto: LoginDto) -> SignInDto:
        pass

    def signin(self, signinDto: SignInDto) -> bool:
        pass

    def signout(self):
        pass
