from dependency_injector import providers, containers
from UseCases.WebPage.Implementation.HtmlParserService import HtmlParserService
from UseCases.PortableDocumentFormat.Implementation.PdfParserService import PdfParserService
from UseCases.Pictures.Implementation.ImageParserService import ImageParserService
from UseCases.Wikipedia.Implementation.WikiService import WikiService
from UseCases.KeyWords.Implementation.KeyWordService import KeyWordService

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

class KeyWordServiceProvider(containers.DeclarativeContainer):
    config = providers.Configuration()
    keywords_provider = providers.Singleton(KeyWordService, config)

html        = HtmlParserServiceProvider().html_parser_provider()
pdf         = PdfParserServiceProvider().pdf_parser_provider()
image       = ImageParserServiceProvider().image_parser_provider()
wiki        = WikiServiceProvider().wiki_provider()
keywords    = KeyWordServiceProvider().keywords_provider()