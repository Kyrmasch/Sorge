from containers import ApplicationContainer, ParcerContainer

Iparcer = ParcerContainer()
ParcerContainer.config.override({
    "db": 'nosql'
})
parcer = Iparcer.parcer_instance()

def create_app():

    container = ApplicationContainer()
    app = container.app()
    app.container = container
    app.add_url_rule('/', view_func = container.index_view.as_view())

    return app