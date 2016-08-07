import api
import math


def strategy():
    myPos = api.getMyPosition()
    mySpeed = api.getMySpeed()
    enemyPos = api.getEnemyPosition()
    enemySpeed = api.getEnemySpeed()
    arenaR = api.getArenaRadius()
    gsensor = api.getGsensor()

    difX = enemyPos[0]-myPos[0]
    difY = enemyPos[1]-myPos[1]

    return [difX*10, difY*10]


api.setRoom('sunset')
api.setMonster('centerCamper')

api.play(strategy, False)
