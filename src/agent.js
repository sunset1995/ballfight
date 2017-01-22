const keyboard = require('./keyboard.js');

function dis(a, b) {
    let dx = a.x-b.x;
    let dy = a.y-b.y;
    return Math.sqrt(dx*dx + dy*dy);
}

function disO(a) {
    return Math.sqrt(a.x*a.x + a.y*a.y);
}

module.exports = {};
module.exports[''] = function(me, friend, enemy1, enemy2, radius) {
    return [0, 0];
}

module.exports['Loser'] = function(me, friend, enemy1, enemy2, radius) {
    let myPos = [me.x, me.y];
    let f = [-myPos[0], -myPos[1]];
    let fLen = Math.sqrt(f[0]*f[0] + f[1]*f[1]);
    if( Math.abs(fLen) < 1 )
        return f;
    f[0] = f[0]*100/fLen - myPos[0];
    f[1] = f[1]*100/fLen - myPos[1];
    return f;
}

module.exports['Softer'] = function(me, friend, enemy1, enemy2, radius) {
    let myPos = [me.x, me.y];
    let enemyPos = [(enemy1.x+enemy2.x)/2, (enemy1.y+enemy2.y)/2];
    let enemySpeed = [(enemy1.vx+enemy2.vx)/2, (enemy1.vy+enemy2.vy)/2];
    let f = [enemyPos[0]-myPos[0], enemyPos[1]-myPos[1]];
    let fLen = Math.sqrt(f[0]*f[0] + f[1]*f[1]);
    if( Math.abs(fLen) < 1 )
        return f;
    f[0] /= fLen*0.022;
    f[1] /= fLen*0.022;
    f[0] += -enemySpeed[0] + Math.random()*50 - 25;
    f[1] += -enemySpeed[1] + Math.random()*50 - 25;
    return f;
}

module.exports['Brownian'] = function(me, friend, enemy1, enemy2, radius) {
    let myPos = [me.x, me.y];
    if( myPos[0]*myPos[0] + myPos[1]*myPos[1] > (radius-25)*(radius-25))
        return [-myPos[0]*1000, -myPos[1]*1000];

    let theta = Math.random()*2*Math.PI;
    return [1000*Math.cos(theta), 1000*Math.sin(theta)];
}

module.exports['Berserker'] = function(me, friend, enemy1, enemy2, radius) {
    let myPos = [me.x, me.y];
    let enemyPos = [enemy1.x, enemy1.y];
    if( disO(enemy1)>radius || 
            disO(enemy2)<radius &&
            dis(enemy1, me) > dis(enemy2, me) )
        enemyPos = [enemy2.x, enemy2.y];
    let f = [enemyPos[0]-myPos[0], enemyPos[1]-myPos[1]];
    return [f[0]*100000, f[1]*100000];
}

