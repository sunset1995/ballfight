import json
from twisted.internet import reactor
from autobahn.twisted.websocket import WebSocketClientFactory
from autobahn.twisted.websocket import WebSocketClientProtocol
from autobahn.twisted.websocket import connectWS


role = 'hero'
keys = {
    'my': {
        'position': 'heroPosition',
        'speed': 'heroSpeed',
    },
    'enemy': {
        'position': 'monsterPosition',
        'speed': 'monsterSpeed',
    },
    'arena': {
        'radius': 'arenaRadius',
    },
    'gsensor': {
        'x': 'gsensorX',
        'y': 'gsensorY',
        'z': 'gsensorZ',
    }
}
agent = lambda: [0, 0]
data = dict()

class BallfightClientProtocal(WebSocketClientProtocol):

    def __init__(self):
        WebSocketClientProtocol.__init__(self)
        self.handshakeDone = False
        self.msg = {
            'action': 'toArena',
            'data': {
                'role': role,
                'force': [0, 0],
            },
        }
        global keys
        if role == 'monster':
            keys['my'], keys['enemy'] = keys['enemy'], keys['my']

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

    def onClose(self, wasClean, code, reason):
        WebSocketClientProtocol.onClose(self, wasClean, code, reason)




def getMyPosition():
    if keys['my']['position'] in data:
        return data[keys['my']['position']]
    return [0, 0]

def getMySpeed():
    if keys['my']['speed'] in data:
        return data[keys['my']['speed']]
    return [0, 0]

def getEnemyPosition():
    if keys['enemy']['position'] in data:
        return data[keys['enemy']['position']]
    return [0, 0]

def getEnemySpeed():
    if keys['enemy']['speed'] in data:
        return data[keys['enemy']['speed']]
    return [0, 0]

def getArenaRadius():
    if keys['arena']['radius'] in data:
        return data[keys['arena']['radius']]
    return 350

def getGsensor():
    if keys['gsensor']['x'] in data:
        return [
            data[keys['gsensor']['x']],
            data[keys['gsensor']['y']],
            data[keys['gsensor']['z']]
        ]
    return [0, 0, 0]

def play(ip, port, a=lambda: [0,0], r='hero'):
    
    global role
    global agent
    role = r
    agent = a

    factory = WebSocketClientFactory('ws://%s:%s' % (ip, port))
    factory.protocol = BallfightClientProtocal
    connectWS(factory)

    reactor.run()
