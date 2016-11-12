import api


def strategy():

    info = api.get()
    print('radius', info['radius'])
    print('me', info['me'])
    print('friend', info['friend'])
    print('enemy1', info['enemy1'])
    print('enemy2', info['enemy2'])

    return [1000, 1000, 'gogo']


api.play('ws://demo-bf-sunset1995.c9users.io:8080/ws', 'demo-room', '君の名', strategy)
