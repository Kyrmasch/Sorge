from flask_socketio import SocketIO, join_room, leave_room, emit
from interface import implements
from ApplicationService.Interfaces.ISocket import ISocket

socketio = SocketIO()
socket_clients = {}


class Socket(implements(ISocket)):
    def __init__(self, config):
        self.socketio = socketio

    @staticmethod
    def join(self, message):
        print(message)


socketio.on_event("join", Socket.join)
