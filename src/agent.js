var keyboard = require('./keyboard.js');

function dis(a, b) {
    var dx = a.x-b.x;
    var dy = a.y-b.y;
    return Math.sqrt(dx*dx + dy*dy);
}

module.exports = {};
module.exports[''] = function(me, friend, enemy1, enemy2, radius) {
    return [0, 0];
}

module.exports['Loser'] = function(me, friend, enemy1, enemy2, radius) {
    var myPos = [me.x, me.y];
    var f = [-myPos[0], -myPos[1]];
    var fLen = Math.sqrt(f[0]*f[0] + f[1]*f[1]);
    if( Math.abs(fLen) < 1 )
        return f;
    f[0] = f[0]*100/fLen - myPos[0];
    f[1] = f[1]*100/fLen - myPos[1];
    return f;
}

module.exports['Softer'] = function(me, friend, enemy1, enemy2, radius) {
    var myPos = [me.x, me.y];
    var enemyPos = [(enemy1.x+enemy2.x)/2, (enemy1.y+enemy2.y)/2];
    var enemySpeed = [(enemy1.vx+enemy2.vx)/2, (enemy1.vy+enemy2.vy)/2];
    var f = [enemyPos[0]-myPos[0], enemyPos[1]-myPos[1]];
    var fLen = Math.sqrt(f[0]*f[0] + f[1]*f[1]);
    if( Math.abs(fLen) < 1 )
        return f;
    f[0] /= fLen*0.022;
    f[1] /= fLen*0.022;
    f[0] += -enemySpeed[0] + Math.random()*50 - 25;
    f[1] += -enemySpeed[1] + Math.random()*50 - 25;
    return f;
}

module.exports['Brownian'] = function(me, friend, enemy1, enemy2, radius) {
    var myPos = [me.x, me.y];
    if( myPos[0]*myPos[0] + myPos[1]*myPos[1] > (radius-25)*(radius-25))
        return [-myPos[0]*1000, -myPos[1]*1000];

    var theta = Math.random()*2*Math.PI;
    return [1000*Math.cos(theta), 1000*Math.sin(theta)];
}

module.exports['Basaker'] = function(me, friend, enemy1, enemy2, radius) {
    var myPos = [me.x, me.y];
    var enemyPos = [enemy1.x, enemy1.y];
    if( dis(enemy1, me) > dis(enemy2, me) )
        enemyPos = [enemy2.x, enemy2.y];
    var f = [enemyPos[0]-myPos[0], enemyPos[1]-myPos[1]];
    var fLen = Math.sqrt(f[0]*f[0] + f[1]*f[1]);
    if( Math.abs(fLen) < 1 )
        return f;
    f[0] /= fLen;
    f[1] /= fLen;
    var disEnemy = fLen;
    var disGG = radius - Math.sqrt(myPos[0]*myPos[0] + myPos[1]*myPos[1]);
    if(disGG < 100) {
        f[0] *= 1000;
        f[1] *= 1000;
    }
    else if(disEnemy < 200) {
        f[0] *= 500;
        f[1] *= 500;
    }
    else {
        f[0] *= 200;
        f[1] *= 200;
    }
    f[0] += Math.random()*100 - 50
    return f;
}

module.exports['Escaper'] = function(me, friend, enemy1, enemy2, radius) {
    var myPos = [me.x, me.y];
    var mySpeed = [me.vx, me.vy];
    var enemyPos = [enemy1.x, enemy1.y];
    var enemySpeed = [enemy1.vx, enemy1.vy];
    if( dis(enemy1, me) > dis(enemy2, me) ) {
        enemyPos = [enemy2.x, enemy2.y];
        enemySpeed = [enemy2.vx, enemy2.vy];
    }
    var p = [-myPos[0], -myPos[1]];
    var pLen = Math.sqrt(p[0]*p[0] + p[1]*p[1]);
    if( Math.abs(pLen) < 1 )
        return [0, 0];
    p[0] /= pLen;
    p[1] /= pLen;
    var f = [enemyPos[0]-myPos[0], enemyPos[1]-myPos[1]];

    if( radius - 60 < pLen ) {
        var va = f;
        var vb = myPos;
        var la = Math.sqrt(va[0]*va[0] + va[1]*va[1]);
        var lb = Math.sqrt(vb[0]*vb[0] + vb[1]*vb[1]);
        var dot = va[0]*vb[0] + va[1]*vb[1];
        if( Math.abs(la)<1 || Math.abs(lb)<1 )
            return [p[0]*10000, p[1]*10000];
        var theta = Math.acos(dot/(la*lb));
        if( theta < Math.PI * 25 / 180 )
            return [f[0]*10000, f[1]*10000];
        else
            return [p[0]*10000, p[1]*10000];
    }

    var coll = false;
    var x = enemyPos[0];
    var y = enemyPos[1];
    var dx = enemySpeed[0] * 0.025;
    var dy = enemySpeed[1] * 0.025;
    for(var i=0; i<13; ++i) {
        var disx = x - myPos[0];
        var disy = y - myPos[1];
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

module.exports['Center Camper'] = function(me, friend, enemy1, enemy2, radius) {
    var myPos = [me.x, me.y];
    var f = [-myPos[0], -myPos[1]];
    f[0] = f[0]*100000;
    f[1] = f[1]*100000;
    return f;
}

module.exports['WASD space'] = function(me, friend, enemy1, enemy2, radius) {
    var f = [0, 0];
    if( keyboard.d ) f[0] += 300;
    if( keyboard.a ) f[0] -= 300;
    if( keyboard.s ) f[1] += 300;
    if( keyboard.w ) f[1] -= 300;
    if( keyboard.space ) f[0] *= 3, f[1] *= 3;
    return f;
}

module.exports['↑←↓→ enter'] = function(me, friend, enemy1, enemy2, radius) {
    var f = [0, 0];
    if( keyboard.right ) f[0] += 300;
    if( keyboard.left ) f[0] -= 300;
    if( keyboard.down ) f[1] += 300;
    if( keyboard.up ) f[1] -= 300;
    if( keyboard.enter ) f[0] *= 3, f[1] *= 3;
    return f;
}
