// Include dependency
var config = require('./config.js');
var Connector = require('./connector');
var Agent = require('./agent.js');
var GameProto = require('./game.js');
var keyboard = require('./keyboard.js');

// Shared variable
window.game = new GameProto();



// Coculate game term
function termCoculation() {
    /*
    game.applyForceToHero(Connector.getHeroAction());
    if( agent )
        game.applyForceToMonster(agent(monsterPos, monsterSpeed, heroPos, heroSpeed, radius))
    else
        game.applyForceToMonster(Connector.getMonsterAction());
    */

    var f = [0, 0];
    if( keyboard.d ) f[0] += 300;
    if( keyboard.a ) f[0] -= 300;
    if( keyboard.s ) f[1] += 300;
    if( keyboard.w ) f[1] -= 300;
    if( keyboard.space ) f[0] *= 3, f[1] *= 3;
    window.game.applyForce(f, 0);
    f = [0, 0];
    if( keyboard.right ) f[0] += 300;
    if( keyboard.left ) f[0] -= 300;
    if( keyboard.down ) f[1] += 300;
    if( keyboard.up ) f[1] -= 300;
    if( keyboard.enter ) f[0] *= 3, f[1] *= 3;
    window.game.applyForce(f, 2);
    window.game.next();

    /*
    var stateChange = game.state !== state;
    state = game.state;
    heroPos = [game.hero.x, game.hero.y];
    heroSpeed = [game.hero.vx, game.hero.vy];
    monsterPos = [game.monster.x, game.monster.y];
    monsterSpeed = [game.monster.vx, game.monster.vy];
    radius = game.radius;

    if( game.state === '' || stateChange )
        Connector.publishState({
            'state': game.state,
            'heroPos': heroPos,
            'heroSpeed': heroSpeed,
            'monsterPos': monsterPos,
            'monsterSpeed': monsterSpeed,
            'radius': radius,
        });
    */
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

    /*
    if( !Connector.isConnect() )
        gamePanel.show('Connection closed');
    else if( lastState!==game.state ) {
        lastState = game.state;
        if( game.state === '' )
            gamePanel.hide();
        else if( game.state === 'win' )
            gamePanel.show('Hero is winner!!!');
        else if( game.state === 'lose' )
            gamePanel.show('Hero is loser...');
        else
            gamePanel.show(game.state);
    }
    */

    // next
    requestAnimationFrame(frameCoculation);
}
requestAnimationFrame(frameCoculation);
