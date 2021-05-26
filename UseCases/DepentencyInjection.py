from dependency_injector import providers, containers
from UseCases.Services.ParserService import ParserService

class ParserServiceProvider(containers.DeclarativeContainer):
    config = providers.Configuration()
    parser_provider = providers.Singleton(ParserService, config)

parser = ParserServiceProvider().parser_provider()