from flask import request, render_template, jsonify, request, redirect, url_for
from Infrastruction.authmanager import AuthProvider

auth = AuthProvider({})

def signin():
    data = request.json
    user = auth.get_user(data['login'], data['password'])
    isauth = auth.signin(user)
    return jsonify({'result': isauth})

def signout():
    auth.signout()
    return redirect(url_for('login'))

def get_tables():
    return jsonify({'result': []})