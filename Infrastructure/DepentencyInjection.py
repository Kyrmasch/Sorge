from dependency_injector import providers, containers
from Infrastructure.Implementation.DbContext import DbContext
from Infrastructure.Implementation.AuthManager import AuthManager

class DbProvider(containers.DeclarativeContainer):
    config = providers.Configuration()
    db_provider = providers.Singleton(DbContext, config)

class AuthProvider(containers.DeclarativeContainer):
    config = providers.Configuration()
    auth_provider = providers.Singleton(AuthManager, config)

db = DbProvider().db_provider()
auth = AuthProvider().auth_provider()