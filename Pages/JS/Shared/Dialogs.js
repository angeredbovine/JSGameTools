function EnableDrag(element)
{

        var header = element.getElementsByClassName("tool-dialog-header");

        if(header.length <= 0)
        {

                Logger.LogError("Dialog " + element.id + " does not have a proper dialog header.");

                return;

        }

        header = header[0];

        var offsetX, offsetY;

        function DragStart(e)
        {

                e = e || window.event;
                e.preventDefault();

                offsetX = e.clientX - element.offsetLeft;
                offsetY = e.clientY - element.offsetTop;

                document.addEventListener("mousemove", DragMove);
                document.addEventListener("mouseup", DragStop);

        }

        function DragMove(e)
        {

                e = e || window.event;
                e.preventDefault();

                var left = e.clientX - offsetX;
                left = Math.max(0, left);
                left = Math.min(parseInt(document.body.clientWidth, 10) - parseInt(element.style.width), left);

                var top = e.clientY - offsetY;
                top = Math.max(parseInt(getComputedStyle(document.documentElement).getPropertyValue('--title-bar-height'), 10), top);
                top = Math.min(parseInt(document.body.clientHeight, 10) - parseInt(element.style.height, 10), top);

                element.style.left = left + "px";
                element.style.top = top + "px";

        }

        function DragStop(e)
        {

                document.removeEventListener("mousemove", DragMove);
                document.removeEventListener("mouseup", DragStop);

        }

        header.addEventListener("mousedown", DragStart);

}

document.addEventListener('DOMContentLoaded', function()
{

        var dialogs = document.getElementsByClassName("tool-dialog");

        for(var i = 0; i < dialogs.length; i++)
        {

                var open = document.getElementById(dialogs[i].id + "-open");
                open.addEventListener("click", function(e)
                {

                        var target = e.target || e.srcElement;
                        var dialog = document.getElementById(target.id.slice(0,-5));
                        dialog.style.display = "block";

                });

                var close = document.getElementById(dialogs[i].id + "-close");
                close.addEventListener("click", function(e)
                {

                        var target = e.target || e.srcElement;
                        var dialog = document.getElementById(target.id.slice(0,-6));
                        dialog.style.display = "none";

                });

                EnableDrag(dialogs[i]);

        }

});
