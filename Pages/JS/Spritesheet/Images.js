var dialog = require('electron').remote.dialog;

function ImageData(img, duration, x, y, width, height)
{

	this.image = img;

        this.duration = duration;

	this.position = new Vector2(parseInt(x, 10), parseInt(y, 10));
	this.width = parseInt(width, 10);
	this.height = parseInt(height, 10);

}

ImageData.prototype.ToJSON = function(i)
{

        var json = {};

        json.index = i;
        json.duration = this.duration;
        json.x = this.position.X();
        json.y = this.position.Y();
        json.width = this.width;
        json.height = this.height;

        return json;

}

ImageData.EmptyJSON = function()
{

        var json = {};

        json.index = "Not Selected";
        json.duration = "";
        json.x = "";
        json.y = "";
        json.width = "";
        json.height = "";

        return json;

}

function AddImageAction(image)
{

        Action.call(this);

        this.image = image;

}

AddImageAction.prototype = Object.create(Action.prototype);
AddImageAction.prototype.constructor = AddImageAction;

AddImageAction.prototype.Do = function(file)
{

        file.images.push(new ImageData(this.image, 0, Workspace.worldX, Workspace.worldY, this.image.width, this.image.height));

        Workspace.RenderWorkspace();

}

AddImageAction.prototype.Undo = function(file)
{

        file.images.pop();

        Workspace.RenderWorkspace();

}

function RemoveImageAction(index, image)
{

        Action.call(this);

        this.index = index;
        this.image = image;

}

RemoveImageAction.prototype = Object.create(Action.prototype);
RemoveImageAction.prototype.constructor = RemoveImageAction;

RemoveImageAction.prototype.Do = function(file)
{

        file.images.splice(this.index, 1);

        Workspace.RenderWorkspace();

}

RemoveImageAction.prototype.Undo = function(file)
{

        file.images.splice(this.index, 0, this.image);

        Workspace.RenderWorkspace();

}

function UpdateImageAction(index, update, old)
{

        Action.call(this);

        this.index = index;

        this.update = update
        this.old = old;

}

UpdateImageAction.prototype = Object.create(Action.prototype);
UpdateImageAction.prototype.constructor = UpdateImageAction;

UpdateImageAction.prototype.Do = function(file)
{

        file.images[this.index] = this.update;

        Workspace.RenderWorkspace();

        Dialog.FillDialog("frame-dialog", file.images[this.index].ToJSON(this.index));

}

UpdateImageAction.prototype.Undo = function(file)
{

        file.images[this.index] = this.old;

        Workspace.RenderWorkspace();

        Dialog.FillDialog("frame-dialog", file.images[this.index].ToJSON(this.index));

}

function ImageMethods()
{

}

ImageMethods.selectedImage = -1;

ImageMethods.ImportImage = function(path)
{

        var image = new Image();
        image.src = path;
        image.onload = function(e)
        {

                FileData.Do(new AddImageAction(image));

        }

}

ImageMethods.ImportImageButton = function()
{

        dialog.showOpenDialog(null, {filters: [{name: 'Images', extensions: ['jpg', 'png', 'svg']}]}, function(paths)
        {

                if(!paths)
                {

                        return;

                }

                for(var i = 0; i < paths.length; i++)
                {

                        ImageMethods.ImportImage(paths[i]);

                }

        });

}

ImageMethods.Select = function(index, file)
{

        ImageMethods.selectedImage = index;

        Dialog.FillDialog("frame-dialog", file.images[index].ToJSON(index));

        document.getElementById("frame-dialog-apply").classList.remove("disabled");
        document.getElementById("frame-dialog-delete").classList.remove("disabled");

	Workspace.RenderWorkspace();

}

ImageMethods.Deselect = function()
{

        ImageMethods.selectedImage = -1;

        Dialog.FillDialog("frame-dialog", ImageData.EmptyJSON());

        document.getElementById("frame-dialog-apply").classList.add("disabled");
        document.getElementById("frame-dialog-delete").classList.add("disabled");

	Workspace.RenderWorkspace();

}

ImageMethods.ImageSelect = function(e)
{

        e = e || window.event;
        e.preventDefault();

        if(e.button == 0)
        {

                var file = FileData.GetFile();
                if(file)
                {

                        var canvas = document.getElementById(CONST_WORKSPACE_CANVAS_ID);
                        var point = new Vector2(e.clientX - canvas.offsetLeft, e.clientY - canvas.offsetTop);

                        var indices = [];

                        for(var i = 0; i < file.images.length; i++)
                        {

                                var data = file.images[i];

                                var box = new Box(data.position.X() - Workspace.worldX, data.position.Y() - Workspace.worldY, data.width, data.height);

                                if(box.ContainsPoint(point))
                                {

                                        indices.push(i);

                                }

                        }

                        //No Images clicked
                        if(indices.length == 0)
                        {

                                ImageMethods.Deselect();

                                return;

                        }

                        //The clicked outside of the last image selected, and should start afresh
                        if(!indices.includes(ImageMethods.selectedImage))
                        {

                                ImageMethods.Select(indices[indices.length - 1], file);

                                return;

                        }

                        //Cycle through all images below the selected one
                        var i = indices.indexOf(ImageMethods.selectedImage);
                        i -= 1;

                        if(i < 0)
                        {

                                i = indices.length - 1;

                        }

                        ImageMethods.Select(indices[i], file);

                        return;

                }

        }

}

ImageMethods.UpdateImage = function()
{

        var file = FileData.GetFile();
        if(file)
        {

                if(ImageMethods.selectedImage < 0 || ImageMethods.selectedImage >= file.images.length)
                {

                        Logger.LogError("Attempting to update invalid image " + ImageMethods.selectedImage);

                        return;

                }

                var json = Dialog.PullData("frame-dialog");
                var data = file.images[ImageMethods.selectedImage];

                FileData.Do(new UpdateImageAction(ImageMethods.selectedImage, new ImageData(data.image, json.duration, json.x, json.y, json.width, json.height), data));

        }

}

ImageMethods.DeleteImage = function()
{

        var file = FileData.GetFile();
        if(file)
        {

                if(ImageMethods.selectedImage < 0 || ImageMethods.selectedImage >= file.images.length)
                {

                        Logger.LogError("Attempting to delete invalid image " + ImageMethods.selectedImage);

                        return;

                }

                var data = file.images[ImageMethods.selectedImage];

                FileData.Do(new RemoveImageAction(ImageMethods.selectedImage, data));

        }

}

document.addEventListener('DOMContentLoaded', function()
{

        document.getElementById("import-image-button").addEventListener("click", ImageMethods.ImportImageButton);

        document.getElementById("tool-content-workspace").addEventListener("click", ImageMethods.ImageSelect);

        document.getElementById("frame-dialog-apply").addEventListener("click", ImageMethods.UpdateImage);
        document.getElementById("frame-dialog-delete").addEventListener("click", ImageMethods.DeleteImage);

});
