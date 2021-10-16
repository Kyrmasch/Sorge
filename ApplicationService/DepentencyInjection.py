from dependency_injector import providers, containers
from ApplicationService.Implementation.Socket import Socket
from ApplicationService.Implementation.Table import Table
from ApplicationService.Implementation.KnowledgeGraph import KnowledgeGraphService
from ApplicationService.Implementation.Relation import RelationService
from ApplicationService.Implementation.SpacyRelation import SpacyRelationService
from ApplicationService.Implementation.Natasha import NatashaService


class SocketProvider(containers.DeclarativeContainer):
    config = providers.Configuration()
    socket_provider = providers.Singleton(Socket, config)


class TableProvider(containers.DeclarativeContainer):
    config = providers.Configuration()
    table_provider = providers.Singleton(Table, config)


class KnowledgeGraphProvider(containers.DeclarativeContainer):
    config = providers.Configuration()
    knowlege_graph_provider = providers.Singleton(KnowledgeGraphService, config)


class RelationProvider(containers.DeclarativeContainer):
    config = providers.Configuration()
    relation_provider = providers.Singleton(RelationService, config)


class SpacyRelationProvider(containers.DeclarativeContainer):
    config = providers.Configuration()
    relation_provider = providers.Singleton(SpacyRelationService, config)

class NatashaProvider(containers.DeclarativeContainer):
    config = providers.Configuration()
    natasha_provider = providers.Singleton(NatashaService, config)


socket = SocketProvider().socket_provider().socketio
table = TableProvider().table_provider()
knowlege_graph = KnowledgeGraphProvider().knowlege_graph_provider()
relation = RelationProvider().relation_provider()
spacy_relation = SpacyRelationProvider().relation_provider()
natasha = NatashaProvider().natasha_provider()
