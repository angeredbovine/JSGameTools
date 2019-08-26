/*To make a new application, one must:
        -Create a child class of FileData that overrides the abstract methods
        -Create children of the Action class to interact/change the custom file object
        -Override the static FileData.Construct method to return a copy of the custom file object
        -Override the static FileData.HandleOpen method to update the UI when a file is opened
*/

var fs = require("fs");

function Action()
{

}

Action.prototype.Undo = function(file)
{

        Logger.LogError("Attempting to call abstract Undo method on virtual Action object.");

}

Action.prototype.Do = function(file)
{

        Logger.LogError("Attempting to call abstract Do method on virtual Action object.");

}

function FileData(path)
{

        this.path = path;

        this.actionStack = [];
        this.actionIndex = -1;

}

FileData.files = {};
FileData.currentFile = null;

FileData.isOpen = false;

FileData.prototype.Undo = function()
{

        if(this.actionIndex < 0)
        {

                Logger.LogError("Attempting to undo with nothing to undo.");

                return;

        }

        this.actionStack[this.actionIndex].Undo(this);
        this.actionIndex -= 1;

        return this.actionIndex >= 0;

}

FileData.prototype.Redo = function()
{

        if(this.actionIndex + 1 >= this.actionStack.length)
        {

                Logger.LogError("Attempting to redo with nothing to redo.");

                return;

        }

        this.actionIndex += 1;
        this.actionStack[this.actionIndex].Do(this);

        return this.actionIndex < this.actionStack.length - 1;

}

FileData.prototype.Do = function(action)
{

        if(this.actionStack.length > 0 && this.actionIndex < this.actionStack.length - 1)
        {

                this.actionStack = this.actionStack.slice(0, this.actionIndex + 1);

        }

        action.Do(this);
        this.actionStack.push(action);

        this.actionIndex = this.actionStack.length - 1;

}

FileData.prototype.Show = function()
{

        Logger.LogError("Attempting to call abstract Show method on virtual FileData object.");

}

FileData.prototype.Open = function(json, callback)
{

        Logger.LogError("Attempting to call abstract Open method on virtual FileData object.");

}

FileData.prototype.Save = function()
{

        Logger.LogError("Attempting to call abtract Save method on virtual FileData object.");

}

FileData.prototype.Path = function(p)
{

    if(p === undefined)
	{

		return this.path;

	}

	this.path = p;

	return;

}

FileData.AddFile = function(file)
{

        if(FileData.files.hasOwnProperty(file.Path()))
        {

                //TODO:Handle potential duplicate

                return;

        }

        FileData.files[file.Path()] = file;

        var container = document.getElementById("tool-content-container");
        container.style.visibility = "visible";

        FileData.currentFile = file.Path();

        if(!FileData.isOpen)
        {

                var buttons = document.getElementsByClassName("file-needed");

                for(var i = 0; i < buttons.length; i++)
                {

                        buttons[i].classList.remove("disabled");

                }

        }

        FileData.isOpen = true;

        file.Show();

}

FileData.AddNewFile = function(json)
{

        var path = json.name + "." + CONST_APP_EXTENSION;

        FileData.AddFile(FileData.Construct(path));

}

FileData.OpenFile = function()
{

        dialog.showOpenDialog(null, {filters: [{name: 'App Files', extensions: [CONST_APP_EXTENSION]}]}, function(paths)
        {

                if(!paths || paths.length != 1)
                {

                        return;

                }

                var file = FileData.Construct(paths[0]);

                fs.readFile(file.Path(), function(err, data)
                {

                        if(err)
                        {

                                Logger.LogError("Error " + err + " reading " + file.Path());

                                return;

                        }

                        file.Open(JSON.parse(data), function()
                        {

                                FileData.AddFile(file);

                                FileData.HandleOpen();

                                Logger.LogInfo(file.Path() + " successfully read!");

                        });

                });

        });

}

FileData.SaveFile = function()
{

        if(!FileData.currentFile)
        {

                Logger.LogError("Attempting to Save without a file active.");

                return;

        }

        var file = FileData.GetFile();
        var json = file.Save();
        var data = JSON.stringify(json);

        fs.writeFile(file.Path(), data, function(err)
        {

                if(err)
                {

                        Logger.LogError("Error " + err + " writing to " + file.Path());

                        return;

                }

                Logger.LogInfo(file.Path() + " successfully saved!");

        });

}

FileData.SaveFileAs = function()
{

    if(!FileData.currentFile)
    {

            Logger.LogError("Attempting to Save As without a file active.");

            return;

    }

    dialog.showSaveDialog(null, {filters: [{name: 'App Files', extensions: [CONST_APP_EXTENSION]}]}, function(path)
    {

        if(!path)
        {

                return;

        }

        var file = FileData.GetFile();

        var oldPath = file.Path();

        file.Path(path);
        FileData.AddFile(file);

        delete FileData.files[oldPath];

        FileData.SaveFile();

    });

}

FileData.Construct = function(path)
{

        Logger.LogError("Attempting to build a virtual FileData object.");

}

FileData.HandleOpen = function(path)
{

        Logger.LogError("Attempting to open a virtual FileData object.");

}

FileData.Undo = function()
{

        if(!FileData.currentFile)
        {

                Logger.LogError("Attempting to Undo without a file active.");

                return;

        }

        var canUndo = FileData.files[FileData.currentFile].Undo();

        //If we have undone something, we can redo it
        document.getElementById("window-pane-tool-redo").classList.remove("disabled");

        if(!canUndo)
        {

                document.getElementById("window-pane-tool-undo").classList.add("disabled");

        }

}

FileData.Redo = function()
{

        if(!FileData.currentFile)
        {

                Logger.LogError("Attempting to Redo without a file active.");

                return;

        }

        var canRedo = FileData.files[FileData.currentFile].Redo();

        //If we have redone something, we can undo it
        document.getElementById("window-pane-tool-undo").classList.remove("disabled");

        if(!canRedo)
        {

                document.getElementById("window-pane-tool-redo").classList.add("disabled");

        }

}

FileData.Do = function(action)
{

        if(!FileData.currentFile)
        {

                Logger.LogError("Attempting to Do without a file active.");

                return;

        }

        FileData.files[FileData.currentFile].Do(action);

        //If we have done something, we can undo it, but we have erased the rest of the actionStack
        document.getElementById("window-pane-tool-undo").classList.remove("disabled");
        document.getElementById("window-pane-tool-redo").classList.add("disabled");

}

FileData.GetFile = function()
{

        if(!FileData.currentFile)
        {

                Logger.LogInfo("Attempting to access file when none exist.");

                return;

        }

        return FileData.files[FileData.currentFile];

}

document.addEventListener('DOMContentLoaded', function()
{

        document.getElementById("window-pane-file-new").addEventListener("click", function(e)
        {

                Popup.ShowPopup("popup-newfile", {"name": ""}, FileData.AddNewFile);

        });

        document.getElementById("window-pane-file-open").addEventListener("click", function(e)
        {

                FileData.OpenFile();

        });

        document.getElementById("window-pane-file-save").addEventListener("click", function(e)
        {

                FileData.SaveFile();

        });

        document.getElementById("window-pane-file-saveas").addEventListener("click", function(e)
        {

            FileData.SaveFileAs();

        });

        document.getElementById("window-pane-tool-undo").addEventListener("click", function(e)
        {

                FileData.Undo();

        });

        document.getElementById("window-pane-tool-redo").addEventListener("click", function(e)
        {

                FileData.Redo();

        });

});
