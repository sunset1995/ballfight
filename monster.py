import api
from agent.center_camper import reaction


def strategy():
    myPos = api.getMyPosition()
    mySpeed = api.getMySpeed()
    enemyPos = api.getEnemyPosition()
    enemySpeed = api.getEnemySpeed()
    arenaR = api.getArenaRadius()

    return reaction(myPos, mySpeed, enemyPos, enemySpeed, arenaR)


api.play('127.0.0.1', 8080, strategy, 'monster')
