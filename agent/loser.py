import math

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
    f = [-me[0], -me[1]]
    fLen = math.sqrt(f[0]**2 + f[1]**2)
    if math.fabs(fLen) < 0.1:
        return f
    f[0] = f[0]*100/fLen - me[2]
    f[1] = f[1]*100/fLen - me[3]
    return f
