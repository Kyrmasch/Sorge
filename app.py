from flask.json import jsonify
from containers import ApplicationContainer
from ApplicationService.DepentencyInjection import socket
from Infrastructure.DepentencyInjection import auth
from flask_login import login_required

def create_app():

    container = ApplicationContainer()
    app = container.app()
    app.container = container

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

    io = socket
    io.init_app(app)
    auth.loginManager.init_app(app)

    app.config["JSON_AS_ASCII"] = False
    app.config["SECRET_KEY"] = "q1w2e3r4#"
    app.config.update(
        SESSION_COOKIE_SECURE=True,
        SESSION_COOKIE_HTTPONLY=True,
        SESSION_COOKIE_SAMESITE="Lax",
    )

    return io, app
