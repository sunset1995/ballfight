var selectionPanel = require('./ui/selectionPanel.js');
var autobahn = require('autobahn');
var session = null;
var roomname = '';
var actions = {};

module.exports['publishState'] = function(toWhom, state) {
    if( session )
        session.publish(roomname+'.arena.'+toWhom, [], state);
}

module.exports['askName'] = function() {
    if( session )
        session.publish(roomname+'.name.request', [], {});
}

module.exports['getForce'] = function(who) {
    if( actions[who] )
        return [actions[who].force[0], actions[who].force[1]];
    else return [0, 0];
}

module.exports['getSay'] = function(who) {
    if( actions[who] ) return actions[who].say || '';
    else return '';
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

    var heartbeater = setInterval(function() {
        if( session )
            session.publish('heartbeat', [], {});
    }, 5000);

    connection.onclose = function (reason, details) {
       // connection closed, lost or unable to connect
       console.log('Connection was closed due to:', reason);
       console.log('Detail:', details);
       console.log('connection closed');
       clearInterval(heartbeater);
    };


    connection.onopen = function (ses) {
        console.log('Connection success');
        session = ses;


        function nameHandler(args, kwargs, details) {
            if( typeof kwargs.name === 'string' && !actions[kwargs.name] ) {
                actions[kwargs.name] = {
                    force: [0, 0],
                    say: '',
                };
                selectionPanel.addRemoteAgentOption(kwargs.name);
            }
        }
        session.subscribe(roomname+'.name.reply', nameHandler);


        function actionHandler(args, kwargs, details) {
            var name = kwargs.name;
            var force = kwargs.force;
            var say = kwargs.say;
            if( typeof name === 'string' ) {
                if( typeof force === 'object' && 
                        typeof force[0] === 'number' && 
                        typeof force[1] === 'number' )
                    actions[name].force = force;
                actions[name].say = say || '';
            }
        }
        session.subscribe(roomname+'.action', actionHandler);

        module.exports['askName']();
    };


    console.log('Connecting to server...');
    connection.open();
});

$('#offline').click(function() {
    $('#connect-panel')[0].style.display = 'none';
    selectionPanel.show();
});
