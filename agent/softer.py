import math
import random

def reaction(me, enemy, arena_r):
    '''
        the arena(circle) origin point is (0, 0)
        left/right: (-/+, 0)
        up/down: (0, -/+)
        
        all number below is float
        me: [x, y, vx, vy]
        enemy: [x, y, vx, vy]
        arena_r: r
    '''

    ## your strategy
    f = [enemy[0]-me[0], enemy[1]-me[1]];
    fLen = math.sqrt(f[0]**2 + f[1]**2);
    f[0] /= fLen*0.011;
    f[1] /= fLen*0.011;
    f[0] += enemy[2] - me[2] + random.uniform(-1, 1);
    f[1] += enemy[3] - me[3] + random.uniform(-1, 1);
    return f
