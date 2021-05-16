from containers import ApplicationContainer

def create_app():

    container = ApplicationContainer()
    app = container.app()
    app.container = container
    app.add_url_rule('/', view_func = container.index_view.as_view())
    app.add_url_rule('/settings', view_func = container.settings_view.as_view())

    return app