import math

def reaction(myPos, mySpeed, enemyPos, enemySpeed, arenaR):
    f = [-myPos[0], -myPos[1]]
    fLen = math.sqrt(f[0]**2 + f[1]**2)
    if math.fabs(fLen) < 0.1:
        return f
    f[0] = f[0]*100/fLen - myPos[0]
    f[1] = f[1]*100/fLen - myPos[1]
    return f
