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

        //Currently broken - hides the menu forever
        /*var items = document.getElementsByClassName("window-pane-menuitem");
        for(var i = 0; i < items.length; i++)
        {

                items[i].addEventListener("click", function(e)
                {

                        var target = e.target || e.srcElement;
                        var menu = target.closest(".window-pane-menucontent");
                        menu.style.display = "none";

                });

        }*/

});
