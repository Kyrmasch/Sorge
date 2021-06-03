from dependency_injector import providers, containers
from UseCases.HTML.Implementation.HtmlParserService import HtmlParserService
from UseCases.PDF.Implementation.PdfParserService import PdfParserService
from UseCases.IMAGE.Implementation.ImageParserService import ImageParserService

class HtmlParserServiceProvider(containers.DeclarativeContainer):
    config = providers.Configuration()
    html_parser_provider = providers.Singleton(HtmlParserService, config)

class PdfParserServiceProvider(containers.DeclarativeContainer):
    config = providers.Configuration()
    pdf_parser_provider = providers.Singleton(PdfParserService, config)

class ImageParserServiceProvider(containers.DeclarativeContainer):
    config = providers.Configuration()
    image_parser_provider = providers.Singleton(ImageParserService, config)

html = HtmlParserServiceProvider().html_parser_provider()
pdf = PdfParserServiceProvider().pdf_parser_provider()
image = ImageParserServiceProvider().image_parser_provider()