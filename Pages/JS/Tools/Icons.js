const remote = require('electron').remote;

document.addEventListener('DOMContentLoaded', function()
{

        document.getElementById("window-pane-minimize").addEventListener("click", function(e)
        {

                const window = remote.getCurrentWindow();
                window.minimize();

        });

        document.getElementById("window-pane-maximize").addEventListener("click", function(e)
        {

                const window = remote.getCurrentWindow();
                (window.isMaximized() ? window.unmaximize() : window.maximize());

        });

        document.getElementById("window-pane-close").addEventListener("click", function(e)
        {

                const window = remote.getCurrentWindow();
                JSGameTools.Close(window);

        });

});
