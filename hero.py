import api


def strategy():
    myPos = api.getMyPosition()
    mySpeed = api.getMySpeed()
    enemyPos = api.getEnemyPosition()
    enemySpeed = api.getEnemySpeed()
    arenaR = api.getArenaRadius()
    gsensor = api.getGsensor()

    return [enemyPos[0]-myPos[0], enemyPos[1]-myPos[1]]


api.setRoom('sunset')
api.setMonster('softer')

api.play(strategy, True)
