var files = {};
var currentFile = null;

function FileData(path)
{

        this.path = path;

}

FileData.prototype.Show()
{

        Logger.LogError("Attempting to call abstract Show method on virtual FileData object.");

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

        files[file.Path()] = file;

}

//Needs to be overwritten on a per-application basis to return a copy of the application-specific FileData class
FileData.Construct = function(fileName)
{

        Logger.LogError("Attempting to build a virtual FileData object.");

}

document.addEventListener('DOMContentLoaded', function()
{

        document.getElementById("window-pane-file-new").addEventListener("click", function(e)
        {
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
