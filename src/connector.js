var selectionPanel = require('./ui/selectionPanel.js');
var autobahn = require('autobahn');
var handlers = {};
var session = null;
var roomname = '';
var heroAction = [0, 0];
var monsterAction = [0, 0];

function publishState(state) {
    if( session )
        session.publish(roomname+'.arena', [], state);
}

function getHeroAction() {
    return heroAction;
}

function getMonsterAction() {
    return monsterAction;
}


// DOM
$('#connect').click(function() {
    $('#connect-panel')[0].style.display = 'none';
    selectionPanel.show();

    var connection = new autobahn.Connection({
        url: $('#url').val(),
        realm: 'ballfight',
    });
    roomname = $('#room').val();


    connection.onclose = function (reason, details) {
       // connection closed, lost or unable to connect
       console.log('Connection was closed due to:', reason);
       console.log('connection closed');
    };


    connection.onopen = function (ses) {
        console.log('Connection success');
        session = ses;


        function heroActionHandler(args, kwargs, details) {
            var force = args[0];
            if( typeof force === 'object' && 
                    typeof force[0] === 'number' && 
                    typeof force[1] === 'number' )
                heroAction = force;
        }
        session.subscribe(roomname+'.hero', heroActionHandler);


        function monsterActionHandler(args, kwargs, details) {
            var force = args[0];
            if( typeof force === 'object' && 
                    typeof force[0] === 'number' && 
                    typeof force[1] === 'number' )
                monsterAction = force;
        }
        session.subscribe(roomname+'.monster', monsterActionHandler);
    };


    console.log('Connecting to server...');
    connection.open();
});

$('#offline').click(function() {
    $('#connect-panel')[0].style.display = 'none';
    selectionPanel.show();
});




module.exports = {
    'publishState': publishState,
    'getHeroAction': getHeroAction,
    'getMonsterAction': getMonsterAction,
}
