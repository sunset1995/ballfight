// Init
var autobahn = require('autobahn');
var config = require('./config.js');
var Agent = require('./agent.js');
var Game = require('./game.js');

var connection = new autobahn.Connection({
    url: config.url,
    realm: 'ballfight',
});

var room = {};



// Define handler
connection.onopen = function (session) {

    console.log('Connection success');


    // Handle action in one room
    function actionHandler(args, kwargs, details) {
        var roomName = details.topic.slice(7);
        if( !room[roomName] )
            return;

        var action = args[0];
        var data = args[1];
        if( action === 'hero' )
            room[roomName].game.applyForceToHero(data);
        else if( action === 'monster' )
            room[roomName].game.applyForceToMonster(data);
        else if( action === 'gsensor' ) {
            if( typeof data === 'object' )
                room[roomName].gsensor = [data[0] || 0, data[1] || 0];
        }
        else if( action === 'start' )
            room[roomName].game.start();

        room[roomName].timestamp = Date.now();
    }


    // Handle join room request
    // Create one if not room not yet exited
    // No delete room machanic now
    function joinRoomHandler(args, kwargs, details) {
        var roomName = args[0];
        var mode = args[1];
        var autoStart = args[2];
        if( !room[roomName] ) {
            // Create new room
            room[roomName] = {
                game: new Game(),
                mode: 'softer',
                timestamp: Date.now(),
                gsensor: [0, 0],
            };

            // Listen for action in room
            session.subscribe('player.'+roomName, actionHandler);
        }
        
        if(typeof mode !== 'undefined')
            room[roomName].mode = mode;

        if(typeof autoStart !== 'undefined')
            room[roomName].game.autoStart = autoStart;
    }


    // Listen for joinRoom
    session.subscribe('joinRoom', joinRoomHandler);


    // Process each room
    var timestamp = Date.now();
    function judge() {
        var nowTimestamp = Date.now();
        console.log('\033[2J');
        console.log('actual elapse: ', nowTimestamp-timestamp, 'ms');
        timestamp = nowTimestamp;

        Object.keys(room).forEach((roomName) => {
            var now = room[roomName];
            var state = now.game.state;
            var hero = now.game.hero;
            var monster = now.game.monster;
            var radius = now.game.radius;
            var gsensor = now.gsensor;

            var pack = {
                'state': state,
                'heroPos': [hero.x, hero.y],
                'heroSpeed': [hero.vx, hero.vy],
                'monsterPos': [monster.x, monster.y],
                'monsterSpeed': [monster.vx, monster.vy],
                'radius': radius,
                'gsensor': gsensor,
            };

            if( state==='' && Agent[now.mode] ) {
                var force = Agent[now.mode](pack.monsterPos, pack.monsterSpeed, pack.heroPos, pack.heroSpeed, pack.radius);
                now.game.applyForceToMonster(force);
            }

            now.game.next();

            if( now.game.checkUpdated() ) {
                session.publish('server.'+roomName, [], pack);
                console.log(roomName, JSON.stringify(pack));
            }
            else {
                console.log(roomName, pack.state);
            }
        });

        setTimeout(judge, config.interval);
    }
    judge();
};

connection.onclose = function (reason, details) {
   // connection closed, lost or unable to connect
   console.log('Connection was closed due to:', reason);
};



console.log('Connecting to server...');
connection.open();
