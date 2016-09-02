import api
import random

def strategy():
    state = api.getState()
    myPos = api.getMyPosition()
    mySpeed = api.getMySpeed()
    enemyPos = api.getEnemyPosition()
    enemySpeed = api.getEnemySpeed()
    arenaR = api.getArenaRadius()
    gsensor = api.getGsensor()
    power = 100000


    if state!='':
        # Win or lose
        print(state)
    #if(myPos[0]!=0 or myPos[1]!=0):
      #move_x = myPos[0]
      #move_y = myPos[1]
     # power = power -100
    #else:
    move_x = myPos[0]-enemyPos[0]
    move_y = myPos[1]-enemyPos[1]
    power = 100000
    #print(move_x)
    #print(move_y)
    print(arenaR)
    print((myPos[0]**2 + myPos[1]**2)**0.5)
    if ((myPos[0]**2 + myPos[1]**2)**0.5 > (arenaR-100)):
        power = 1000000
        move_x = (myPos[0])
        move_y = (myPos[1])
        if(arenaR < 30):
            move_x = myPos[0]-enemyPos[0]
            move_y = myPos[1]-enemyPos[1]
            power = 10

    else:
        power = 1000000
        move_x = myPos[0]-enemyPos[0]
        move_y = myPos[1]-enemyPos[1]

    return [-(move_x)*power,-(move_y)*power]


api.play('ws://snp2016.nctu.me:8080/ws', 'serious', strategy)
