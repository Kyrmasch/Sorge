# pip install -r requirements.txt

from UseCases.pdf.Implementation.PdfParserService import PdfParserService
from ApplicationService.Dtos.ParseDto import ParseDto
import logging
from app import create_app

logging.basicConfig(filename='log.log', level=logging.ERROR)

if __name__ == "__main__":
    socket, app = create_app()
    app.app_context().push()
    socket.run(app, debug=True)
