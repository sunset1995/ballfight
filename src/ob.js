// Include dependency
var gameResult = require('./ui/game-result.js');
var config = require('./config.js');
var autobahn = require('autobahn');
var session = null;

window.game = {
    radius: config.radiusInit,
    players: [
        {x: 0, y: 0},
        {x: 0, y: 0},
        {x: 0, y: 0},
        {x: 0, y: 0},
    ],
    state: '',
}

// DOM
$('#connect').click(function() {
    $('#connect-panel')[0].style.display = 'none';

    var connection = new autobahn.Connection({
        url: $('#url').val(),
        realm: 'ballfight',
    });
    var roomname = $('#room').val();

    var heartbeater = setInterval(function() {
        if( session )
            session.publish('heartbeat', [], {});
    }, 5000);

    connection.onclose = function (reason, details) {
       // connection closed, lost or unable to connect
       console.log('Connection was closed due to:', reason);
       console.log('connection closed');
       clearInterval(heartbeater);
    };


    connection.onopen = function (ses) {
        console.log('Connection success');
        session = ses;

        function stateChangeHandler(args, kwargs, details) {
            window.game = kwargs;
        }
        session.subscribe(roomname+'.arena.ob', stateChangeHandler);
    };


    console.log('Connecting to server...');
    connection.open();
});



// Coculate what to display on each frames
// Below code has no logic about game
// Just simply read info from game engine and paint it
var arenaDOM = $('#arena')[0];
var playersDOM = [$('#p0')[0], $('#p1')[0], $('#p2')[0], $('#p3')[0]];
var stateDOM = $('#state')[0];
var lastState = null;

function frameCoculation() {
    // read
    var arena = window.game.radius;
    var oX = document.body.getBoundingClientRect().width / 2;
    var oY = document.body.getBoundingClientRect().height / 2;
    var pX = [];
    var pY = [];
    for(var i=0; i<4; ++i) {
        pX.push(oX + window.game.players[i].x);
        pY.push(oY + window.game.players[i].y);
    }

    // write
    arenaDOM.style.width = (2*window.game.radius) + 'px';
    arenaDOM.style.height = (2*window.game.radius) + 'px';
    for(var i=0; i<4; ++i) {
        playersDOM[i].style.transform = 'translate('+pX[i]+'px, '+pY[i]+'px)';
        playersDOM[i].style.transform = 'translate3d('+pX[i]+'px, '+pY[i]+'px, 0)';
    }

    stateDOM.textContent = window.game.state;

    // Each time state change check UI
    if( lastState !== window.game.state ) {
        lastState = window.game.state;
        if( window.game.state === 'Blue win' )
            document.body.style.backgroundColor = '#dcfffe';
        else if( window.game.state === 'Red win' )
            document.body.style.backgroundColor = '#ffbbb6';
    }

    // next
    requestAnimationFrame(frameCoculation);
}
requestAnimationFrame(frameCoculation);
