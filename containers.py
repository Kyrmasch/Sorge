import os
from dependency_injector import providers, containers
from dependency_injector.ext import flask
from flask import Flask

from Web.Controllers import PageController, ApiController, AuthController

class ApplicationContainer(containers.DeclarativeContainer):

    template_dir = os.path.abspath("Web/Templates/statics")
    static_dir = os.path.abspath("Web/Templates/publics")
    app = flask.Application(
        Flask, __name__, template_folder=template_dir, static_folder=static_dir
    )

    index_view = flask.View(PageController.index)
    login_view = flask.View(PageController.login)
    settings_view = flask.View(PageController.settings)
    favicon = flask.View(PageController.favicon)

    get_tables_api = flask.View(ApiController.get_tables)

    login_api = flask.View(AuthController.signin)
    logout_api = flask.View(AuthController.signout)

    wiki_pages = flask.View(ApiController.get_wiki)
