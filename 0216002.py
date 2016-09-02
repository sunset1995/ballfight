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
    #print(myPos)


    dis = ((myPos[1]*myPos[1])+(myPos[0]*myPos[0]))**0.5
    e_dis = ((enemyPos[1]*enemyPos[1])+(enemyPos[0]*enemyPos[0]))**0.5
    safe = e_dis - dis
    speed = ((mySpeed[1]*mySpeed[1])+(mySpeed[0]*mySpeed[0]))**0.5
    die = arenaR - dis
    

    
    print('Radious',arenaR)


    if(die < 50):
        print('Die', die)
        print('x:',myPos[0]*10)
        print('y:',myPos[1]*10)
        return[(myPos[0]*-10),(myPos[1]*-10)]

    if(safe < 30):
        print('dangerous-----------------', safe)
        print('x:',(enemyPos[0]-myPos[0])*10)
        print('y:',(enemyPos[1]-myPos[1])*10)
        return[(enemyPos[0]-myPos[0])*10,(enemyPos[1]-myPos[1])*10]







    if(dis <50 and e_dis>100):
        print('inside')
        print('speed:',speed)
        print('dis:',dis)
        if(mySpeed[0]>0 and mySpeed[1]>0):
            return[-1000,-1000]
        elif(mySpeed[0]>0 and mySpeed[1]<0):
            return[-1000,1000]
        elif(mySpeed[0]<0 and mySpeed[1]>0):
            return[1000,-1000]
        elif(mySpeed[0]<0 and mySpeed[1]<0):
            return[1000,1000]
        elif(mySpeed[0]>0 and mySpeed[1]==0):
            return[-1000,0]
        elif(mySpeed[0]<0 and mySpeed[1]==0):
            return[1000,0]
        elif(mySpeed[0]==0 and mySpeed[1]>0):
            return[0,-1000]
        elif(mySpeed[0]==0 and mySpeed[1]<0):
            return[0,1000]

    

    if(speed <50):
        print('Fight  F=1000')
        print('speed:',speed)
        print('dis:',dis)
        if(myPos[0]>0 and myPos[1]>0):
            return[-1000,-1000]
        elif(myPos[0]>0 and myPos[1]<0):
            return[-1000,1000]
        elif(myPos[0]<0 and myPos[1]>0):
            return[1000,-1000]
        elif(myPos[0]<0 and myPos[1]<0):
            return[1000,1000]
        elif(myPos[0]>0 and myPos[1]==0):
            return[-1000,0]
        elif(myPos[0]<0 and myPos[1]==0):
            return[1000,0]
        elif(myPos[0]==0 and myPos[1]>0):
            return[0,-1000]
        elif(myPos[0]==0 and myPos[1]<0):
            return[0,1000]


    if(speed <100 ):
        print('Fight  F=700')
        print('speed:',speed)
        print('dis:',dis)
        if(myPos[0]>0 and myPos[1]>0):
            return[-700,-700]
        elif(myPos[0]>0 and myPos[1]<0):
            return[-700,700]
        elif(myPos[0]<0 and myPos[1]>0):
            return[700,-700]
        elif(myPos[0]<0 and myPos[1]<0):
            return[700,700]
        elif(myPos[0]>0 and myPos[1]==0):
            return[-700,0]
        elif(myPos[0]<0 and myPos[1]==0):
            return[700,0]
        elif(myPos[0]==0 and myPos[1]>0):
            return[0,-700]
        elif(myPos[0]==0 and myPos[1]<0):
            return[0,700]

    

    if(speed <150):
        print('Fight  F=300')
        print('speed:',speed)
        print('dis:',dis)
        if(myPos[0]>0 and myPos[1]>0):
            return[-300,-300]
        elif(myPos[0]>0 and myPos[1]<0):
            return[-300,300]
        elif(myPos[0]<0 and myPos[1]>0):
            return[300,-300]
        elif(myPos[0]<0 and myPos[1]<0):
            return[300,300]
        elif(myPos[0]>0 and myPos[1]==0):
            return[-300,0]
        elif(myPos[0]<0 and myPos[1]==0):
            return[300,0]
        elif(myPos[0]==0 and myPos[1]>0):
            return[0,-300]
        elif(myPos[0]==0 and myPos[1]<0):
            return[0,300]

    else:
        print('Fight  F=10')
        print('speed:',speed)
        print('dis:',dis)
        if(myPos[0]>0 and myPos[1]>0):
            return[-10,-10]
        elif(myPos[0]>0 and myPos[1]<0):
            return[-10,10]
        elif(myPos[0]<0 and myPos[1]>0):
            return[10,-10]
        elif(myPos[0]<0 and myPos[1]<0):
            return[10,10]
        elif(myPos[0]>0 and myPos[1]==0):
            return[-10,0]
        elif(myPos[0]<0 and myPos[1]==0):
            return[10,0]
        elif(myPos[0]==0 and myPos[1]>0):
            return[0,-10]
        elif(myPos[0]==0 and myPos[1]<0):
            return[0,10]
        elif(myPos[0]==0 and myPos[1]==0):
            return[0,0]
        
   

        

        
        
        



api.play('ws://snp2016.nctu.me:8080/ws', 'a', strategy)
