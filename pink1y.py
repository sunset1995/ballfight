import api


def strategy():
    state = api.getState()
    myPos = api.getMyPosition()
    mySpeed = api.getMySpeed()
    enemyPos = api.getEnemyPosition()
    enemySpeed = api.getEnemySpeed()
    arenaR = api.getArenaRadius()
    gsensor = api.getGsensor()

    if state!='':
        # Win or lose
        print(state)
    
    global log_file01
    
    
    disX = enemyPos[0] - myPos[0]
    disY = enemyPos[1] - myPos[1]
    print(str(disX)+','+str(disY))
    print(enemySpeed)
    
    myR = (myPos[0]**2 + myPos[1]**2)**0.5
    enR = (enemyPos[0]**2 + enemyPos[1]**2)**0.5
    disR = (disX**2 + disY**2)**0.5
    enSR = (enemySpeed[0]**2 + enemySpeed[1]**2)**0.5
    
    
    
    if myR+150 > arenaR:
        
        #籬邊緣很近就先往圓心衝    
        print('back to center')
        return [-myPos[0]*15, -myPos[1]*15]
        
    else:
        
        if disR > arenaR*0.5:
            
            #籬邊緣遠且兩者距離遠就依照敵人位置攻擊
            print('attack by enemyPos')
            return [disX*10,disY*10]
            
        else:
            
            #離很近就依照敵人位置+敵人移動方向攻擊
            print('attack by enemySpeed')
            return [(disX+enemySpeed[0])*8,(disY+enemySpeed[1])*8]
    


api.play('ws://pink1y01-pink1y.c9users.io:8080/ws', 'pink1y', strategy)
