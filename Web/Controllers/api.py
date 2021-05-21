from flask import (
    request,
    jsonify,
    request,
    redirect,
    url_for,
    abort,
    Response,
)
import simplejson
from Infrastruction.Implementations.AuthManager import AuthProvider
from Infrastruction.Exceptions.exception import (
    AuthCredentionsException,
    AuthUserNotFoundException,
)
from UseCases.Implementations.Parcer import ParcerProvider


parcer = ParcerProvider({})

auth = AuthProvider({})

def signin():
    data = request.json
    isauth = False

    try:
        if data["login"] is not None and data["password"] is not None:
            remember = data["remember"] is None and False or data["remember"]
            username = data["login"]
            password = data["password"]

            user = auth.get_user(username, password)
            if user is not None:
                isauth = auth.signin(user, remember)
            else:
                raise AuthCredentionsException()
        else:
            raise AuthCredentionsException()

    except Exception as e:
        return str(e), 404

    return jsonify({"result": isauth})


def signout():
    auth.signout()
    return redirect(url_for("login"))


def get_tables():
    data = request.json
    tables = []
    if data["url"] is not None:
        url = data["url"]
        tables = parcer.get_data(url)

    result = simplejson.dumps({"result": tables}, ignore_nan=True, encoding='utf-8')

    return result
