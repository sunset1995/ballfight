import json
import math
import time
import sys

from components.gameStatus import GameStatus
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

status = GameStatus()
gameStatus = status.gameStatus
roleAction = status.roleAction
hero = physicalEngine.Ball()
monster = physicalEngine.Ball()




# Process network connection
@app.route('/<path:path>')
def web_serve(path = 'index.html'):
    return send_from_directory('static', path)

@sio.on('startGame')
def startGame(sid):
    global gameStatus
    global hero
    global monster
    if gameStatus['result'] == 'playing':
        return
    gameStatus['hero'] = [0, 0]
    gameStatus['monster'] = [0, 0]
    gameStatus['arena'] = 700
    gameStatus['result'] = 'playing'
    hero.reset()
    monster.reset()




def fallout(ball):
    return math.sqrt(ball.x**2 + ball.y**2) > gameStatus['arena'] + 25

def isCollision(ballA, ballB):
    return physicalEngine.BallDistance(hero, monster) < 50

def phase():


    global gameStatus


    hero.next(__duration)
    monster.next(__duration)


    if gameStatus['result'] == 'playing':
        if isCollision(hero, monster):
            physicalEngine.BallCollision(hero, monster)

        gameStatus['arena'] -= __duration

        if fallout(hero):
            gameStatus['result'] = 'lose'
        elif fallout(monster):
            gameStatus['result'] = 'win'


    sio.emit('updateStatus', gameStatus)




if __name__ == '__main__':
    app = socketio.Middleware(sio, app)
    eventlet.wsgi.server(eventlet.listen(('', 8000)), app, log_output=False, debug=False)

    try:
        while True:
            phase()
            time.sleep(__duration)
    except KeyboardInterrupt:
        sys.exit(0)
