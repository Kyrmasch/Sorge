from dependency_injector import providers, containers
from ApplicationService.Implementation.Socket import Socket
from ApplicationService.Implementation.Table import Table

class SocketProvider(containers.DeclarativeContainer):
    config = providers.Configuration()
    socket_provider = providers.Singleton(Socket, config)

class TableProvider(containers.DeclarativeContainer):
    config = providers.Configuration()
    table_provider = providers.Singleton(Table, config)

socket = SocketProvider().socket_provider().socketio
table = TableProvider().table_provider()