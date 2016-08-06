var config = require('./config.js');
var Ball = require('./ball.js');



// Define game class
var Game = function() {
    this.hero = new physicalEngine.Ball();
    this.monster = new physicalEngine.Ball();
    this.init();
};

Game.prototype.start = function() {
    if( this.state === '' )
        return;
    this.hero.init(config.heroInit);
    this.monster.init(config.monsterInit);
    this.radius = config.radiusInit;
    this.state = '';

    // To check updated or not
    this.lastHeroX = 0;
    this.lastHeroY = 0;
    this.lastMonsterX = 0;
    this.lastMonsterY = 0;
    this.lastRadius = this.radius;
};

Game.prototype.next = function() {
    this.hero.next();
    this.monster.next();

    // Detect collision
    if( this.hero.distanceWith(this.monster) < 51 )
        this.hero.procCollisionWith(this.monster);

    // Detect game over
    if( this.state === '' )
        this.state = '';
    else if( this.hero.distanceWithOrigin() > this.radius )
        this.state = 'lose';
    else if( this.monster.distanceWithOrigin() > this.radius )
        this.state = 'win';
    else
        this.radius -= config.radiusDecreasePerTerm;
};

Game.prototype.applyForceToHero = function(force) {
    if( this.state === '' )
        this.hero.applyForce(force);
};

Game.prototype.applyForceToMonster = function(force) {
    if( this.state === '' )
        this.monster.applyForce(force);
};

Game.prototype.checkUpdated = function() {
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
    if( this.radius != this.lastRadius ) {
        this.lastRadius = this.radius;
        ret = true;
    }
    return ret;
};



// Export
module.exports = Game;
