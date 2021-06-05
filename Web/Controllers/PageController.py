from os import abort
from flask import request, render_template, send_from_directory
import os

def index():
    return render_template("index.html")


def login():
    return render_template("index.html")


def settings():
    return render_template("index.html")

def favicon():
    return send_from_directory('/home/user/Sorge/Sorge/Web/Templates/statics/',
                               'favicon.ico', mimetype='image/vnd.microsoft.icon')
