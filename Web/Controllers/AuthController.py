from flask import (
    request,
    jsonify,
    request,
    redirect,
    url_for,
)
from Infrastructure.DepentencyInjection import auth
from Infrastructure.Interfaces.Auth.Dto.LoginDto import LoginDto 
from Infrastructure.Interfaces.Auth.Dto.SignInDto import SignInDto

def signin():
    data = request.json
    isauth = False

    try:
        loginDto = LoginDto(data["login"], data["password"])

        signInDto = auth.get_user(loginDto)
        signInDto.remember = data["remember"] is None and False or data["remember"]

        isauth = auth.signin(signInDto)

    except Exception as e:
        return str(e), 404

    return jsonify({"result": isauth})


def signout():
    auth.signout()
    return redirect(url_for("login"))
