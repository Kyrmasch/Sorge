# pip install -r requirements.txt

from UseCases.PDF.Implementation.PdfParserService import PdfParserService
from ApplicationService.Dtos.ParseDto import ParseDto
from werkzeug import debug
from app import create_app

if __name__ == "__main__":
    socket, app = create_app()
    socket.run(app, debug=True)
