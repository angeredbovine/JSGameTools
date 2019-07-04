const CONST_WORKSPACE_TILE_PATH = "Theme/Tile.svg";
const CONST_WORKSPACE_CANVAS_ID = "tool-content-workspace";
const CONST_WORKSPACE_PARENT_ID = "base-content-area";

function Workspace()
{

}

Workspace.tile = null;

Workspace.tileWidth = -1;
Workspace.tileHeight = -1;
Workspace.targetWidth = 0;
Workspace.targetHeight = 0;

Workspace.worldX = 0;
Workspace.worldY = 0;

Workspace.ResizeWorkspace = function(width, height)
{

        var canvas = document.getElementById(CONST_WORKSPACE_CANVAS_ID);

        canvas.width = width;
        canvas.height = height;

        Workspace.targetWidth = (2 + Math.floor(width / Workspace.tileWidth)) * Workspace.tileWidth;
        Workspace.targetHeight = (1 + Math.floor(height / Workspace.tileHeight)) * Workspace.tileHeight;

}

Workspace.RenderWorkspace = function()
{

        if(!Workspace.tile)
        {

                Logger.LogError("Attempting to Render workspace without loaded Tile image.");

                return;

        }

        var canvas = document.getElementById(CONST_WORKSPACE_CANVAS_ID);
        var context = canvas.getContext('2d');

        context.clearRect(0, 0, canvas.width, canvas.height);

        context.fillStyle = Workspace.tile;

        var tileOffsetX = MathHelpers.PositiveMod(Workspace.worldX, Workspace.tileWidth);
        var tileOffsetY = MathHelpers.PositiveMod(Workspace.worldY, Workspace.tileHeight);

        context.translate(-tileOffsetX, -tileOffsetY);
        context.fillRect(0, 0, Workspace.targetWidth, Workspace.targetHeight);
        context.translate(tileOffsetX, tileOffsetY);

}

Workspace.PrepareWorkspace = function()
{

        Workspace.tile = new Image();
        Workspace.tile.src = CONST_WORKSPACE_TILE_PATH;
        Workspace.tile.onload = function()
        {

                var canvas = document.getElementById(CONST_WORKSPACE_CANVAS_ID);
                var context = canvas.getContext('2d');

                Workspace.tileWidth = Workspace.tile.width;
                Workspace.tileHeight = Workspace.tile.height;

                Workspace.tile = context.createPattern(Workspace.tile, 'repeat');

                var container = document.getElementById(CONST_WORKSPACE_PARENT_ID);
                var offsetX, offsetY;

                function WorkspacePanStart(e)
                {

                        e = e || window.event;

                        if(e.button == 1)
                        {

                                e.preventDefault();

                                offsetX = e.clientX - canvas.offsetLeft;
                                offsetY = e.clientY - canvas.offsetTop;

                                document.addEventListener("mousemove", WorkspacePanMove);
                                document.addEventListener("mouseup", WorkspacePanStop);

                                return;

                        }

                }

                function WorkspacePanMove(e)
                {

                        e = e || window.event;
                        e.preventDefault();

                        var newOffsetX = e.clientX - canvas.offsetLeft;
                        var newOffsetY = e.clientY - canvas.offsetTop;

                        var diffX = newOffsetX - offsetX;
                        var diffY = newOffsetY - offsetY;

                        Workspace.worldX -= diffX;
                        Workspace.worldY -= diffY;

                        offsetX = newOffsetX;
                        offsetY = newOffsetY;

                        Workspace.RenderWorkspace();

                }

                function WorkspacePanStop(e)
                {

                        e = e || window.event;

                        if(e.button == 1)
                        {

                                document.removeEventListener("mousemove", WorkspacePanMove);
                                document.removeEventListener("mouseup", WorkspacePanStop);

                        }

                }

                canvas.addEventListener("mousedown", WorkspacePanStart);

                function WorkspaceReset(e)
                {

                        e = e || window.event;

                        if(e.button == 2)
                        {

                                e.preventDefault();

                                Workspace.worldX = 0;
                                Workspace.worldY = 0;

                                Render();

                        }

                }

                canvas.addEventListener("mousedown", WorkspaceReset);

                Workspace.ResizeWorkspace(container.clientWidth, container.clientHeight);
                Workspace.RenderWorkspace();

        };

}

document.addEventListener('DOMContentLoaded', function()
{

        Workspace.PrepareWorkspace();

        window.addEventListener('resize', function()
        {

                var container = document.getElementById(CONST_WORKSPACE_PARENT_ID);

        	Workspace.ResizeWorkspace(container.clientWidth, container.clientHeight);
                Workspace.RenderWorkspace();

        }, true);

});
