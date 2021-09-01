class GetGraphDto(object):
    def __init__(self, nodes, edges, words = []):
        self.nodes = nodes
        self.edges = edges
        self.words = words