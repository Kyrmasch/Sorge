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
        "/maps/example",
        view_func=login_required(container.example_text.as_view()),
        methods=[
            "POST",
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
        "/api/get_table/<guid>",
        view_func=login_required(container.get_table_by_guid.as_view()),
        methods=[
            "GET",
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
        "/maps/knowlegegraph",
        view_func=login_required(container.knowlegegraph_build.as_view()),
        methods=[
            "POST",
        ],
    )

    app.add_url_rule(
        "/maps/build",
        view_func=login_required(container.map_build.as_view()),
        methods=[
            "POST",
        ],
    )

    app.add_url_rule(
        "/maps/detect",
        view_func=login_required(container.detect_lang.as_view()),
        methods=[
            "POST",
        ],
    )

    app.add_url_rule(
        "/dev/get_guids",
        view_func=login_required(container.dev_get_guids.as_view()),
        methods=[
            "GET",
        ],
    )

    app.add_url_rule(
        "/maps/get_models",
        view_func=login_required(container.get_model.as_view()),
        methods=[
            "GET",
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
    app.config["JSON_AS_ASCII"] = False

    swagger_template = {
        "components": {
            "securitySchemes": {
                "ApiKeyAuth": {"type": "apiKey", "in": "header", "name": "X-API-KEY"}
            },
            "security": {"APIKeyHeader": []},
            "schemas": {
                "RelationMethod": {
                    "type": "string",
                    "enum": ["basic", "knowlegegraph", "spacy"],
                },
                "Languages": {
                    "type": "string",
                    "enum": ["russain", "english", "kazakh"],
                },
                "Graph": {
                    "type": "object",
                    "properties": {
                        "nodes": {"type": "array", "items": {"type": "object"}},
                        "edges": {"type": "array", "items": {"type": "object"}},
                        "words": {"type": "array", "items": {"type": "object"}},
                    },
                },
                "Guids": {"type": "array", "items": {"type": "string"}},
                "ResultTables": {
                    "type": "object",
                    "properties": {
                        "result": {"type": "array", "items": {"type": "object"}},
                        "cores": {"type": "array", "items": {"type": "string"}},
                        "guids": {"type": "array", "items": {"type": "string"}},
                    },
                },
                "Wiki": {
                    "type": "object",
                    "properties": {
                        "pages": {"type": "array", "items": {"type": "string"}},
                        "info": {"type": "string"},
                    },
                },
            },
        }
    }
    swagger_config = {
        "swagger_version": "2.0",
        "title": "Sorge Api",
        "description": "Описание",
        "openapi": "3.0.3",
        "headers": [
            ("Access-Control-Allow-Origin", "*"),
            ("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS"),
            ("Access-Control-Allow-Credentials", "true"),
        ],
        "swagger_ui": True,
        "specs_route": "/api/",
        "specs": [
            {
                "version": "1.0.0",
                "title": "Sorge",
                "endpoint": "parse_api",
                "description": "Анализ таблиц",
                "route": "/api/sorge.json",
                "termsOfService": None,
                "rule_filter": lambda rule: rule.endpoint.startswith("parse_"),
                "model_filter": lambda tag: True,
            },
            {
                "version": "1.0.0",
                "title": "Concept Maps",
                "endpoint": "map_api",
                "description": "Концепт карты",
                "route": "/api/maps.json",
                "termsOfService": None,
                "rule_filter": lambda rule: rule.endpoint.startswith("map_"),
                "model_filter": lambda tag: False,
            },
        ],
    }
    swagger = Swagger(app, config=swagger_config, template=swagger_template)

    return socket, app
