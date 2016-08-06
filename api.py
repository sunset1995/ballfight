import sys
import json
from twisted.internet.defer import inlineCallbacks
from autobahn.twisted.wamp import ApplicationSession
from autobahn.twisted.wamp import ApplicationRunner


roomName = ''
role = 'hero'
agent = lambda: [0, 0]
winHandler = lambda: 'Win'
loseHandler = lambda: 'Lose'
data = {
    'heroPos': [0, 0],
    'heroSpeed': [0, 0],
    'monsterPos': [0, 0],
    'monsterSpeed': [0, 0],
    'radius': 0,
    'gsensor': [0, 0],
}


class BallfightConnector(ApplicationSession):

    @inlineCallbacks
    def onJoin(self, details):
        print("Connection success")

        stateTopic = 'server.%s' % (roomName)
        actionTopic = 'player.%s' % (roomName)
        lastState = ''

        
        try:
            print("joining room %s..." % (roomName))
            yield self.publish(u'joinRoom', roomName)
            print("join room success")
        except Exception as e:
            print("fail to join room")


        def stateChangeHandler(**kargs):
            nonlocal lastState
            print(kargs)
            data = kargs

            if 'state' not in kargs:
                return

            if kargs['state'] == '':
                force = agent()
                if type(force)!='list' or len(force)!=2:
                    print('Please give me [fx, fy]')
                    print('But you give me ', force)
                else:
                    self.publish(actionTopic, role, force)
            elif kargs['state'] == 'heroWin' and lastState != 'heroWin':
                if role=='hero':
                    winHandler()
                else:
                    loseHandler()    
            elif kargs['state'] == 'heroLose' and lastState != 'heroLose':
                if role=='hero':
                    loseHandler()
                else:
                    winHandler()

            lastState = kargs['state']


        try:
            print('subscribing %s' % stateTopic)
            yield self.subscribe(stateChangeHandler, stateTopic)
            print("subscribe success")
        except Exception as e:
            print("fail to subscribe")


    def onDisconnect(self):
        print("Connection closed")




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


def play(url, room, mode, strategy, win=lambda:'Win', lose=lambda:'Lose'):
    
    global roomName
    global role
    global agent
    global winHandler
    global loseHandler

    roomName = room
    role = 'hero' if mode!='playMonster' else 'monster'
    agent = strategy
    winHandler = win
    loseHandler = lose
    

    print("Connecting to server %s..." % (url))
    runner = ApplicationRunner(url=u"ws://%s/ws" % (url), realm=u"ballfight")
    runner.run(BallfightConnector)
