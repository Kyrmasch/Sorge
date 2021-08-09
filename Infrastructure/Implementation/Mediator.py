from Infrastructure.Interfaces.IMediator import IMediator
from interface import implements
from mediatr import Mediator

mediatr = Mediator()

class MediatorApi(implements(IMediator)):
    def __init__(self, config) -> None:
        self.config     = config
        self.mediatr    = mediatr
