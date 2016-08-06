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


    // Handle action in one room
    function actionHandler(args, kwargs, details) {
        console.log("Action ", args, kwargs, details);

        var roomName = details.topic;
        var action = args[0];
        var data = args[1];
        if( action === 'start' ) {
            room[roomName].game.start();
            room[roomName].mode = data;
        }
        else if( action === 'hero' )
            room[roomName].game.applyForceToHero(data);
        else if( action === 'monster' )
            room[roomName].game.applyForceToMonster(data);
        else if( action === 'gsensor' && typeof data === 'object' )
            room[roomName].gsensor = [data[0] || 0, data[1] || 0];

        room[roomName].timestamp = Date.now();
    }


    // Handle join room request
    // Create one if not room not yet exited
    // No delete room machanic now
    function joinRoomHandler(args, kwargs, details) {
        console.log("Join Room ", args, kwargs, details);

        var roomName = args[0];
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
    }


    // Listen for joinRoom
    session.subscribe('joinRoom', joinRoomHandler);


    // Process each room
    function judge() {
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

            if( now.game.checkUpdated() )
                session.publish('server.'+roomName, [], pack);
        });

        setTimeout(judge, config.interval);
    }
    judge();
};

autobahn.Connection.onclose = function (reason, details) {
   // connection closed, lost or unable to connect
   console.log(reason)
   console.log(details)
};



connection.open();
