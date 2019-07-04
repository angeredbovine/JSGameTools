function Dialog()
{

}

Dialog.EnableDrag = function(element)
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

                //Left click to drag only
                if(e.button == 0)
                {

                        e.preventDefault();

                        offsetX = e.clientX - element.offsetLeft;
                        offsetY = e.clientY - element.offsetTop;

                        document.addEventListener("mousemove", DragMove);
                        document.addEventListener("mouseup", DragStop);

                }

        }

        function DragMove(e)
        {

                e = e || window.event;
                e.preventDefault();

                var container = document.getElementById("tool-content-container");

                var left = e.clientX - offsetX;
                left = Math.max(0, left);
                left = Math.min(parseInt(container.clientWidth - container.offsetLeft, 10) - parseInt(element.style.width, 10), left);

                var top = e.clientY - offsetY;
                top = Math.max(0, top);
                top = Math.min(parseInt(container.clientHeight - container.offsetTop, 10) - parseInt(element.style.height, 10), top);

                element.style.left = left + "px";
                element.style.top = top + "px";

        }

        function DragStop(e)
        {

                e = e || window.event;

                if(e.button == 0)
                {

                        document.removeEventListener("mousemove", DragMove);
                        document.removeEventListener("mouseup", DragStop);

                }

        }

        header.addEventListener("mousedown", DragStart);

}

Dialog.EnableResize = function(element)
{

        var resize = element.getElementsByClassName("tool-dialog-resize");

        if(resize.length <= 0)
        {

                Logger.LogError("Dialog " + element.id + " does not have a proper resize handle.");

                return;

        }

        resize = resize[0];

        var offsetX, offsetY;

        function ResizeStart(e)
        {

                e = e || window.event;
                e.preventDefault();

                offsetX = parseInt(element.style.width, 10) - (e.clientX - element.offsetLeft);
                offsetY = parseInt(element.style.height, 10) - (e.clientY - element.offsetTop);

                document.addEventListener("mousemove", ResizeMove);
                document.addEventListener("mouseup", ResizeStop);

        }

        function ResizeMove(e)
        {

                e = e || window.event;
                e.preventDefault();

                var container = document.getElementById("tool-content-container");

                var headerSize = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--dialog-header-height'), 10);

                var width = e.clientX + offsetX - element.offsetLeft;
                width = Math.max(headerSize, width);
                width = Math.min(parseInt(container.clientWidth - container.offsetLeft, 10) - element.offsetLeft, width);

                var height = e.clientY + offsetY - element.offsetTop;
                height = Math.max(2 * headerSize, height);
                height = Math.min(parseInt(container.clientHeight - container.offsetTop, 10) - element.offsetTop, height);

                element.style.width = width + "px";
                element.style.height = height + "px";

        }

        function ResizeStop(e)
        {

                document.removeEventListener("mousemove", ResizeMove);
                document.removeEventListener("mouseup", ResizeStop);

        }

        resize.addEventListener("mousedown", ResizeStart);

}

document.addEventListener('DOMContentLoaded', function()
{

        var dialogs = document.getElementsByClassName("tool-dialog");

        for(var i = 0; i < dialogs.length; i++)
        {

                //Set width to pixels so that the moving/resizing works
                dialogs[i].style.width = dialogs[i].clientWidth + "px";
                dialogs[i].style.height = dialogs[i].clientHeight + "px";

                var open = document.getElementById(dialogs[i].id + "-open");
                open.addEventListener("click", function(e)
                {

                        var target = e.target || e.srcElement;
                        var dialog = document.getElementById(target.id.slice(0,-5));
                        dialog.style.visibility = "visible";

                });

                var close = document.getElementById(dialogs[i].id + "-close");
                close.addEventListener("click", function(e)
                {

                        var target = e.target || e.srcElement;
                        var dialog = document.getElementById(target.id.slice(0,-6));
                        dialog.style.visibility = "hidden";

                });

                Dialog.EnableDrag(dialogs[i]);
                Dialog.EnableResize(dialogs[i]);

        }

});
