class AuthCredentionsException(Exception):
    def __init__(self, msg='Неверный логин или пароль', *args, **kwargs):
        super().__init__(msg, *args, **kwargs)

class AuthUserNotFoundException(Exception):
    def __init__(self, msg='Пользователь не найден', *args, **kwargs):
        super().__init__(msg, *args, **kwargs)