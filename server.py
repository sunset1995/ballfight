import json
from autobahn.asyncio.websocket import WebSocketServerProtocol
from autobahn.asyncio.websocket import WebSocketServerFactory


class BallfightServerProtocal(WebSocketServerProtocol):

    def __init__(self):
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
        else:
            print('req format error')


    def connectionLost(self, reason):
        WebSocketServerProtocol.connectionLost(self, reason)
        self.factory.unregister(self, self.role)




class BallfightSeverFactory(WebSocketServerFactory):

    def __init__(self, url):
        WebSocketServerFactory.__init__(self, url)
        self.hero = None
        self.monster = None
        self.arena = None


    def toPlayer(self, msg):
        print('toPlayer')
        print(msg)
        print(self.hero)
        
        if self.hero:
            self.hero.sendMessage(msg)

        if self.monster:
            self.monster.sendMessage(msg)


    def toArena(self, msg):
        print('toArena')
        print(msg)
        if self.arena:
            self.arena.sendMessage(msg)


    def setrole(self, client, role):
        print(role)
        print(type(role))
        if role == 'hero':
            print('set as hero')
            self.hero = client
        elif role == 'monster':
            print('set as moster')
            self.monster = client
        elif role == 'arena':
            print('set as arena')
            self.arena = client


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
