var config = require('./config.js');
var Ball = require('./ball.js');



// Define game class
var Game = function() {
    this.autoStart = false;
    this.hero = new Ball();
    this.monster = new Ball();
    this.start();
    this.state = 'Let start!';
};

Game.prototype.start = function() {
    if( this.state === '' )
        return;
    this.hero.init(config.heroInit);
    this.monster.init(config.monsterInit);
    this.radius = config.radiusInit;
    this.state = '';

    // To check updated or not
    this.countDown = 100;
    this.lastHeroX = 0;
    this.lastHeroY = 0;
    this.lastMonsterX = 0;
    this.lastMonsterY = 0;
    this.lastState = this.state;
};

Game.prototype.next = function() {
    if( this.state !== '' ) {
        this.hero.fx = this.hero.fy = 0;
        this.monster.fx = this.monster.fy = 0;
        this.hero.k = this.monster.k = 5;
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
        if( this.autoStart )
            this.start();
    }
    else if( this.hero.distanceWithOrigin() > this.radius + 25 )
        this.state = 'lose';
    else if( this.monster.distanceWithOrigin() > this.radius + 25 )
        this.state = 'win';
    else
        this.radius -= config.radiusDecreasePerTerm;
};

Game.prototype.applyForceToHero = function(force) {
    if( this.state === '' && force )
        this.hero.applyForce(force);
};

Game.prototype.applyForceToMonster = function(force) {
    if( this.state === '' && force )
        this.monster.applyForce(force);
};

Game.prototype.checkUpdated = function() {
    if( this.state !== '' && --this.countDown < 0 )
        return false;

    var ret = false;
    if( this.hero.x != this.lastHeroX ) {
        this.lastHeroX = this.hero.x;
        ret = true;
    }
    if( this.hero.y != this.lastHeroY ) {
        this.lastHeroY = this.hero.y;
        ret = true;
    }
    if( this.monster.x != this.lastMonsterX ) {
        this.lastMonsterX = this.monster.x;
        ret = true;
    }
    if( this.monster.y != this.lastMonsterY ) {
        this.lastMonsterY = this.monster.y;
        ret = true;
    }
    if( this.state != this.lastState ) {
        this.lastState = this.state;
        ret = true;
    }
    return ret;
};



// Export
module.exports = Game;
