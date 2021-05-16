from dependency_injector import providers, containers
from dependency_injector.ext import flask
from flask import Flask
from Web.Views import views
from UseCases.parcer import ParcerProvider

class ParcerContainer(containers.DeclarativeContainer):
    config = providers.Configuration()
    parcer_instance = providers.Singleton(ParcerProvider, config)


class ApplicationContainer(containers.DeclarativeContainer):

    app = flask.Application(Flask, __name__)
    index_view = flask.View(views.index)