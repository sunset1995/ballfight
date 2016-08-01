import json
from autobahn.asyncio.websocket import WebSocketClientProtocol
from autobahn.asyncio.websocket import WebSocketClientFactory


role = 'hero'
agent = lambda: [0, 0]
data = dict()

class BallfightClientProtocal(WebSocketClientProtocol):

    def __init__(self):
        self.handshakeDone = False
        self.msg = {
            'action': 'toArena',
            'data': {
                'role': role,
                'force': [0, 0],
            },
        }

    def onOpen(self):
        self.handshakeDone = True
        self.sendMessage(json.dumps({
            'action': 'setrole',
            'data': role
        }).encode('utf8'))

    def onMessage(self, payload, isBinary):
        if isBinary or not self.handshakeDone:
            return

        global data
        res = json.loads(payload.decode('utf8'))

        data.update(res)
        self.msg['data']['force'] = agent()
        self.sendMessage(json.dumps(self.msg).encode('utf8'))




def getHeroPosition():
    if 'heroPosition' in data:
        return data['heroPosition']
    return [0, 0]

def getHeroSpeed():
    if 'heroSpeed' in data:
        return data['heroSpeed']
    return [0, 0]

def getMonsterPosition():
    if 'monsterPosition' in data:
        return data['monsterPosition']
    return [0, 0]

def getMonsterSpeed():
    if 'monsterSpeed' in data:
        return data['monsterSpeed']
    return [0, 0]

def getArenaRadius():
    if 'arenaRadius' in data:
        return data['arenaRadius']
    return 350

def play(ip, port, r='hero', a=lambda: [0,0]):
    try:
        import asyncio
    except ImportError:
        import trollius as asyncio

    global role
    global agent
    role = r
    agent = a

    factory = WebSocketClientFactory(u'ws://%s:%s' % (ip, port))
    factory.protocol = BallfightClientProtocal

    try:
        loop = asyncio.get_event_loop()
        coro = loop.create_connection(factory, ip, port)
        loop.run_until_complete(coro)
        loop.run_forever()
    except KeyboardInterrupt:
        pass
    finally:
        loop.close()
