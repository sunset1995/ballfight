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
    f = [enemy[0]-me[0], enemy[1]-me[1]]
    fLen = math.sqrt(f[0]**2 + f[1]**2)
    f[0] /= fLen
    f[1] /= fLen
    disHero = fLen
    disGG = arenaR - math.sqrt(me[0]**2 + me[1]**2)
    if disGG < 50:
        f[0] *= 100
        f[1] *= 100
    elif disHero < 150:
        f[0] *= 20
        f[1] *= 20
    else:
        f[0] *= 5
        f[1] *= 5
    return f
