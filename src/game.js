var config = require('./config.js');
var Ball = require('./ball.js');



// Define game class
var Game = function() {
    this.hero = new Ball();
    this.monster = new Ball();
    this.init();
    this.state = 'Let start!';
};

Game.prototype.init = function() {
    if( this.state === '' )
        return;
    this.hero.init(config.heroInit);
    this.monster.init(config.monsterInit);
    this.radius = config.radiusInit;
    this.state = '';
};

Game.prototype.next = function() {
    if( this.state !== '' ) {
        this.hero.fx = this.hero.fy = 0;
        this.monster.fx = this.monster.fy = 0;
        this.hero.k = this.monster.k = 1;
    }
    this.hero.next();
    this.monster.next();

    // Detect collision
    if( this.hero.distanceWith(this.monster) < 51 )
        this.hero.procCollisionWith(this.monster);

    this.hero.norm();
    this.monster.norm();

    // Detect game over
    if( this.state !== '' ) {
        // Do nothing
    }
    else if( this.hero.distanceWithOrigin() > this.radius + 25 )
        this.state = 'lose';
    else if( this.monster.distanceWithOrigin() > this.radius + 25 )
        this.state = 'win';
    else {
        this.radius -= config.radiusDecreasePerTerm;
        this.radius = parseInt(this.radius*10, 10)/10;
    }
};

Game.prototype.applyForceToHero = function(force) {
    if( this.state === '' )
        this.hero.applyForce(force);
};

Game.prototype.applyForceToMonster = function(force) {
    if( this.state === '' )
        this.monster.applyForce(force);
};



// Export
module.exports = Game;
