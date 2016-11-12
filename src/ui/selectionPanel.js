var Agent = require('../agent.js');

var selectionPanel = (function() {
    var panel = $('#selection-panel')[0];
    var nowActive = $('#p0-select');
    var players = [null, null, null, null, ];

    var agentsName = Object.keys(Agent);
    for(var i=0; i<agentsName.length; ++i) {
        var ele = $('<div>').data({type: 'local-agent', name: agentsName[i]})
                        .text(agentsName[i]);
        if( agentsName[i] === '' ) ele.attr('id', 'no-agent');
        $('#agent-collection').append(ele);
    }

    function nextActive() {
        $('#player-selected > div').removeClass('active');
        nowActive = nowActive.nextAll('div').first();
        for(var i=0; i<4 && nowActive.data('name') && nowActive.length; ++i)
            nowActive = nowActive.nextAll('div').first();
        if( !nowActive.length ) {
            var divs = $('#player-selected > div');
            for(var i=0; i<4; ++i)
                if( !$(divs[i]).data('name') ) {
                    nowActive = $(divs[i]);
                    break;
                }
        }
        nowActive.addClass('active');
    }
    function bindPlayer(player, agent) {
        player.text(agent.text())
            .data('type', agent.data('type'))
            .data('name', agent.data('name'));
    }

    function show() {
        panel.style.display = 'block';
    }
    function hide() {
        panel.style.display = 'none';
    }
    function addRemoteAgentOption(name) {
        var ele = $('<div>').data({type: 'remote-agent', name: name})
                .text(name)
                .addClass('remote-agent')
                .click(function() {
                    var that = $(this);
                    $('#player-selected > div').each((idx, ele) => {
                        if( $(ele).data('name') === that.data('name') )
                            bindPlayer($(ele), $('#no-agent'));
                    });
                    bindPlayer(nowActive, that);
                    nextActive();
                });
        $('#agent-collection').append(ele);
    }

    $('#player-selected > div').click(function() {
        $('#player-selected > div').removeClass('active');
        nowActive = $(this).addClass('active');
    });

    $('#agent-collection > div').click(function() {
        bindPlayer(nowActive, $(this));
        nextActive();
    });

    $('#player-select-done').click(function() {
        $('#player-selected > div').each(function(idx, ele) {
            players[idx] = {
                type: $(this).data('type'),
                name: $(this).data('name'),
            };
        });
        window.game.init();
        hide();
        window.game.start();
    });

    return {
        show: show,
        hide: hide,
        players: players,
        addRemoteAgentOption: addRemoteAgentOption,
    }
})();

module.exports = selectionPanel;
