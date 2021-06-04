from dependency_injector import providers, containers
from UseCases.html.Implementation.HtmlParserService import HtmlParserService
from UseCases.pdf.Implementation.PdfParserService import PdfParserService
from UseCases.image.Implementation.ImageParserService import ImageParserService
from UseCases.wiki.Implementation.WikiService import WikiService

class HtmlParserServiceProvider(containers.DeclarativeContainer):
    config = providers.Configuration()
    html_parser_provider = providers.Singleton(HtmlParserService, config)

class PdfParserServiceProvider(containers.DeclarativeContainer):
    config = providers.Configuration()
    pdf_parser_provider = providers.Singleton(PdfParserService, config)

class ImageParserServiceProvider(containers.DeclarativeContainer):
    config = providers.Configuration()
    image_parser_provider = providers.Singleton(ImageParserService, config)

class WikiServiceProvider(containers.DeclarativeContainer):
    config = providers.Configuration()
    wiki_provider = providers.Singleton(WikiService, config)

html    = HtmlParserServiceProvider().html_parser_provider()
pdf     = PdfParserServiceProvider().pdf_parser_provider()
image   = ImageParserServiceProvider().image_parser_provider()
wiki    = WikiServiceProvider().wiki_provider()