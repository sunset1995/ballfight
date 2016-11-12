// Include dependency
var selectionPanel = require('./ui/selectionPanel.js');
var gameResult = require('./ui/game-result.js');
var config = require('./config.js');
var Connector = require('./connector');
var Agent = require('./agent.js');
var GameProto = require('./game.js');

// Shared variable
window.game = new GameProto();



// Coculate game term
function termCoculation() {

    var players = []
    for(var i=0; i<4; ++i)
        players.push({
            x: window.game.players[i].x,
            y: window.game.players[i].y,
            vx: window.game.players[i].vx,
            vy: window.game.players[i].vy,
            say: window.game.players[i].say,
        });


    for(var i=0; i<4; ++i) {
        if( !selectionPanel.players[i] )
            continue;
        try {
            var agentInfo = selectionPanel.players[i];
            var force = [0, 0];
            if( agentInfo.type === 'local-agent' ) {
                var me = players[i];
                var friend = players[2*Math.floor(i/2) + (i%2 ^ 1)];
                var enemy1 = players[2*(Math.floor(i/2) ^ 1)];
                var enemy2 = players[2*(Math.floor(i/2) ^ 1) + 1];
                var radius = window.game.radius;
                force = Agent[agentInfo.name](me, friend, enemy1, enemy2, radius);
            }
            else {
                force = Connector.getForce(agentInfo.name);
                window.game.players[i].say = Connector.getSay(agentInfo.name);
            }
            game.applyForce(force, i);
        }
        catch(err) {
            console.error('Agent error', err);
        }
    }


    // Next term
    window.game.next();


    for(var i=0; i<4; ++i) {
        var agentInfo = selectionPanel.players[i];
        if( !agentInfo ) continue;
        if( agentInfo.type === 'remote-agent' ) {
            var state = window.game.state;
            var me = players[i];
            var friend = players[2*Math.floor(i/2) + (i%2 ^ 1)];
            var enemy1 = players[2*(Math.floor(i/2) ^ 1)];
            var enemy2 = players[2*(Math.floor(i/2) ^ 1) + 1];
            var radius = window.game.radius;
            Connector.publishState({
                state: state,
                me: me,
                friend: friend,
                enemy1: enemy1,
                enemy2: enemy2,
                radius: radius,
            });
        }
    }
}
setInterval(termCoculation, config.interval);


// Coculate what to display on each frames
var arenaDOM = $('#arena')[0];
var playersDOM = [$('#p0')[0], $('#p1')[0], $('#p2')[0], $('#p3')[0]];
var stateDOM = $('#state')[0];
var lastState = null;

function frameCoculation() {
    // read
    var arena = arenaDOM.getBoundingClientRect();
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
        if( window.game.state === 'Playing' )
            selectionPanel.hide();
        else if( window.game.state === 'Blue win' ) {
            gameResult.show('Blue win!!!', '#3DD2CC');
            document.body.style.backgroundColor = '#dcfffe';
        }
        else if( window.game.state === 'Red win' ) {
            gameResult.show('Red win!!!', '#E84A5F');
            document.body.style.backgroundColor = '#ffbbb6';
        }
    }

    // next
    requestAnimationFrame(frameCoculation);
}
requestAnimationFrame(frameCoculation);
