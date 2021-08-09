from dependency_injector import providers, containers
from Infrastructure.Implementation.DbContext import DbContext
from Infrastructure.Implementation.AuthManager import AuthManager
from Infrastructure.Implementation.Mediator import MediatorApi
from Infrastructure.Implementation.Redis import RedisApi

class DbProvider(containers.DeclarativeContainer):
    config = providers.Configuration()
    db_provider = providers.Singleton(DbContext, config)

class MediatorApiProvider(containers.DeclarativeContainer):
    config = providers.Configuration()
    mediatr_provider = providers.Singleton(
        MediatorApi, config)

class AuthProvider(containers.DeclarativeContainer):
    config = providers.Configuration()
    auth_provider = providers.Singleton(AuthManager, config)

class RedisApiProvider(containers.DeclarativeContainer):
    config = providers.Configuration()
    redis_provider = providers.Singleton(
        RedisApi, config)


db          = DbProvider().db_provider()
auth        = AuthProvider().auth_provider()
mediatr     = MediatorApiProvider().mediatr_provider().mediatr
redis       = RedisApiProvider().redis_provider()