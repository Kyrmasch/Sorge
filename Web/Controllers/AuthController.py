from flask import (
    request,
    jsonify,
    request,
    redirect,
    url_for,
)
from Infrastructure.DepentencyInjection import auth

def signin():
    data = request.json
    isauth = False

    try:
        remember = data["remember"] is None and False or data["remember"]
        username = data["login"]
        password = data["password"]

        user = auth.get_user(username, password)
        isauth = auth.signin(user, remember)

    except Exception as e:
        return str(e), 404

    return jsonify({"result": isauth})


def signout():
    auth.signout()
    return redirect(url_for("login"))
