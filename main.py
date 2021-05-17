#pip install -r requirements.txt 

from app import create_app

if __name__ == '__main__':
    socket, app = create_app()
    socket.run(app)