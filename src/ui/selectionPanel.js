var selectionPanel = (function() {
    var panel = $('#selection-panel')[0];
    var nowActive = $('#p0-select');
    var selec = [null, null, null, null, ];

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
        nowActive.text($(this).text());
        $('#player-selected > div').removeClass('active');
        nowActive = nowActive.nextAll('div').first().addClass('active');
    });

    $('#player-select-done').click(function() {
        window.game.init();
        hide();
        window.game.start();
    });

    return {
        show: show,
        hide: hide,
    }
})();

module.exports = selectionPanel;
