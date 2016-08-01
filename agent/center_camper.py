import math

def reaction(myPos, mySpeed, enemyPos, enemySpeed, arenaR):
    f = [-myPos[0], -myPos[1]]
    fLen = math.sqrt(f[0]**2 + f[1]**2)
    f[0] = f[0]*500/fLen - mySpeed[0]
    f[1] = f[1]*500/fLen - mySpeed[1]
    return f
