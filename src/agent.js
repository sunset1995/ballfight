function loser(myPos, mySpeed, enemyPos, enemySpeed, radius) {
    var f = [-myPos[0], -myPos[1]];
    var fLen = Math.sqrt(f[0]*f[0] + f[1]*f[1]);
    if( Math.abs(fLen) < 1 )
        return f;
    f[0] = f[0]*100/fLen - myPos[0];
    f[1] = f[1]*100/fLen - myPos[1];
    return f;
}

function softer(myPos, mySpeed, enemyPos, enemySpeed, radius) {
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

function brownian(myPos, mySpeed, enemyPos, enemySpeed, radius) {
    if( myPos[0]*myPos[0] + myPos[1]*myPos[1] > (radius-25)*(radius-25))
        return [-myPos[0]*1000, -myPos[1]*1000];

    var theta = Math.random()*2*Math.PI;
    return [1000*Math.cos(theta), 1000*Math.sin(theta)];
}

function rusher(myPos, mySpeed, enemyPos, enemySpeed, radius) {
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

function escaper(myPos, mySpeed, enemyPos, enemySpeed, radius) {
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

function centerCamper(myPos, mySpeed, enemyPos, enemySpeed, radius) {
    var f = [-myPos[0], -myPos[1]];
    var fLen = Math.sqrt(f[0]*f[0] + f[1]*f[1]) + 0.01;
    f[0] = f[0]*1000/fLen + Math.random()*10 - 20;
    f[1] = f[1]*1000/fLen + Math.random()*10 - 20;
    return f;
}



module.exports = {
    'loser': loser,
    'softer': softer,
    'brownian': brownian,
    'rusher': rusher,
    'escaper': escaper,
    'centerCamper': centerCamper,
};