module.exports['逃跑有用'] = function(me, friend, enemy1, enemy2, radius) {

    let meP = [me.x, me.y];
    let friendP = [friend.x, friend.y];
    let enemy1P = [enemy1.x, enemy1.y];
    let enemy2P = [enemy2.x, enemy2.y];
    let meV = [me.vx, me.vy];
    let friendV = [friend.vx, friend.vy];
    let enemy1V = [enemy1.vx, enemy1.vy];
    let enemy2V = [enemy2.vx, enemy2.vy];
    let headEnemy1 = [enemy1P[0]-meP[0], enemy1P[1]-meP[1]];
    let headEnemy2 = [enemy2P[0]-meP[0], enemy2P[1]-meP[1]];

    function dot(a, b) {
        return a[0]*b[0] + a[1]*b[1];
    }
    function cross(a, b) {
        return a[0]*b[1] - a[1]*b[0];
    }
    function len(a) {
        return Math.sqrt(dot(a, a));
    }
    function dis(a, b) {
        let dx = a[0] - b[0];
        let dy = a[1] - b[1];
        return Math.sqrt(dx*dx + dy*dy);
    }

    let features = [
        // Stop near edge & head edge
        {
            c: -10,
            f: (action) => {
                if( len(action) < 1e-3 ) return 0;
                if( len(meP) > radius - 75 )
                    return Math.pow(dot(meP, action), 3);
                else
                    return dot(meP, action);
            },
        },

        // Fight enemy while ok
        {
            c: 3,
            f: (action, show=false) => {
                if( len(action) < 1e-3 ) return 0;
                let ene, eneV;
                if( len(enemy1P) > radius + 25 ) {
                    ene = headEnemy2;
                    eneV = enemy2V;
                }
                else if( len(enemy2P) > radius + 25 ) {
                    ene = headEnemy1;
                    eneV = enemy2V;
                }
                else {
                    ene = len(headEnemy1) < len(headEnemy2) ? headEnemy1 : headEnemy2;
                    eneV = len(headEnemy1) < len(headEnemy2) ? enemy1V : enemy2V;
                }
                let towardEnemyP = dot(ene, action)/len(action)/len(ene);
                let towardEnemyV = len(eneV) ? dot(eneV, action)/len(action)/len(eneV) : 0;
                let towardEnemy = towardEnemyP + towardEnemyV;
                let pause = -dot(meV, action);
                if( show ) {
                    // console.log('=>', ene, eneV)
                    // console.log('=>', towardEnemyP, towardEnemyV)
                }
                if( (dot(ene, eneV) >= 0 || len(eneV) < 300) && towardEnemyP > 0 ) {
                    if( Math.acos(dot(meV, action)/len(meV)/len(action)) > Math.PI/3 )
                        return pause * Math.pow(dot(ene, eneV), 3);
                    return towardEnemy * Math.pow(dot(ene, eneV), 3);
                }
                else
                    return towardEnemy;
            },
        },

        // Escape while needed
        {
            c: 1,
            f: (action) => {
                if( len(action) < 1e-3 ) return 0;
                let ene = len(headEnemy1) < len(headEnemy2) ? headEnemy1 : headEnemy2;
                let eneV = len(headEnemy1) < len(headEnemy2) ? enemy1V : enemy2V;
                if( dot(ene, eneV) < 0 )
                    return Math.abs(cross(ene, action)) / len(ene) / len(action) * -Math.pow(dot(ene, eneV), 3);
                else
                    return Math.abs(cross(ene, action)) / len(ene) / len(action) * -dot(ene, eneV);
            },
        },
    ];

    function Qvalue(action, show=false) {
        let v = 0;
        for(let i=0; i<features.length; ++i) {
            let now = features[i].c * features[i].f(action, show);
            v += now;
            // if( show )
                // console.log(i, now)
        }
        return v;
    }

    let bestAction = [0, 0];
    let bestQV = Qvalue(bestAction);

    let nRad = 1000;
    for(let i=0; i<nRad; ++i) {
        let fx = 1000 * Math.cos(2*Math.PI*i/nRad);
        let fy = 1000 * Math.sin(2*Math.PI*i/nRad);
        let nowQV = Qvalue([fx, fy]);
        if( nowQV > bestQV ) {
            bestQV = nowQV;
            bestAction = [fx, fy];
        }
    }

    // console.log(Qvalue(bestAction, true), bestAction)
    // console.log('==================================')
    
    return bestAction;

}

module.exports['Center Camper'] = function(me, friend, enemy1, enemy2, radius) {
    let myPos = [me.x, me.y];
    let f = [-myPos[0], -myPos[1]];
    f[0] = f[0]*100000;
    f[1] = f[1]*100000;
    return f;
}

module.exports['WASD space'] = function(me, friend, enemy1, enemy2, radius) {
    let f = [0, 0];
    if( keyboard.d ) f[0] += 300;
    if( keyboard.a ) f[0] -= 300;
    if( keyboard.s ) f[1] += 300;
    if( keyboard.w ) f[1] -= 300;
    if( keyboard.space ) f[0] *= 3, f[1] *= 3;
    return f;
}

module.exports['↑←↓→ enter'] = function(me, friend, enemy1, enemy2, radius) {
    let f = [0, 0];
    if( keyboard.right ) f[0] += 300;
    if( keyboard.left ) f[0] -= 300;
    if( keyboard.down ) f[1] += 300;
    if( keyboard.up ) f[1] -= 300;
    if( keyboard.enter ) f[0] *= 3, f[1] *= 3;
    return f;
}
