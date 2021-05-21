from flask_socketio import SocketIO, join_room, leave_room
from flask import current_app
from interface import implements
from ApplicationService.Interfaces.ISocket import ISocket

socketio = SocketIO(cors_allowed_origins="*", async_mode="threading")

class SocketProvider(implements(ISocket)):
    def __init__(self, config):
        self.socketio = socketio

    @socketio.on("get")
    def get(self, message):
        self.socketio.emit("get", {"result": []})
