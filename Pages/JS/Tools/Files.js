/*To make a new application, one must:
        -Create a child class of FileData that overrides the abstract methods
        -Create children of the Action class to interact/change the custom file object
        -Override the static FileData.construct method to return a copy of the custom file object
*/

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

FileData.prototype.Undo = function()
{

        if(this.actionIndex < 0)
        {

                Logger.LogError("Attempting to undo with nothing to undo.");

                return;

        }

        this.actionStack[this.actionIndex].Undo();
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
        this.actionStack[this.actionIndex].Do();

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

FileData.prototype.Show = function(context)
{

        Logger.LogError("Attempting to call abstract Show method on virtual FileData object.");

}

FileData.prototype.Save = function()
{

        Logger.LogError("Attempting to call abtract Save method on virtual FileData object.");

}

FileData.prototype.SaveAs = function(p)
{

        this.Path(p);
        this.Save();

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
        file.Show();

}

FileData.AddNewFile = function(json)
{

        var path = json.name + CONST_APP_EXTENSION;

        FileData.AddFile(FileData.Construct(path));

}

FileData.Construct = function(path)
{

        Logger.LogError("Attempting to build a virtual FileData object.");

}

FileData.Undo = function()
{

        if(!FileData.currentFile)
        {

                Logger.LogError("Attempting to Undo without a file active.");

                return;

        }

        var canUndo = FileData.files[FileData.currentFile].Undo(action);

        //If we have undone something, we can redo it
        document.getElementById("window-pane-tool-redo").classList.remove("window-pane-menuitem-disabled");

        if(!canUndo)
        {

                document.getElementById("window-pane-tool-undo").classList.add("window-pane-menuitem-disabled");

        }

}

FileData.Redo = function()
{

        if(!FileData.currentFile)
        {

                Logger.LogError("Attempting to Redo without a file active.");

                return;

        }

        var canRedo = FileData.files[FileData.currentFile].Redo(action);

        //If we have redone something, we can undo it
        document.getElementById("window-pane-tool-undo").classList.remove("window-pane-menuitem-disabled");

        if(!canRedo)
        {

                document.getElementById("window-pane-tool-redo").classList.add("window-pane-menuitem-disabled");

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

}

document.addEventListener('DOMContentLoaded', function()
{

        document.getElementById("window-pane-file-new").addEventListener("click", function(e)
        {

                Popup.ShowPopup("popup-newfile", {"name": ""}, FileData.AddNewFile);

        });

        document.getElementById("window-pane-file-open").addEventListener("click", function(e)
        {
        });

        document.getElementById("window-pane-file-save").addEventListener("click", function(e)
        {
        });

        document.getElementById("window-pane-file-saveas").addEventListener("click", function(e)
        {
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
