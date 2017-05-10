const keyboard = require('./keyboard.js');

function dis(a, b) {
    return Math.hypot(a.x-b.x, a.y-b.y);
}

function disO(a) {
    return Math.hypot(a.x, a.y);
}

module.exports = {};
module.exports[''] = function(me, friend, enemy1, enemy2, radius) {
    return [0, 0];
}

module.exports['Loser'] = function(me, friend, enemy1, enemy2, radius) {
    let myPos = [me.x, me.y];
    let f = [-myPos[0], -myPos[1]];
    let fLen = Math.hypot(f[0], f[1]);
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
    
    let myPos = [me.x, me.y];
    let mySpeed = [me.vx, me.vy];
    let enemyPos = [enemy1.x, enemy1.y];
    let enemySpeed = [enemy1.vx, enemy1.vy];
    if( dis(enemy1, me) > dis(enemy2, me) ) {
        enemyPos = [enemy2.x, enemy2.y];
        enemySpeed = [enemy2.vx, enemy2.vy];
    }
    let p = [-myPos[0], -myPos[1]];
    let pLen = Math.sqrt(p[0]*p[0] + p[1]*p[1]);
    if( Math.abs(pLen) < 1 )
        return [0, 0];
    p[0] /= pLen;
    p[1] /= pLen;
    let f = [enemyPos[0]-myPos[0], enemyPos[1]-myPos[1]];

    if( radius - 60 < pLen ) {
        let va = f;
        let vb = myPos;
        let la = Math.sqrt(va[0]*va[0] + va[1]*va[1]);
        let lb = Math.sqrt(vb[0]*vb[0] + vb[1]*vb[1]);
        let dot = va[0]*vb[0] + va[1]*vb[1];
        if( Math.abs(la)<1 || Math.abs(lb)<1 )
            return [p[0]*10000, p[1]*10000];
        let theta = Math.acos(dot/(la*lb));
        if( theta < Math.PI * 25 / 180 )
            return [f[0]*10000, f[1]*10000];
        else
            return [p[0]*10000, p[1]*10000];
    }

    let coll = false;
    let x = enemyPos[0];
    let y = enemyPos[1];
    let dx = enemySpeed[0] * 0.025;
    let dy = enemySpeed[1] * 0.025;
    for(let i=0; i<13; ++i) {
        let disx = x - myPos[0];
        let disy = y - myPos[1];
        if( Math.sqrt(disx*disx + disy*disy) < 55 ) {
            coll = true;
            break;
        }
        x += dx;
        y += dy;
    }
    
    if( coll ) {
        if( f[1]*myPos[0] - f[0]*myPos[1] < 0 )
            return [f[1]*10000, -f[0]*10000];
        else
            return [-f[1]*10000, f[0]*10000];
    }
    else
        return [-mySpeed[0]*10, -mySpeed[1]*10];

}

module.exports['__debug_agent__'] = (function(me, friend, enemy1, enemy2, radius) { return [100, 100]; });

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
