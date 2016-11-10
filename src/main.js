// Include dependency
var selectionPanel = require('./ui/selectionPanel.js');
var gameResult = require('./ui/game-result.js');
var config = require('./config.js');
var Connector = require('./connector');
var Agent = require('./agent.js');
var GameProto = require('./game.js');
var keyboard = require('./keyboard.js');

// Shared variable
window.game = new GameProto();
window.gameResult = gameResult;



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
