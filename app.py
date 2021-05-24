from flask.json import jsonify
from containers import ApplicationContainer, SocketIOProvider, AuthManagerProvider
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
        "/login", view_func=container.login_view.as_view(), methods=["GET"]
    )

    app.add_url_rule(
        "/settings",
        view_func=container.settings_view.as_view(),
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

    socket_provider = SocketIOProvider()
    socket = socket_provider.socket_provider().socketio
    socket.init_app(app)

    auth_provider = AuthManagerProvider()
    auth = auth_provider.auth_provider().loginManager
    auth.init_app(app)

    app.config["JSON_AS_ASCII"] = False
    app.config["SECRET_KEY"] = "q1w2e3r4#"
    app.config.update(
        SESSION_COOKIE_SECURE=True,
        SESSION_COOKIE_HTTPONLY=True,
        SESSION_COOKIE_SAMESITE="Lax",
    )

    return socket, app
