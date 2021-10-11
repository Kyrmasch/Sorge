from Entity.Models.User import UserEntity


class SignInDto(object):
    def __init__(self, user: UserEntity, remember: bool):
        self.user = user
        self.remember = remember
