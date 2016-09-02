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
    #enemyPos
    
    

    edgePosDiff=min(myPos[0]-arenaR,myPos[0]+arenaR,myPos[1]-arenaR,myPos[1]+arenaR)
    try: 
        print(len(oldPosDiff))
        
    except NameError:
        oldPosDiff=[]
        oldPosDiff.append(myPos[0])
        oldPosDiff.append(myPos[1])
        
    try: 
        print(len(nowPosDiff))
        nowPosDiff[0]=myPos[0]-enemyPos[0]
        nowPosDiff[1]=myPos[1]-enemyPos[1]
    except NameError:
        nowPosDiff=[]
        nowPosDiff.append(myPos[0]-enemyPos[0])
        nowPosDiff.append(myPos[1]-enemyPos[1])
    try:    
        nowDiff[0]=nowPosDiff[0]*nowPosDiff[0]
        nowDiff[1]=nowPosDiff[1]*nowPosDiff[1]
        oldDiff[0]=oldPosDiff[0]*oldPosDiff[0]
        oldDiff[1]=oldPosDiff[1]*oldPosDiff[1]
    except NameError:
        nowDiff=[]
        oldDiff=[]
        nowDiff.append(nowPosDiff[0]*nowPosDiff[0])
        nowDiff.append(nowPosDiff[1]*nowPosDiff[1])
        oldDiff.append(oldPosDiff[0]*oldPosDiff[0])
        oldDiff.append(oldPosDiff[1]*oldPosDiff[1])
    if sum(oldDiff)<sum(nowDiff) :
       return [-nowPosDiff[0]*100, -nowPosDiff[1]*100] 
    elif sum(oldDiff)>edgePosDiff**2:
       return [(((-myPos[0]>0)==0)-0.5)*2*enemySpeed[0]**2, (((-myPos[1]>0)==0)-0.5)*2*enemySpeed[1]**2]   
    else: 
       return [-myPos[0]*10, -myPos[1]*10]
    

api.play('ws://snp2016.nctu.me:8080/ws', 'yourname', strategy)
