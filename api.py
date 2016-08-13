import sys
import json
import math
import time
from twisted.internet import reactor
from twisted.internet.defer import inlineCallbacks
from autobahn.twisted.wamp import ApplicationSession
from autobahn.twisted.wamp import ApplicationRunner

roomName = 'default'
role = 'hero'
agent = lambda: [0, 0]
data = {
    'state': 'first',
    'heroPos': [0, 0],
    'heroSpeed': [0, 0],
    'monsterPos': [0, 0],
    'monsterSpeed': [0, 0],
    'radius': 0,
    'gsensor': [0, 0],
}



# Connector
class BallfightConnector(ApplicationSession):

    @inlineCallbacks
    def onJoin(self, details):
        print("Connection success")
        print("Setting game ...")

        actionTopic = '%s.%s' % (roomName, role)
        stateTopic = '%s.arena' % (roomName)
        gsensorTopic = '%s.gsensor.%s' % (roomName, role)


        # Used to check whether time elapse too long within same state
        # For fear that user registed agent take too long time and flood the receive queue
        lastState = 'x'
        lastLocalTimestamp = 0
        def stateChangeHandler(**kargs):
            nonlocal lastState
            nonlocal lastLocalTimestamp
            global data
            data.update(kargs)

            if kargs['state'] != '':
                if lastState != 'non-fight':
                    agent()
                    lastState = 'non-fight'
                return

            nowLocal = math.floor(time.time() * 1000)
            eps = nowLocal - lastLocalTimestamp
            lastLocalTimestamp = nowLocal
            skip = eps > 50 and lastState=='fighting'
            if skip:
                return
            lastState = 'fighting'

            force = agent()
            if not isinstance(force, list) or len(force)!=2:
                print('You should give me [fx, fy]')
                print('But you give me ', type(force), force)
                sys.exit(0)
            else:
                self.publish(actionTopic, force)


        def gsensorChange(*args):
            global data
            data['gsensor'] = list(args)


        try:
            yield self.subscribe(stateChangeHandler, stateTopic)
            yield self.subscribe(gsensorChange, gsensorTopic)
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
    if 'state' in data:
        return data['state']
    return ''

def getMyPosition():
    key = 'heroPos' if role == 'hero' else 'monsterPos'
    if key in data:
        return data[key]
    return [0, 0]

def getMySpeed():
    key = 'heroSpeed' if role == 'hero' else 'monsterSpeed'
    if key in data:
        return data[key]
    return [0, 0]

def getEnemyPosition():
    key = 'heroPos' if role != 'hero' else 'monsterPos'
    if key in data:
        return data[key]
    return [0, 0]

def getEnemySpeed():
    key = 'heroSpeed' if role != 'hero' else 'monsterSpeed'
    if key in data:
        return data[key]
    return [0, 0]

def getArenaRadius():
    if 'radius' in data:
        return data['radius']
    return 350

def getGsensor():
    if 'gsensor' in data:
        return data['gsensor']
    return [0, 0]



# Connection api
def setRole(monster):
    # Work when PVP
    global role
    role = 'hero'

def play(url, rname, strategy):
    global agent
    global roomName

    agent = strategy
    roomName = rname
    
    print("Connecting to server %s ..." % (url))
    runner = ApplicationRunner(url=url, realm=u"ballfight")
    runner.run(BallfightConnector)
