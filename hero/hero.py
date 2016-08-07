import api
import math


def strategy():
    myPos = api.getMyPosition()
    mySpeed = api.getMySpeed()
    enemyPos = api.getEnemyPosition()
    enemySpeed = api.getEnemySpeed()
    arenaR = api.getArenaRadius()
    gsensor = api.getGsensor()

    gsensor[0] = int(-gsensor[0]/10) * 10
    gsensor[1] = int(gsensor[1]/10) * 10

    return gsensor


api.setRoom('sunset')
api.setMonster('softer')

api.play(strategy, False)
