class GetGraphDto(object):
    def __init__(self, nodes, edges, words = [], matchers = []):
        self.nodes      = nodes
        self.edges      = edges
        self.words      = words
        self.matchers   = matchers