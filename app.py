from flask.json import jsonify
from flasgger import Swagger
from containers import ApplicationContainer
from ApplicationService.DepentencyInjection import socket
from Infrastructure.DepentencyInjection import auth
from flask_login import login_required

container = ApplicationContainer()
app = container.app()
app.container = container

socket.init_app(app, cors_allowed_origins="*", async_mode="threading")

def create_app():

    app.add_url_rule(
        "/",
        view_func=login_required(container.index_view.as_view()),
        methods=[
            "GET",
        ],
    )

    app.add_url_rule(
        "/favicon.ico", view_func=container.favicon.as_view(), methods=["GET"]
    )

    app.add_url_rule(
        "/login", view_func=container.login_view.as_view(), methods=["GET"]
    )

    app.add_url_rule(
        "/maps",
        view_func=login_required(container.maps_view.as_view()),
        methods=[
            "GET",
        ],
    )

    app.add_url_rule(
        "/settings",
        view_func=login_required(container.settings_view.as_view()),
        methods=[
            "GET",
        ],
    )

    app.add_url_rule(
        "/api/get_tabs",
        view_func=login_required(container.get_tabs_api.as_view()),
        methods=[
            "GET",
        ],
    )

    app.add_url_rule(
        "/api/get_tables",
        view_func=login_required(container.get_tables_api.as_view()),
        methods=[
            "POST",
        ],
    )

    app.add_url_rule(
        "/api/get_tables_by_guids",
        view_func=login_required(container.get_tables_by_guids_api.as_view()),
        methods=[
            "POST",
        ],
    )

    app.add_url_rule(
        "/api/wiki_pages",
        view_func=login_required(container.wiki_pages.as_view()),
        methods=[
            "POST",
        ],
    )

    app.add_url_rule(
        "/api/login",
        view_func=container.login_api.as_view(),
        methods=[
            "POST",
        ],
    )

    app.add_url_rule(
        "/api/logout",
        view_func=login_required(container.logout_api.as_view()),
        methods=[
            "GET",
        ],
    )

    app.add_url_rule(
        "/maps/build",
        view_func=login_required(container.map_build.as_view()),
        methods=[
            "POST",
        ],
    )

    auth.loginManager.init_app(app)

    app.config["JSON_AS_ASCII"] = False
    app.config["SECRET_KEY"] = "q1w2e3r4#"
    app.config.update(
        SESSION_COOKIE_SECURE=True,
        SESSION_COOKIE_HTTPONLY=True,
        SESSION_COOKIE_SAMESITE="Lax",
    )
    app.config['JSON_AS_ASCII'] = False
    app.config['SWAGGER'] = {
        "swagger_version": "2.0",
        "title": "Sorge Api",
        "description": "Описание",
        "headers": [
            ('Access-Control-Allow-Origin', '*'),
            ('Access-Control-Allow-Methods', "GET, POST, PUT, DELETE, OPTIONS"),
            ('Access-Control-Allow-Credentials', "true"),
        ],
        "specs": [
            {
                "version": "1.0.0",
                "title": "Sorge",
                "endpoint": 'v1_api',
                "description": 'Аналиц таблиц',
                "route": '/v1/api.json',
                "termsOfService": None
            }
        ]
    }
    swagger = Swagger(app)

    return socket, app
