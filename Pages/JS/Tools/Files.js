var files = {};
var currentFile = null;

function FileData(path)
{

        this.path = path;

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

        if(files.hasOwnProperty(file.Path()))
        {

                //TODO:Handle potential duplicate

                return;

        }

        files[file.Path()] = file;

        var container = document.getElementById("tool-content-container");
        container.style.visibility = "visible";

}

FileData.AddNewFile = function(json)
{

        var path = json.name + CONST_APP_EXTENSION;

        FileData.AddFile(FileData.Construct(path));

}

//Needs to be overwritten on a per-application basis to return a copy of the application-specific FileData class
FileData.Construct = function(path)
{

        Logger.LogError("Attempting to build a virtual FileData object.");

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

});
