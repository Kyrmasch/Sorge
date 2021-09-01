from Infrastructure.DepentencyInjection import mediatr, redis
import asyncio

class ProgressCommand():
    def __init__(self, value: int, description: str) -> None:
        self.value          = value
        self.description    = description

@mediatr.handler
class SetProgressCommanddHandler():
    def handle(self, request: ProgressCommand):
        asyncio.run(self.run_commands(request))

    async def run_commands(self, request: ProgressCommand):
        A = asyncio.gather(
            self.send(request.value, request.description)
        )

    async def send(self, value: int, description: str):
        redis.write("progress", {
            "value": value,
            "description": description
        })
