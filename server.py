import json
from autobahn.asyncio.websocket import WebSocketServerProtocol
from autobahn.asyncio.websocket import WebSocketServerFactory


class BallfightServerProtocal(WebSocketServerProtocol):

    def __init__(self):
        WebSocketServerProtocol.__init__(self)
        self.handshakeDone = False
        self.role = None


    def dispatch(self, action, data):
        msg = json.dumps(data).encode('utf8')

        if action == 'toPlayer':
            self.factory.toPlayer(msg)
        elif action == 'toArena':
            self.factory.toArena(msg)
        elif action == 'setrole':
            self.role = data
            self.factory.setrole(self, data)


    def onOpen(self):
        self.handshakeDone = True

        
    def onMessage(self, payload, isBinary):
        if isBinary or not self.handshakeDone:
            return

        req = None
        try:
            req = json.loads(payload.decode('utf8'))
        except JSONDecodeError:
            return

        if req and 'action' in req and 'data' in req:
            self.dispatch(req['action'], req['data'])


    def onClose(self, wasClean, code, reason):
        self.factory.unregister(self, self.role)
        WebSocketServerProtocol.onClose(self, wasClean, code, reason)




class BallfightSeverFactory(WebSocketServerFactory):

    def __init__(self, url):
        WebSocketServerFactory.__init__(self, url)
        self.hero = None
        self.monster = None
        self.arena = None

        self.__show__()


    def __show__(self):
        hS = '\033[92m' if self.hero else '\033[91m'
        mS = '\033[92m' if self.monster else '\033[91m'
        aS = '\033[92m' if self.arena else '\033[91m'
        print('%s hero \033[0m | %s monster \033[0m | %s arena \033[0m' % (hS, mS, aS), end='\r', flush=True)


    def toPlayer(self, msg):
        if self.hero:
            self.hero.sendMessage(msg)

        if self.monster:
            self.monster.sendMessage(msg)


    def toArena(self, msg):
        if self.arena:
            self.arena.sendMessage(msg)


    def setrole(self, client, role):
        if role == 'hero':
            self.hero = client
        elif role == 'monster':
            self.monster = client
        elif role == 'arena':
            self.arena = client

        self.__show__()


    def unregister(self, client, role):
        if role == 'hero':
            if self.hero == client:
                self.hero = None
        elif role == 'monster':
            if self.monster == client:
                self.monster = None
        elif role == 'arena':
            if self.arena == client:
                self.arena = None

        self.__show__()




try:
    import asyncio
except ImportError:
    # Trollius >= 0.3 was renamed
    import trollius as asyncio

factory = BallfightSeverFactory("ws://127.0.0.1:8080")
factory.protocol = BallfightServerProtocal

loop = asyncio.get_event_loop()
coro = loop.create_server(factory, '0.0.0.0', 8080)
server = loop.run_until_complete(coro)

try:
    loop.run_forever()
except KeyboardInterrupt:
    pass
finally:
    server.close()
    loop.close()
