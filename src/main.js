// Include dependency
const selectionPanel = require('./ui/selectionPanel.js');
const gameResult = require('./ui/game-result.js');
const config = require('./config.js');
const keyboard = require('./keyboard.js');
const Connector = require('./connector');
const Agent = require('./agent.js');
const GameProto = require('./game.js');

// Shared variable
window.game = new GameProto();



// Coculate game term
const debugMode = $('#debug-mode input')[0];
let keypressCnt = 0;
let keypressLast = false;
function termCoculation() {

    let go = true;
    if( debugMode.checked ) {
        if( !keyboard.space || (keypressLast!=false && keypressCnt<=5) )
            go = false;
        if( keyboard.space ) ++keypressCnt;
        else keypressCnt = 0;
        keypressLast = keyboard.space;
    }
    if( !go ) return;

    let players = []
    for(let i=0; i<4; ++i)
        players.push({
            x: window.game.players[i].x,
            y: window.game.players[i].y,
            vx: window.game.players[i].vx,
            vy: window.game.players[i].vy,
            say: window.game.players[i].say || '',
        });


    for(let i=0; i<4; ++i) {
        if( !selectionPanel.players[i] )
            continue;
        try {
            let agentInfo = selectionPanel.players[i];
            let force = [0, 0];
            if( agentInfo.type === 'local-agent' ) {
                let me = players[i];
                let friend = players[2*Math.floor(i/2) + (i%2 ^ 1)];
                let enemy1 = players[2*(Math.floor(i/2) ^ 1)];
                let enemy2 = players[2*(Math.floor(i/2) ^ 1) + 1];
                let radius = window.game.radius;
                force = Agent[agentInfo.name](me, friend, enemy1, enemy2, radius);
            }
            else {
                force = Connector.getForce(agentInfo.name);
                if( i==1 )
                    force[0] *= -1;
                else if( i==2 ) {
                    force[0] *= -1;
                    force[1] *= -1;
                }
                else if( i==3 )
                    force[1] *= -1;
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


    Connector.publishState('ob', {
        state: window.game.state,
        players: [
            {x: players[0].x, y: players[0].y},
            {x: players[1].x, y: players[1].y},
            {x: players[2].x, y: players[2].y},
            {x: players[3].x, y: players[3].y},
        ],
        radius: window.game.radius,
    });
    for(let i=0; i<4; ++i) {
        let agentInfo = selectionPanel.players[i];
        if( !agentInfo ) continue;
        if( agentInfo.type === 'remote-agent' ) {
            let state = window.game.state;
            let plist = players;
            if( i==1 )
                plist = deepcopyAndFlipYaxis(plist);
            else if( i==2 ) {
                plist = deepcopyAndFlipYaxis(plist);
                plist = deepcopyAndFlipXaxis(plist);
            }
            else if( i==3 )
                plist = deepcopyAndFlipXaxis(plist);
            let me = plist[i];
            let friend = plist[2*Math.floor(i/2) + (i%2 ^ 1)];
            let enemy1 = plist[2*(Math.floor(i/2) ^ 1)];
            let enemy2 = plist[2*(Math.floor(i/2) ^ 1) + 1];
            let radius = window.game.radius;
            Connector.publishState(agentInfo.name, {
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

// Helper function
function deepcopyAndFlipXaxis(plist) {
    let st = JSON.parse(JSON.stringify(plist));
    for(let i=0; i<4; ++i) {
        st[i].y *= -1;
        st[i].vy *= -1;
    }
    return st;
}
function deepcopyAndFlipYaxis(plist) {
    let st = JSON.parse(JSON.stringify(plist));
    for(let i=0; i<4; ++i) {
        st[i].x *= -1;
        st[i].vx *= -1;
    }
    return st;
}


// Coculate what to display on each frames
// Below code has no logic about game
// Just simply read info from game engine and paint it
const arenaDOM = $('#arena')[0];
const playersDOM = [$('#p0')[0], $('#p1')[0], $('#p2')[0], $('#p3')[0]];
const stateDOM = $('#state')[0];
let lastState = null;

function frameCoculation() {
    // read
    let arena = arenaDOM.getBoundingClientRect();
    let oX = document.body.getBoundingClientRect().width / 2;
    let oY = document.body.getBoundingClientRect().height / 2;
    let pX = [];
    let pY = [];
    for(let i=0; i<4; ++i) {
        pX.push(oX + window.game.players[i].x);
        pY.push(oY + window.game.players[i].y);
    }

    // write
    arenaDOM.style.width = (2*window.game.radius) + 'px';
    arenaDOM.style.height = (2*window.game.radius) + 'px';
    for(let i=0; i<4; ++i) {
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
