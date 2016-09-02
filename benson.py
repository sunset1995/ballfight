import api


lastPos =[0,250]


def length(A,B):                              #算兩點的距離
    L2= (A[0]-B[0])**2 + (A[1]-B[1])**2
    return L2**(1/2)

def vertical(L):                              #求得垂直向量
    Vx= L[1]
    if L[0]== 0:
        if L[1]>0:
            Vy=-1
        else:
            Vy=1
    else:
        Vy= L[0]*(-1)
        
    return [Vx,Vy]



def strategy():
    global lastPos
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
        

    
    Lh=length(myPos,[0,0])                  #hero和圓心的距離
    lastL=length(lastPos,[0,0])
    Le=length(enemyPos,[0,0])               #enemy和圓心的距離
    Lhe=length(myPos,enemyPos)              #hero和enemy的距離   
    speed=length(mySpeed,[0,0])             #hero的速度
    
    if Lh>100:                              #外圍向內加速 
        X=myPos[0]*(-1)*50*Lh
        Y=myPos[1]*(-1)*50*Lh
    else:
        X=myPos[0]*(-1)*500                 #內圈擺動 
        Y=myPos[1]*(-1)*500
    
    if (Lhe<60)  :                          #碰撞撞開 
        X= X+(enemyPos[0]-myPos[0])*100      
        Y= Y+(enemyPos[1]-myPos[1])*100
        print("PON")

    
    
    if (arenaR<100) and (Le<Lh) :                 #範圍變小 且enemy較近圓心 撞
        X= X+(enemyPos[0]/2-myPos[0])*500
        Y= Y+(enemyPos[1]/2-myPos[1])*500
    
    if (arenaR-Lh)<70:                        #向內加速
        print("short circle")
        X= X+myPos[0]*(-1)*300
        Y= Y+myPos[1]*(-1)*300
        if  speed>150:                   #避免出界
            X= X+myPos[0]*(-1)*100
            Y= Y+myPos[1]*(-1)*100
            print("slow down")
    
    if (arenaR<100) and (lastL<Lh):         #正在往外
        X= X+(myPos[0])*(-1)*200
        Y= Y+(myPos[1])*(-1)*200

    print(lastPos)
    
    lastPos=myPos
    
    return [X,Y]


api.play('ws://finalproject-benson820827.c9users.io:8080/ws', 'benson', strategy)
