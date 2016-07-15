import json
import math
import time
import sys

from agent.loser import reaction as heroAction
from agent.softer import reaction as monsterAction
from components import physicalEngine

import os
import socketio
import eventlet
from flask import Flask
from flask import render_template
from flask import send_from_directory

sio = socketio.Server(async_mode='eventlet')
app = Flask(__name__)
app.debug = False




# holding clock for all game
__fps = 40
__duration = 1 / __fps

# gamer
hero = physicalEngine.Ball()
monster = physicalEngine.Ball()
arena = 700

# first/playing/lose/win
result = 'first'




# Process network connection
@app.route('/<path:path>')
def web_serve(path = 'index.html'):
    return send_from_directory('static', path)

@sio.on('connection')
def connection(sid):
    print("%s join" % sid)

@sio.on('disconnection')
def disconnection(sid):
    print("%s exit" % sid)

@sio.on('startGame')
def startGame(sid):
    global hero
    global monster
    global result
    global arena
    if result == 'playing':
        return
    print('start game')
    result = 'playing'
    arena = 700
    hero.reset()
    monster.reset()




def fallout(ball):
    return math.sqrt(ball.x**2 + ball.y**2) > arena + 25

def isCollision(ballA, ballB):
    return physicalEngine.BallDistance(hero, monster) < 50

def phase():


    global result
    global arena


    if result == 'playing':
        heroInfo = [hero.x, hero.y, hero.vx, hero.vy]
        monsterInfo = [monster.x, monster.y, monster.vx, monster.vy]

        heroAction(heroInfo, monsterInfo, arena)
        monsterAction(monsterInfo, heroInfo, arena)

    hero.next(__duration)
    monster.next(__duration)

    if isCollision(hero, monster):
        physicalEngine.BallCollision(hero, monster)

    if result == 'playing':
        arena -= __duration

        if fallout(hero):
            result = 'lose'
        elif fallout(monster):
            result = 'win'


    sio.emit('statusChange', {
        'hero': [hero.x, hero.y, hero.vx, hero.vy],
        'monster': [monster.x, monster.y, monster.vx, monster.vy],
        'arena': arena
        })




if __name__ == '__main__':
    app = socketio.Middleware(sio, app)
    eventlet.wsgi.server(eventlet.listen(('', 8000)), app, log_output=False, debug=False)

    #try:
    #    while True:
    #        phase()
    #        time.sleep(__duration)
    #except KeyboardInterrupt:
    #    sys.exit(0)
