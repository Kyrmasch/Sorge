from os import abort
from flask import request, render_template, send_from_directory
from flask_login import current_user
import os


def index():
    return render_template(
        "index.html", system=current_user.system, user=current_user.name
    )


def login():
    return render_template("login.html")


def maps():
    return render_template(
        "index.html", system=current_user.system, user=current_user.name
    )


def settings():
    return render_template(
        "index.html", system=current_user.system, user=current_user.name
    )


def favicon():
    return send_from_directory(
        "%s/Web/Templates/statics/" % (os.getcwd()),
        "favicon.ico",
        mimetype="image/vnd.microsoft.icon",
    )
