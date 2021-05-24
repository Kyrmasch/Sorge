import os
from dependency_injector import providers, containers
from dependency_injector.ext import flask
from flask import Flask

from Web.Controllers import PageController, ApiController, AuthController

from ApplicationService.Implementation.Socket import SocketProvider
from Infrastruction.Implementations.AuthManager import AuthProvider


class SocketIOProvider(containers.DeclarativeContainer):
    config = providers.Configuration()
    socket_provider = providers.Singleton(SocketProvider, config)


class AuthManagerProvider(containers.DeclarativeContainer):
    config = providers.Configuration()
    auth_provider = providers.Singleton(AuthProvider, config)


class ApplicationContainer(containers.DeclarativeContainer):

    template_dir = os.path.abspath("Web/Templates/statics")
    static_dir = os.path.abspath("Web/Templates/publics")
    app = flask.Application(
        Flask, __name__, template_folder=template_dir, static_folder=static_dir
    )

    index_view = flask.View(PageController.index)
    login_view = flask.View(PageController.login)
    settings_view = flask.View(PageController.settings)

    get_tables_api = flask.View(ApiController.get_tables)

    login_api = flask.View(AuthController.signin)
    logout_api = flask.View(AuthController.signout)
