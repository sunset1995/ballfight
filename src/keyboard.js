const pressing = {
    'w': false,
    'a': false,
    's': false,
    'd': false,
    'space': false,
    'enter': false,
    'up': false,
    'left': false,
    'down': false,
    'right': false,
};

$(document).keydown((e) => {
    switch(e.keyCode) {
        case 87: pressing.w = true; break;
        case 65: pressing.a = true; break;
        case 83: pressing.s = true; break;
        case 68: pressing.d = true; break;
        case 32: pressing.space = true; break;
        case 13: pressing.enter = true; break;
        case 38: pressing.up = true; break;
        case 37: pressing.left = true; break;
        case 40: pressing.down = true; break;
        case 39: pressing.right = true; break;
    }
});

$(document).keyup((e) => {
    switch(e.keyCode) {
        case 87: pressing.w = false; break;
        case 65: pressing.a = false; break;
        case 83: pressing.s = false; break;
        case 68: pressing.d = false; break;
        case 32: pressing.space = false; break;
        case 13: pressing.enter = false; break;
        case 38: pressing.up = false; break;
        case 37: pressing.left = false; break;;
        case 40: pressing.down = false; break;
        case 39: pressing.right = false; break;
    }
});

module.exports = pressing;
