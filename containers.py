import os
from dependency_injector import providers, containers
from dependency_injector.ext import flask
from flask import Flask

from Web.Controllers import views
from Web.Controllers import api

from Infrastruction.socket import SocketProvider 

class SocketIOProvider(containers.DeclarativeContainer):
    config = providers.Configuration()
    socket_provider = providers.Singleton(SocketProvider, config)

class ApplicationContainer(containers.DeclarativeContainer):

    template_dir = os.path.abspath('Web/Templates/statics')
    static_dir =  os.path.abspath('Web/Templates/publics')
    app = flask.Application(Flask, 
                            __name__, 
                            template_folder=template_dir, 
                            static_folder=static_dir)

    index_view = flask.View(views.index)
    settings_view = flask.View(views.settings)

    get_tables_api = flask.View(api.get_tables)
        