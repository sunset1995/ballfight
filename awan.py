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

    # print('mySpeed = %f, %f'  %(mySpeed[0], mySpeed[1]))
    # print('enemySpeed = %f, %f' %(enemySpeed[0], enemySpeed[1]))
    # print('arenaR = %d, state = %s' %(arenaR, state) ) 
    #return [50, -100]
    
    
    ## 往敵方方向 (difx, dify)
    difx = enemyPos[0]-myPos[0]
    dify = enemyPos[1]-myPos[1]
    
    ## 往我方方向 (Mydifx, Mydify)
    Mydifx = myPos[0]-enemyPos[0]
    Mydify = myPos[1]-enemyPos[1]
    
    Dis_mytocenter = (myPos[0]*myPos[0]+myPos[1]*myPos[1])**0.5
    Dis_enemytocenter = (enemyPos[0]*enemyPos[0]+enemyPos[1]*enemyPos[1])**0.5
    MySpeedValue = (mySpeed[0]*mySpeed[0]+mySpeed[1]*mySpeed[1])**0.5
    EnemySpeedValue = (enemySpeed[0]*enemySpeed[0]+enemySpeed[1]*enemySpeed[1])**0.5
    
         # case 3 煞車模式: 回復生存下來 
    if Dis_mytocenter > arenaR*0.6 or arenaR < 100: #and \
    #    (myPos[0]*myPos[0]+myPos[1]*myPos[1])**0.5 > \
     #       (enemyPos[0]*enemyPos[0]+enemyPos[1]*enemyPos[1])**0.5:
       
        # if arenaR > 200:
        #     print('case 3.1: 生存模式1')
        #     return [difx*1000, dify*1000]
        # if arenaR < 100:
            print('case 3.2: 生存模式2')
            myPos[0]=-myPos[0]*1000
            myPos[1]=-myPos[1]*1000
            # print(myPos)
            return myPos
            
    # case 1 攻擊模式: 看對方是否比我靠近邊界再攻擊
    elif Dis_enemytocenter>arenaR*0.8 and \
        Dis_mytocenter < Dis_enemytocenter or arenaR > 200:
        print('case 1: 攻擊模式')
        return [difx*500, dify*500]
        
    # case 4 閃避模式:往正交方向閃避
    elif EnemySpeedValue> MySpeedValue*1.2 :
        #print('enemySpeed = ', enemySpeed, ' , [Mydifx, Mydify] = ', [Mydifx, Mydify] )
        print('case 4:閃避模式')
        mySpeed[0] = -enemySpeed[0]
        mySpeed[1] = enemySpeed[1]
        return mySpeed
        
    # case 2 一般模式: 
    elif Dis_mytocenter <= arenaR*0.6 :
        print('case 2: 一般模式')
        if arenaR > 100:
            print('case 2.1: arenaR > 100')
            return [10*difx, 10*dify]
        # myPos[0]=-myPos[0]*500
        # myPos[1]=-myPos[1]*500
        else:
            print('case 2.2: arenaR < 100')
            return [5*difx, 5*dify]
        

    
    

api.play('ws://snp2016.nctu.me:8080/ws', 'awan', strategy)
