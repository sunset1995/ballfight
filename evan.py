import api , random


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
        
    difx = enemyPos[0] - myPos[0]     # 對手與己的X差距
    dify = enemyPos[1] - myPos[1]     # 對手與己的Y差距
    
    difxo = 0 - myPos[0]
    difyo = 0 - myPos[1]
        
    x = 0
    y = 0
    
    t = random.randint(-500,500)     # 設一個隨機變數在圓心附近亂竄
    
       # 讓球碰到邊界時往圓心跑
    if difx**2 + dify**2 <=100**2:   #當距離小於等於 100 撞敵人
        if (difxo**2 + difyo**2)**0.5 > arenaR - 20:
            x = difxo*100
            y = difyo*100            # 當邊際靠近時往圓心跑
        else:
            x = difx*10 
            y = dify*10
    else:                            #當距離大於等於100 跑在原點附近
        if (difxo**2 + difyo**2)**0.5 > arenaR - 20:
            x = difxo*100
            y = difyo*100
        else:
            x = difxo*20 + t
            y = difyo*20 + t
            
            
    #print(mySpeed)
        
        
        
    #print(arenaR)
    

    return [ x , y ]





api.play('ws://j43014321-j43014321.c9users.io:8080/ws', 'yourname', strategy)
