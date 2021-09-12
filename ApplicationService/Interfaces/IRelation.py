from typing import List
from interface import Interface

class IRelation(Interface):
    
    def get_triplets(self, nlp, sentences) -> List[str]:
        pass