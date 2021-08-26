import simplejson
import os

def get_guids():  
    """
    Получить GUID 
    GUID сохраненных таблиц
    ---
    tags:
      - Developer    
    parameters:
      - in: header
        name: X-API-KEY
        required: false     
    responses:
      200:
        description: Список
        schema:
          id: array
    """

    path = "/home/user/Sorge/Sorge/ApplicationService/Files/tables"
    files = os.listdir(path)
    if len(files) > 0:
        files = [os.path.splitext(f)[0] for f in files]

    result = simplejson.dumps(
        files,
        ignore_nan=True,
        encoding="utf-8",
        ensure_ascii=False
    )

    return result