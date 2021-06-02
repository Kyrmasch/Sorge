from dependency_injector import providers, containers
from UseCases.Parser.Implementation.ParserService import ParserService
from UseCases.PDF.Implementation.PdfParserService import PdfParserService

class ParserServiceProvider(containers.DeclarativeContainer):
    config = providers.Configuration()
    parser_provider = providers.Singleton(ParserService, config)

class PdfParserServiceProvider(containers.DeclarativeContainer):
    config = providers.Configuration()
    pdf_parser_provider = providers.Singleton(PdfParserService, config)

parser = ParserServiceProvider().parser_provider()
pdf = PdfParserServiceProvider().pdf_parser_provider()