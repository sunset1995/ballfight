from components.gameStatus import GameStatus
import json

import os
import socketio
import eventlet
from flask import Flask
from flask import render_template
from flask import send_from_directory

sio = socketio.Server()
app = Flask(__name__)
app.debug = False

bfStatus = GameStatus()

@app.route('/<path:path>')
def web_serve(path = 'index.html'):
    return send_from_directory('static', path)

@sio.on('connect')
def connect(sid, env):
    print(sid, 'join')
    bfStatus.sid[sid] = ''
    sio.emit('memberChange', bfStatus.sid)

@sio.on('register')
def register(sid, role):
    print('%s regist as %s' % (sid, role))
    if role=='monster':
        bfStatus.sid[sid] = 'monster'
    elif role=='arena':
        bfStatus.sid[sid] = 'arena'
    else:
        bfStatus.sid[sid] = 'hero'

@sio.on('start')
def startGame(sid):
    sio.emit('startGame')

@sio.on('updateStatus')
def updateStatus(sid, data):
    if sid not in bfStatus.sid:
        print(sid, ' not registered')
        return
    if bfStatus.sid[sid]!='arena':
        print('%s not available to change state' % (sid))
        return
    print('%s update status to %s' % (sid, data))
    bfStatus.game_status = data
    sio.emit('statusChange', bfStatus.game_status)

@sio.on('updateAction')
def updateAction(sid, data):
    if sid not in bfStatus.sid:
        print(sid, ' not registered')
        return
    role = bfStatus.sid[sid]
    print('%s %s action updated to %s' % (sid, role, data))
    bfStatus.role_action[role] = data
    sio.emit('actionChange', bfStatus.role_action)

if __name__ == '__main__':
    app = socketio.Middleware(sio, app)
    app.debug = False
    eventlet.wsgi.server(eventlet.listen(('', 8000)), app, log_output=False, debug=False)
