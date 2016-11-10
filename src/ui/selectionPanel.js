var Agent = require('../agent.js');

var selectionPanel = (function() {
    var panel = $('#selection-panel')[0];
    var nowActive = $('#p0-select');
    var players = [null, null, null, null, ];

    var agentsName = Object.keys(Agent);
    for(var i=0; i<agentsName.length; ++i) {
        var ele = $('<div>').data({type: 'local-agent', name: agentsName[i]})
                        .text(agentsName[i]);
        $('#agent-collection').append(ele);
    }

    function show() {
        panel.style.display = 'block';
    }
    function hide() {
        panel.style.display = 'none';
    }

    $('#player-selected > div').click(function() {
        $('#player-selected > div').removeClass('active');
        nowActive = $(this).addClass('active');
    });

    $('#agent-collection > div').click(function() {
        nowActive.text($(this).text())
            .data('type', $(this).data('type'))
            .data('name', $(this).data('name'));
        $('#player-selected > div').removeClass('active');
        nowActive = nowActive.nextAll('div').first().addClass('active');
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
    }
})();

window.selectionPanel = selectionPanel;

module.exports = selectionPanel;
