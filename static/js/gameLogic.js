(function() {




// Variables
var startFightDOM = $('#start-fight')[0];
var heroDOM = $('#hero')[0];
var monsterDOM = $('#monster')[0];

var hero = new Ball();
var monster = new Ball();

var heroKeyboard = {
	'up': false,
	'left': false,
	'right': false,
	'down': false
};
var monsterKeyboard = {
	'W': false,
	'A': false,
	'D': false,
	'S': false
}

var gamePlaying = false;
var win = false;


// Closures
var feedback = function() {
	var feedbackInfoDOM = $('#feedback-info')[0];
	var infoDOM = $('#feedback-info strong')[0];
	return {
		show: function(str) {
			infoDOM.innerHTML = str;
			feedbackInfoDOM.style.display = 'block';
		},
		close: function() {
			feedbackInfoDOM.style.display = 'none';
		}
	};
}();
var arena = function() {
	var arenaDOM = $('#arena')[0];
	var oriWidth = arenaDOM.getBoundingClientRect().width;
	var R = oriWidth/2;

	// Fixing position
	arenaDOM.style.left = (document.body.getBoundingClientRect().width/2) + 'px';
	arenaDOM.style.top = (document.body.getBoundingClientRect().height/2) + 'px';

	return {
		x: function() {
			return arenaDOM.getBoundingClientRect().left + R
		},
		y: function() {
			return arenaDOM.getBoundingClientRect().top + R
		},
		r: function() {
			return R;
		},
		setR: function(newR) {
			R = newR;
			arenaDOM.style.width = 2*newR + 'px';
			arenaDOM.style.height = 2*newR + 'px';
		},
		resetR: function() {
			R = oriWidth / 2;
			arenaDOM.style.width = oriWidth + 'px';
			arenaDOM.style.height = oriWidth + 'px';
		},
		dis: function(X, Y) {
			X -= this.x();
			Y -= this.y();
			return Math.sqrt(X*X + Y*Y);
		}
	}
}();


// Function
function resetPlayerPosition() {
	arena.resetR();
	hero.start({
		x: arena.x(),
		y: arena.y() + 250
	});
	monster.start({
		x: arena.x(),
		y: arena.y() - 250
	});
	updateDOM();
}
function startFight() {
	startFightDOM.style.display = 'none';
	feedback.close();
	resetPlayerPosition();
	heroDOM.style.display = 'block';
	monsterDOM.style.display = 'block';

	gamePlaying = true;
	win = false;
}
function closeFight() {
	gamePlaying = false;
	hero.stop();
	monster.stop();
	if( win )
		feedback.show('WINNER!!!');
	else
		feedback.show('Loser. You play this game just like your life.');
	startFightDOM.style.display = 'block';
}
function coculateHeroForce(keyboard) {
	var f = [0, 0];
	if( heroKeyboard.left ) f[0] -= 500;
	if( heroKeyboard.right ) f[0] += 500;
	if( heroKeyboard.up ) f[1] -= 500;
	if( heroKeyboard.down ) f[1] += 500;
	if( f[0] && f[1] ) {
		f[0] /= Math.sqrt(2);
		f[1] /= Math.sqrt(2);
	}
	return f;
}
function coculateMonsterForce(keyboard) {
	var f = [0, 0];
	if( monsterKeyboard.A ) f[0] -= 500;
	if( monsterKeyboard.D ) f[0] += 500;
	if( monsterKeyboard.W ) f[1] -= 500;
	if( monsterKeyboard.S ) f[1] += 500;
	return f;
}
function isCollision() {
	var X = hero.x - monster.x;
	var Y = hero.y - monster.y;
	return X*X + Y*Y <= 2500;
}
function isFallout(ball) {
	return arena.dis(ball.x, ball.y) > arena.r()+25;
}
function isGameOver() {
	return isFallout(hero) || isFallout(monster);
}
function updateDOM() {
	var heroF = Math.sqrt(hero.fx*hero.fx + hero.fy*hero.fy);
	var monsterF = Math.sqrt(monster.fx*monster.fx + monster.fy*monster.fy);
	heroDOM.style.opacity = 0.3 + 0.7 * (heroF / hero.maxForce);
	monsterDOM.style.opacity = 0.3 + 0.7 * (monsterF / monster.maxForce);
	heroDOM.style.transform = 'translate3d(Xpx, Ypx, 0)'.replace('X', hero.x).replace('Y', hero.y);
	monsterDOM.style.transform = 'translate3d(Xpx, Ypx, 0)'.replace('X', monster.x).replace('Y', monster.y);
	if( gamePlaying )
		arena.setR(arena.r() - 0.05);
}

// Work in each fream
function judge() {
	if( gamePlaying ) {
		if( isGameOver() ) {
			win = isFallout(monster);
			closeFight();
		}

		if( HeroKeyboardEnable ) {
			var hForce = coculateHeroForce();
			hero.applyForce(hForce);
		}
		if( MonsterKeyboardEnable ) {
			var mForce = coculateMonsterForce();
			monster.applyForce(mForce);
		}
	}

	if( isCollision() )
		BallCollision(hero, monster);

	updateDOM();

	requestAnimationFrame(judge);
}
requestAnimationFrame(judge);


// Binding
$('#start-fight').click(startFight);
$(document).keydown(function(e) {
	switch(e.which) {
		case 37: // left
			heroKeyboard.left = true;
			break;
		case 38: // up
			heroKeyboard.up = true;
			break;
		case 39: // right
			heroKeyboard.right = true;
			break;
		case 40: // down
			heroKeyboard.down = true;
			break
		case 65: // A
			monsterKeyboard.A = true;
			break;
		case 87: // W
			monsterKeyboard.W = true;
			break;
		case 68: // D
			monsterKeyboard.D = true;
			break;
		case 83: // S
			monsterKeyboard.S = true;
			break;
		default: break;
	}
});
$(document).keyup(function(e) {
	switch(e.which) {
		case 37: // left
			heroKeyboard.left = false;
			break;
		case 38: // up
			heroKeyboard.up = false;
			break;
		case 39: // right
			heroKeyboard.right = false;
			break;
		case 40: // down
			heroKeyboard.down = false;
			break;
		case 65: // A
			monsterKeyboard.A = false;
			break;
		case 87: // W
			monsterKeyboard.W = false;
			break;
		case 68: // D
			monsterKeyboard.D = false;
			break;
		case 83: // S
			monsterKeyboard.S = false;
			break;
		default: break;
	}
});


// export to outer world for temporory AI
window.Feedback = feedback;
window.ResetPlayerPosition = resetPlayerPosition;

window.Monster = monster;
window.Hero = hero;
window.Arena = arena;

window.HeroKeyboardEnable = true;
window.MonsterKeyboardEnable = true;

window.GameStatus = function() {
	if( gamePlaying ) return 'playing';
	else if( win ) return 'win';
	else return 'lose';
}




})();
