from socketIO_client import SocketIO, LoggingNamespace
socketIO = SocketIO('localhost', 8000, LoggingNamespace)

callbacks = []

def register(role='hero'):
    socketIO.emit('register', role)

def applyForce(f=[0, 0]):
    socketIO.emit('updateAction', f)

def reactAsStateChange(callback):
    if not hasattr(callback, '__call__'):
        return 'callback must be a function'
    callbacks.append(callback)

def __statusChangeHandler(status):
    for callback in callbacks:
        callback(status)

socketIO.on('statusChange', __statusChangeHandler)
