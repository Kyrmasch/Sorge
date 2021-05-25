from dependency_injector import providers, containers
from ApplicationService.Implementation.Socket import Socket

class SocketProvider(containers.DeclarativeContainer):
    config = providers.Configuration()
    socket_provider = providers.Singleton(Socket, config)

socket = SocketProvider().socket_provider()