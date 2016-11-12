import sys
import json
import math
import time
from twisted.internet import reactor
from twisted.internet.defer import inlineCallbacks
from autobahn.twisted.wamp import ApplicationSession
from autobahn.twisted.wamp import ApplicationRunner

roomName = 'default'
myName = 'default'
role = 'hero'
agent = lambda: [0, 0]
data = {
    'state': 'Hello',
    'me': { 'x': 0, 'y': 0, 'vx': 0, 'vy': 0, 'say': '', },
    'friend': { 'x': 0, 'y': 0, 'vx': 0, 'vy': 0, 'say': '', },
    'enemy1': { 'x': 0, 'y': 0, 'vx': 0, 'vy': 0, 'say': '', },
    'enemy2': { 'x': 0, 'y': 0, 'vx': 0, 'vy': 0, 'say': '', },
    'radius': 0,
}



# Connector
class BallfightConnector(ApplicationSession):

    @inlineCallbacks
    def onJoin(self, details):
        print("Connection success")
        print("Setting game ...")

        actionTopic = '%s.action' % (roomName)
        stateTopic = '%s.arena.%s' % (roomName, myName)
        roomnameReqTopic = '%s.name.request' % (roomName)
        roomnameRplTopic = '%s.name.reply' % (roomName)


        # Used to check whether time elapse too long within same state
        # For fear that user registed agent take too long time and flood the receive queue
        lastState = 'x'
        lastLocalTimestamp = 0
        def stateChangeHandler(**kargs):
            nonlocal lastState
            nonlocal lastLocalTimestamp
            global data
            data.update(kargs)

            if kargs['state'] != 'Playing':
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
            if not isinstance(force, list) or len(force)<2:
                print('You should give me [fx, fy]')
                print('But you give me ', type(force), force)
                sys.exit(0)
            elif len(force)==2:
                self.publish(actionTopic, name=myName, force=force)
            else:
                self.publish(actionTopic, name=myName, force=[force[0], force[1]], say=force[2])


        def nameRequestHandler(**kargs):
            self.publish(roomnameRplTopic, name=myName)


        try:
            yield self.subscribe(stateChangeHandler, stateTopic)
            yield self.subscribe(nameRequestHandler, roomnameReqTopic)
            self.publish(roomnameRplTopic, name=myName)
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
def get():
    return data



# Connection api
def play(url, rname, playername, strategy):
    global agent
    global roomName
    global myName

    agent = strategy
    roomName = rname
    myName = playername
    
    print("Connecting to server %s ..." % (url))
    runner = ApplicationRunner(url=url, realm=u"ballfight")
    runner.run(BallfightConnector)
