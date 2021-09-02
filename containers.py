import os
from dependency_injector import providers, containers
from dependency_injector.ext import flask
from flask import Flask

from Web.Controllers import PageController, ApiController, AuthController, MapsController, DevControler

class ApplicationContainer(containers.DeclarativeContainer):

    template_dir = os.path.abspath("Web/Templates/statics")
    static_dir = os.path.abspath("Web/Templates/publics")
    app = flask.Application(
        Flask, __name__, template_folder=template_dir, static_folder=static_dir
    )

    index_view              = flask.View(PageController.index)
    login_view              = flask.View(PageController.login)
    maps_view               = flask.View(PageController.maps)
    settings_view           = flask.View(PageController.settings)
    favicon                 = flask.View(PageController.favicon)

    get_tabs_api            = flask.View(ApiController.get_tabs)
    get_tables_api          = flask.View(ApiController.parse_get_tables)
    get_table_by_guid_api   = flask.View(ApiController.parse_get_table_by_guid)

    login_api               = flask.View(AuthController.signin)
    logout_api              = flask.View(AuthController.signout)

    wiki_pages              = flask.View(ApiController.parse_get_wiki)

    dev_get_guids           = flask.View(DevControler.parse_get_guids)

    map_build               = flask.View(MapsController.map_build)
    example_text            = flask.View(MapsController.get_example_text)
    detect_lang             = flask.View(MapsController.check_lang)
