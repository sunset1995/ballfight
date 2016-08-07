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

function rusher(myPos, mySpeed, enemyPos, enemySpeed, radius) {
    var f = [enemyPos[0]-myPos[0], enemyPos[1]-myPos[1]];
    var fLen = Math.sqrt(f[0]*f[0] + f[1]*f[1]);
    if( Math.abs(fLen) < 1 )
        return f;
    f[0] /= fLen;
    f[1] /= fLen;
    var disEnemy = fLen;
    var disGG = radius - Math.sqrt(myPos[0]*myPos[0] + myPos[1]*myPos[1]);
    if(disGG < 50) {
        f[0] *= 1000;
        f[1] *= 1000;
    }
    else if(disEnemy < 150) {
        f[0] *= 500;
        f[1] *= 500;
    }
    else {
        f[0] *= 200;
        f[1] *= 200;
    }
    return f;
}

function centerCamper(myPos, mySpeed, enemyPos, enemySpeed, radius) {
    var f = [-myPos[0], -myPos[1]];
    fLen = Math.sqrt(f[0]*f[0] + f[1]*f[1]);
    f[0] = f[0]*500/fLen - mySpeed[0] + Math.random()*50 - 25;
    f[1] = f[1]*500/fLen - mySpeed[1] + Math.random()*50 - 25;
    return f;
}



module.exports = {
    'loser': loser,
    'softer': softer,
    'rusher': rusher,
    'centerCamper': centerCamper,
};
