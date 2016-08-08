import sys
import json
import math
import time
import array
import msgpack
from twisted.internet import reactor
from twisted.internet.defer import inlineCallbacks
from autobahn.twisted.wamp import ApplicationSession
from autobahn.twisted.wamp import ApplicationRunner

url = 'ws://wamp-router-sunset1995.c9users.io:8080/ws'
roomName = 'default'
mode = 'softer'
role = 'hero'
agent = lambda: [0, 0]
data = {
    b'state': b'first',
    b'heroPos': [0, 0],
    b'heroSpeed': [0, 0],
    b'monsterPos': [0, 0],
    b'monsterSpeed': [0, 0],
    b'radius': 0,
    b'gsensor': [0, 0],
}
autoStart = False



# Connector
class BallfightConnector(ApplicationSession):

    @inlineCallbacks
    def onJoin(self, details):
        print("Connection success")
        print("Setting game ...")

        stateTopic = 'server.%s' % (roomName)
        actionTopic = 'player.%s' % (roomName)



        try:
            yield self.publish(u'joinRoom', roomName, mode, autoStart)
        except Exception as e:
            print("fail to join room")
            sys.exit(0)


        # Used to check whether time elapse too long within same state
        # For fear that user registed agent take too long time and flood the receive queue
        lastState = 'x'
        lastRemoteTimestamp = 0
        lastLocalTimestamp = 0
        def stateChangeHandler(*args):
            nonlocal lastState
            nonlocal lastRemoteTimestamp
            nonlocal lastLocalTimestamp
            global data
            kargs = msgpack.unpackb(array.array('B', args[0]['data']))
            data = kargs

            if kargs[b'state'] != b'':
                if lastState != 'non-fight':
                    agent()
                    lastState = 'non-fight'
                return

            nowLocal = math.floor(time.time() * 1000)
            eps = nowLocal + (lastRemoteTimestamp - lastLocalTimestamp) - kargs[b'timestamp']
            skip = eps > 50 and lastState=='fighting'
            if skip:
                return
            lastState = 'fighting'
            lastRemoteTimestamp = kargs[b'timestamp']
            lastLocalTimestamp = nowLocal

            force = agent()
            if not isinstance(force, list) or len(force)!=2:
                print('You should give me [fx, fy]')
                print('But you give me ', force)
                sys.exit(0)
            else:
                self.publish(actionTopic, role, force)

        try:
            yield self.subscribe(stateChangeHandler, stateTopic)
        except Exception as e:
            print("fail to subscribe")
            sys.exit(0)

        print("Setting game success")
        print("Enjoy it!")


    def onDisconnect(self):
        print("Connection closed, press ctrl + c to exit")
        if reactor.running:
            reactor.stop()



# Game info api
def getState():
    if b'state' in data:
        return data[b'state'].decode()
    return ''

def getMyPosition():
    key = b'heroPos' if role == 'hero' else b'monsterPos'
    if key in data:
        return data[key]
    return [0, 0]

def getMySpeed():
    key = b'heroSpeed' if role == 'hero' else b'monsterSpeed'
    if key in data:
        return data[key]
    return [0, 0]

def getEnemyPosition():
    key = b'heroPos' if role != 'hero' else b'monsterPos'
    if key in data:
        return data[key]
    return [0, 0]

def getEnemySpeed():
    key = b'heroSpeed' if role != 'hero' else b'monsterSpeed'
    if key in data:
        return data[key]
    return [0, 0]

def getArenaRadius():
    if b'radius' in data:
        return data[b'radius']
    return 350

def getGsensor():
    if b'gsensor' in data:
        return data[b'gsensor']
    return [0, 0]



# Connection api
def setUrl(newurl):
    global url
    url = newurl

def setRoom(rname):
    global roomName
    roomName = rname

def setMonster(monster):
    global mode
    global role
    mode = monster
    role = 'hero'

def setPVP(r):
    global mode
    global role
    mode = 'PVP'
    role = r

def play(strategy, auto=False):
    global agent
    global autoStart

    agent = strategy
    if auto:
        autoStart = True
    
    print("Connecting to server %s ..." % (url))
    runner = ApplicationRunner(url=url, realm=u"ballfight")
    runner.run(BallfightConnector)
