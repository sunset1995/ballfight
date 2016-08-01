import math

def reaction(myPos, mySpeed, enemyPos, enemySpeed, arenaR):
    f = [enemyPos[0]-myPos[0], enemyPos[1]-myPos[1]]
    fLen = math.sqrt(f[0]**2 + f[1]**2)
    f[0] /= fLen
    f[1] /= fLen
    disHero = fLen
    disGG = arenaR - math.sqrt(myPos[0]**2 + myPos[1]**2)
    if disGG < 50:
        f[0] *= 1000
        f[1] *= 1000
    elif disHero < 150:
        f[0] *= 500
        f[1] *= 500
    else:
        f[0] *= 200
        f[1] *= 200
    return f
