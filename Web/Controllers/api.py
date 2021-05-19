from flask import request, render_template, jsonify, request, redirect, url_for, abort, Response
from Infrastruction.authmanager import AuthProvider
from Infrastruction.Exceptions.exception import AuthCredentionsException, AuthUserNotFoundException

auth = AuthProvider({})


def signin():
    data = request.json
    isauth = False

    try:
        if data["login"] is not None and data["password"] is not None:
            remember = data['remember'] is None and False or data['remember']
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
    return jsonify({"result": []})
