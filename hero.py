import api


def strategy():
    myPos = api.getMyPosition()
    mySpeed = api.getMySpeed()
    enemyPos = api.getEnemyPosition()
    enemySpeed = api.getEnemySpeed()
    arenaR = api.getArenaRadius()
    gsensor = api.getGsensor()

    return [5000/(enemyPos[0]-myPos[0]), 5000/(enemyPos[1]-myPos[1])]


api.play('wamp-router-sunset1995.c9users.io:8080', 'sunset', 'softer', strategy)
