var config = require('./config.js');
var Ball = require('./ball.js');



// Define game class
var Game = function() {
    this.players = [new Ball(), new Ball(), new Ball(), new Ball()];
    this.init();
    this.state = 'Hello';
};

Game.prototype.init = function() {
    if( this.state === '' )
        return;
    for(var i=0; i<4; ++i) {
        const initValue = Object.assign({},
            config.playerInit.common,
            config.playerInit.specific[i]
        );
        this.players[i].init(initValue);
    }
    this.radius = config.radiusInit;
    this.say = '';
};

Game.prototype.start = function() {
    this.state = 'Playing';
}

Game.prototype.next = function() {
    if( this.state !== 'Playing' )
        this.players.forEach((p) => {
            p.stop();
        });
    this.players.forEach((p) => {
        if( p.outOfRadius(this.radius) )
            p.stop();
        p.next();
    });

    // Process collision
    for(var i=1; i<4; ++i)
        for(var j=0; j<i; ++j)
            if( this.players[i].isCollisionWith(this.players[j]) )
                this.players[i].procCollisionWith(this.players[j]);
        

    this.players.forEach((p) => {
        p.norm();
    });

    // Determine game state
    if( this.state === 'Playing' ) {
        this.radius -= config.radiusDecreasePerTerm;
        this.radius = parseInt(this.radius*10, 10) / 10;
        if( this.players[0].outOfRadius(this.radius) && this.players[1].outOfRadius(this.radius) )
            this.state = 'Red win';
        else if( this.players[2].outOfRadius(this.radius) && this.players[3].outOfRadius(this.radius) )
            this.state = 'Blue win';
    }
};

Game.prototype.applyForce = function(force, id) {
    if( this.state === 'Playing' && typeof force === 'object' )
        this.players[id].applyForce(force);
};



// Export
module.exports = Game;
