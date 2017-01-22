const config = require('./config.js');


// Define self used function
function floorEPS(lf) {
    return Math.round(lf*10) / 10;
}
function dot(v1, v2) {
    return v1[0]*v2[0] + v1[1]*v2[1];
}
function vectorLength(v) {
    return Math.sqrt(dot(v, v));
}
function friction(v, k) {
    k = k || 0;
    return [-v[0]*k, -v[1]*k];
}
function applyNoise(f) {
    let flen = Math.sqrt(dot(f, f));
    let rad = Math.atan2(f[1], f[0]) + Math.random() * Math.PI / 3 - Math.PI / 6;
    f[0] = flen * Math.cos(rad);
    f[1] = flen * Math.sin(rad);
}



// Define ball class
const Ball = function(initValue) {
    this.init(initValue || {});
};

Ball.prototype.init = function(initValue) {
    initValue = initValue || {};
    this.x = initValue.x || 0;
    this.y = initValue.y || 0;
    this.vx = initValue.vx || 0;
    this.vy = initValue.vy || 0;
    this.ax = initValue.ax || 0;
    this.ay = initValue.ay || 0;
    this.fx = initValue.fx || 0;
    this.fy = initValue.fy || 0;
    this.k = 1;
};

Ball.prototype.stop = function() {
    this.fx = 0;
    this.fy = 0;
    this.k = 2;
}

Ball.prototype.applyForce = function(force) {
    force[0] = force[0] || 0;
    force[1] = force[1] || 0;
    applyNoise(force);
    let len = vectorLength(force);
    let r = vectorLength([this.x, this.y]);
    if( len > config.maxForce(r) ) {
        force[0] *= config.maxForce(r) / len;
        force[1] *= config.maxForce(r) / len;
    }
    this.fx = floorEPS(force[0]) || 0;
    this.fy = floorEPS(force[1]) || 0;
};

Ball.prototype.next = function() {
    this.x += (this.vx + this.ax * config.unitTime / 2) * config.unitTime;
    this.y += (this.vy + this.ay * config.unitTime / 2) * config.unitTime;

    this.vx = this.vx + this.ax * config.unitTime;
    this.vy = this.vy + this.ay * config.unitTime;

    this.x = floorEPS(this.x);
    this.y = floorEPS(this.y);
    this.vx = floorEPS(this.vx);
    this.vy = floorEPS(this.vy);

    let fr = friction([this.vx, this.vy], this.k);
    this.ax = this.fx + fr[0];
    this.ay = this.fy + fr[1];
};

Ball.prototype.norm = function() {
    this.x = floorEPS(this.x);
    this.y = floorEPS(this.y);
    this.vx = floorEPS(this.vx);
    this.vy = floorEPS(this.vy);
    this.ax = floorEPS(this.ax);
    this.ay = floorEPS(this.ay);
};

Ball.prototype.isCollisionWith = function(other) {
    let X = this.x - other.x;
    let Y = this.y - other.y;
    return X*X + Y*Y <= config.ballRadius*config.ballRadius;
};

Ball.prototype.distanceWith = function(other) {
    return vectorLength([this.x-other.x, this.y-other.y]);
};

Ball.prototype.distanceWithOrigin = function() {
    return vectorLength([this.x, this.y]);
};

Ball.prototype.outOfRadius = function(R) {
    return this.distanceWithOrigin() > R + config.ballRadius/2;
}

Ball.prototype.procCollisionWith = function(other) {
    let base = [this.x-other.x, this.y-other.y];
    let p = vectorLength(base);
    if( Math.abs(p) < 1 )
        return;
    base[0] /= p;
    base[1] /= p;
    let pA = dot([this.vx, this.vy], base);
    let pB = dot([other.vx, other.vy], base);
    let copA = [base[0]*pA, base[1]*pA];
    let copB = [base[0]*pB, base[1]*pB];
    this.vx += -copA[0] + copB[0];
    this.vy += -copA[1] + copB[1];
    other.vx += -copB[0] + copA[0];
    other.vy += -copB[1] + copA[1];

    if( this.distanceWith(other) < 50 ) {
        let mid = [(this.x+other.x)/2, (this.y+other.y)/2];
        base[0] *= 25;
        base[1] *= 25;
        this.x = mid[0] + base[0];
        this.y = mid[1] + base[1];
        other.x = mid[0] - base[0];
        other.y = mid[1] - base[1];
    }
};



// Export
module.exports = Ball;
