import math
import random

def reaction(myPos, mySpeed, enemyPos, enemySpeed, arenaR):
    f = [enemyPos[0]-myPos[0], enemyPos[1]-myPos[1]];
    fLen = math.sqrt(f[0]**2 + f[1]**2);
    f[0] /= fLen*0.022;
    f[1] /= fLen*0.022;
    f[0] += -enemySpeed[0] + random.uniform(-1, 1);
    f[1] += -enemySpeed[1] + random.uniform(-1, 1);
    return f
