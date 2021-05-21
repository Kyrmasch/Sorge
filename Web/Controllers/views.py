from os import abort
from flask import request, render_template
from Infrastruction.dbcontext import DbProvider

db = DbProvider({})

def index():
    return render_template("index.html")


def login():
    return render_template("index.html")


def settings():
    return render_template("index.html")
