import api


def strategy():

    info = api.get()
    print('=======================')
    print('radius', api.getRadius())
    print('me    ', api.getMe())
    print('friend', api.getFriend())
    print('enemy1', api.getEnemy1())
    print('enemy2', api.getEnemy2())

    return [1000, 1000, 'gogo']


api.play('ws://demo-bf-sunset1995.c9users.io:8080/ws', 'demo-room', '君の名', strategy)
