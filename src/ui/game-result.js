var selectionPanel = require('./selectionPanel.js');

var gameResult = (function() {

    var container = $('#game-result')[0];
    var infotext = $('#game-result > strong')[0];
    var buttons = $('#game-result button');

    function show(str, color) {
        container.style.display = 'block';
        buttons.css('background-color', color);
        infotext.style.color = color;
        infotext.textContent = str;
    }

    function hide() {
        container.style.display = 'none';
    }

    $('#restart').click(function() {
        game.init();
        hide();
        game.start();
    })

    $('#new-game').click(function() {
        hide();
        selectionPanel.show();
    });

    return {
        show: show,
        hide: hide,
    };
})();

module.exports = gameResult;
