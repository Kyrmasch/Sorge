import json
from interface import implements
import redis
import time
import threading
from ApplicationService.DepentencyInjection import socket
from Infrastructure.Interfaces.IRedisApi import IRedisApi

class RedisApi(implements(IRedisApi)):
    def __init__(self, config) -> None:
        self.config = config
        self.redis = redis.StrictRedis(
            host="localhost", port=6379, password="", decode_responses=True)
        if self.redis.ping() == True:
            redis_thread = threading.Thread(
                target=self.send, args=())
            redis_thread.daemon = True
            redis_thread.name = "Redis"
            redis_thread.start()
        else:
            pass

    def send(self):
        time.sleep(5)
        while True:
            if socket is not None:
                try:
                    socket.emit("progress", { "Work": "A" }, broadcast=True)
                    if self.redis.ping() == True:
                        message = self.redis.get('sorge')
                        self.redis.delete('sorge')
                        if (message is not None):
                            data = json.loads(message)
                            socket.emit(data['command'], data['value'], broadcast=True)
                    time.sleep(0.5)
                except  Exception as e:
                    print(str(e))

    def write(self, key, message):
        try:
            if self.redis.ping() == True:
                self.redis.set('sorge', json.dumps({
                    'command': key,
                    'value': message
                }))
        except Exception as e:
            print(str(e))
