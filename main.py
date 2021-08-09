# pip install -r requirements.txt

from UseCases.pdf.Implementation.PdfParserService import PdfParserService
from ApplicationService.Dtos.ParseDto import ParseDto
import logging
from app import create_app

logging.basicConfig(filename='log.log', level=logging.ERROR)

if __name__ == "__main__":
    socket, app = create_app()
    socket.run(app, host = "127.0.0.1", port = 5000, debug=True)
