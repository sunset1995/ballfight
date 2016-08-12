var autobahn = require('autobahn');
var handlers = {};
var connected = false;
var session = null;
var roomname = '';
var heroAction = [0, 0];
var monsterAction = [0, 0];

function publishState(state) {
    if( session ) {
        console.log(roomname+'.arena', state)
        session.publish(roomname+'.arena', [], state);
    }
}

function getHeroAction() {
    return heroAction;
}

function getMonsterAction() {
    return monsterAction;
}

function isConnect() {
    return connected;
}


// DOM
$('#url').val('ws://'+location.hostname+':8080/ws');
$('#connect').click(function() {
    $('#connect-panel')[0].style.display = 'none';

    var connection = new autobahn.Connection({
        url: $('#url').val(),
        realm: 'ballfight',
    });
    roomname = $('#room').val();


    connection.onclose = function (reason, details) {
       // connection closed, lost or unable to connect
       console.log('Connection was closed due to:', reason);
       $('#fight-trigger')[0].style.display = 'none';
       connected = false;
    };


    connection.onopen = function (ses) {
        console.log('Connection success');
        $('#fight-trigger')[0].style.display = 'block';
        connected = true;
        session = ses;


        function heroActionHandler(args, kwargs, details) {
            console.log(args, kwargs, details);
            var force = args[0];
            if( typeof force === 'object' && 
                    typeof force[0] === 'number' && 
                    typeof force[1] === 'number' )
                heroAction = force;
        }
        session.subscribe(roomName+'.hero', heroActionHandler);


        function monsterActionHandler(args, kwargs, details) {
            console.log(args, kwargs, details);
            var force = args[0];
            if( typeof force === 'object' && 
                    typeof force[0] === 'number' && 
                    typeof force[1] === 'number' )
                monsterAction = force;
        }
        session.subscribe(roomName+'.monster', monsterActionHandler);
    };


    console.log('Connecting to server...');
    connection.open();
});




module.exports = {
    'publishState': publishState,
    'getHeroAction': getHeroAction,
    'getMonsterAction': getMonsterAction,
    'isConnect': isConnect,
}
