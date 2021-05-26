from flask import (
    request,
    jsonify,
    request,
    redirect,
    url_for,
)
from Infrastructure.DepentencyInjection import auth
from Infrastructure.Dto.Auth.LoginDto import LoginDto 
from Infrastructure.Dto.Auth.SignInDto import SignInDto

def signin():
    data = request.json
    isauth = False

    try:
        loginDto = LoginDto(data["login"], data["password"])
        remember = data["remember"] is None and False or data["remember"]

        user = auth.get_user(loginDto)

        signinDto = SignInDto(user, remember)
        isauth = auth.signin(signinDto)

    except Exception as e:
        return str(e), 404

    return jsonify({"result": isauth})


def signout():
    auth.signout()
    return redirect(url_for("login"))
