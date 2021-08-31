import simplejson
import os

def parse_get_guids():  
    """
    Получить GUID 
    GUID сохраненных таблиц
    ---
    tags:
      - Developer 
    security:
        - ApiKeyAuth: []  
    responses:
      200:
        description: Список
        content:
            application/json:
              schema:
                $ref: '#/components/schemas/Guids'
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