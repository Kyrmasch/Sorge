from os import abort
from flask import request, render_template

def index():
    return render_template("index.html")


def login():
    return render_template("index.html")


def settings():
    return render_template("index.html")
