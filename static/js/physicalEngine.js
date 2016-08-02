(function() {




// Constant
var terminalSpeed = 500;

// Define self used function
function floorEPS(lf) {
	return Math.floor(lf*1000) / 1000;
}
function dot(v1, v2) {
	return v1[0]*v2[0] + v1[1]*v2[1];
}
function vectorLength(v) {
	return Math.sqrt(dot(v, v));
}
function friction(v, k) {
	k = k || 1;
	return [-v[0]*k, -v[1]*k];
}
function init(ball, initValue) {
	initValue = initValue || {};
	ball.m = initValue.m || 1;
	ball.x = initValue.x || 0;
	ball.y = initValue.y || 0;
	ball.vx = initValue.vx || 0;
	ball.vy = initValue.vy || 0;
	ball.ax = initValue.ax || 0;
	ball.ay = initValue.ay || 0;
	ball.fx = initValue.fx || 0;
	ball.fy = initValue.fy || 0;
	ball.k = 1;
	
	ball.lastTimestamp = null;
	ball.playing = false;
}

// Define physical class
var Ball = function() {
	init(this, {});

	var that = this;
	function next(timestamp) {
		if( that.lastTimestamp === null )
			that.lastTimestamp = timestamp;
		var timeElapse = (timestamp - that.lastTimestamp) / 1000;
		that.lastTimestamp = timestamp;
		that.x += (that.vx + that.ax * timeElapse / 2) * timeElapse;
		that.y += (that.vy + that.ay * timeElapse / 2) * timeElapse;

		that.vx = that.vx + that.ax * timeElapse;
		that.vy = that.vy + that.ay * timeElapse;
		var len = vectorLength([that.vx, that.vy]);
		if( len > that.terminalSpeed ) {
			that.vx = that.vx * that.terminalSpeed / len;
			that.vy = that.vy * that.terminalSpeed / len;
		}

		var fr = friction([that.vx, that.vy], that.k);
		that.ax = (that.fx + fr[0]) / that.m;
		that.ay = (that.fy + fr[1]) / that.m;

		that.x = floorEPS(that.x);
		that.y = floorEPS(that.y);
		that.vx = floorEPS(that.vx);
		that.vy = floorEPS(that.vy);
		that.ax = floorEPS(that.ax);
		that.ay = floorEPS(that.ay);

		requestAnimationFrame(next);
	}
	requestAnimationFrame(next);
}
Ball.prototype.terminalSpeed = terminalSpeed;
Ball.prototype.maxForce = 5000;
Ball.prototype.applyForce = function(force) {
	if( !this.playing )
		return;
	var len = vectorLength(force);
	if( len > this.maxForce ) {
		force[0] *= this.maxForce / len;
		force[1] *= this.maxForce / len;
	}
	this.fx = force[0];
	this.fy = force[1];
}
Ball.prototype.start = function(initValue) {
	init(this, initValue);
	this.playing = true;
	this.k = 1;
}
Ball.prototype.stop = function() {
	this.playing = false;
	this.fx = this.fy = 0;
	this.k = 5;
}
Ball.prototype.getF = function() {
	return [this.fx, this.fy];
}

function BallCollision(A, B) {
	var base = [A.x-B.x, A.y-B.y];
	var p = vectorLength(base);
	base[0] /= p;
	base[1] /= p;
	var pA = dot([A.vx, A.vy], base);
	var pB = dot([B.vx, B.vy], base);
	var copA = [base[0]*pA, base[1]*pA];
	var copB = [base[0]*pB, base[1]*pB];
	A.vx += -copA[0] + copB[0];
	A.vy += -copA[1] + copB[1];
	B.vx += -copB[0] + copA[0];
	B.vy += -copB[1] + copA[1];
}

function BallDistance(A, B) {
	return vectorLength([A.x-B.x, A.y-B.y]);
}

window.Ball = Ball;
window.BallCollision = BallCollision;
window.BallDistance = BallDistance;




})();
