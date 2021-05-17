from containers import ApplicationContainer, SocketIOProvider

def create_app():

    container = ApplicationContainer()
    app = container.app()
    app.container = container

    app.add_url_rule('/', 
                view_func = container.index_view.as_view(), 
                methods=['GET',])
    app.add_url_rule('/settings', 
                view_func = container.settings_view.as_view(), 
                methods=['GET',])

    app.add_url_rule('/api/get_tables', 
                view_func = container.get_tables_api.as_view(), 
                methods=['GET',])

    socket_provider = SocketIOProvider()
    socket = socket_provider.socket_provider().socketio
    socket.init_app(app)

    return socket, app