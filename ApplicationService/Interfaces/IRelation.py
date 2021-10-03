from typing import List
from interface import Interface

from ApplicationService.Dtos.RelationTripletsParamsDto import RelationTripletsParamsDto

class IRelation(Interface):
    
    def get_triplets(self, args: RelationTripletsParamsDto) -> List[str]:
        pass