import math
import time
import sys
from components import physicalEngine
from socketIO_client import SocketIO, LoggingNamespace
socketIO = SocketIO('localhost', 8000, LoggingNamespace)
socketIO.emit('register', 'arena')




# holding clock for all game
__fps = 40
__duration = 1 / __fps

gameResult = 'first'
arenaRadius = 700
hero = physicalEngine.Ball()
monster = physicalEngine.Ball()




def __actionChangeHandler(action):
    global hero
    global monster
    hero.applyForce(action['hero'])
    monster.applyForce(action['monster'])
socketIO.on('actionChange', __actionChangeHandler)




def __startGameHandler():
    global heroAction
    global monsterAction
    global arenaRadius
    global hero
    global monster
    global gameResult
    if gameResult == 'playing':
        return
    gameResult = 'playing'
    heroAction = [0, 0]
    monsterAction = [0, 0]
    arenaRadius = 700
    hero.reset()
    monster.reset()
socketIO.on('startGame', __startGameHandler)




def fallout(ball):
    return math.sqrt(ball.x**2 + ball.y**2) > arenaRadius + 25

def isCollision(ballA, ballB):
    return physicalEngine.BallDistance(hero, monster) < 50

def phase():
    hero.next(__duration)
    monster.next(__duration)


    if gameResult == 'playing':
        if isCollision(hero, monster):
            physicalEngine.BallCollision(hero, monster)

        arenaRadius -= __duration

        if fallout(hero):
            gameResult = 'lose'
        elif fallout(monster):
            gameResult = 'win'


    socketIO.emit('updateStatus', {
        'hero': [hero.x, hero.y, hero.vx, hero.vy],
        'monster': [monster.x, monster.y, monster.vx, monster.vy],
        'arena': arenaRadius,
        'result': gameResult
        })

    time.sleep(__duration)

try:
    while True:
        phase()
except KeyboardInterrupt:
    socketIO.off('actionChange')
    socketIO.off('startGame')
    sys.exit(0)
