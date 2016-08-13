// Include dependency
var config = require('./config.js');
var Connector = require('./connector');
var Agent = require('./agent.js');
var GameProto = require('./game.js');

// Shared variable
var game = new GameProto();
var agent = null;
var state = 'init';
var heroPos = [config.heroInit.x, config.heroInit.y];
var heroSpeed = [config.heroInit.vx, config.heroInit.vy];
var monsterPos = [config.monsterInit.x, config.monsterInit.y];
var monsterSpeed = [config.monsterInit.vx, config.monsterInit.vy];
var radius = config.radiusInit;


// Useful function
function startGame(mode) {
    game.init();
    if( mode==='PVP' )
        agent = null;
    else if( Agent[mode] )
        agent = Agent[mode];
}


// Game panel
var gamePanel = (function() {
    var feedbackBlock = $('#game-panel')[0];
    var feedback = $('#game-panel > strong')[0];

    // Binding
    $('#fight-trigger > button').click(function() {
        var mode = $(this).attr('id').slice(4);
        console.log('start with mode', mode);
        startGame(mode);
    });


    return {
        'show': function(str) {
            feedback.innerHTML = str;
            feedbackBlock.style.display = 'block';
        },
        'hide': function() {
            feedbackBlock.style.display = 'none';
        },
    }
})();


// Coculate game term
function termCoculation() {
    game.applyForceToHero(Connector.getHeroAction());
    if( agent )
        game.applyForceToMonster(agent(monsterPos, monsterSpeed, heroPos, heroSpeed, radius))
    else
        game.applyForceToMonster(Connector.getMonsterAction());

    game.next();
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
}
setInterval(termCoculation, config.interval);


// Coculate what to display on each frames
var arenaDOM = $('#arena')[0];
var heroDOM = $('#hero')[0];
var monsterDOM = $('#monster')[0];
var lastState = null;

function frameCoculation() {
    // read
    var arena = arenaDOM.getBoundingClientRect();
    var oX = document.body.getBoundingClientRect().width / 2;
    var oY = document.body.getBoundingClientRect().height / 2;
    var hX = oX + heroPos[0];
    var hY = oY + heroPos[1];
    var mX = oX + monsterPos[0];
    var mY = oY + monsterPos[1];

    // write
    arenaDOM.style.width = (2*radius) + 'px';
    arenaDOM.style.height = (2*radius) + 'px';
    heroDOM.style.transform = 'translate('+hX+'px, '+hY+'px)';
    heroDOM.style.transform = 'translate3d('+hX+'px, '+hY+'px, 0)';
    monsterDOM.style.transform = 'translate('+mX+'px, '+mY+'px)';
    monsterDOM.style.transform = 'translate3d('+mX+'px, '+mY+'px, 0)';
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

    // next
    requestAnimationFrame(frameCoculation);
}
requestAnimationFrame(frameCoculation);
