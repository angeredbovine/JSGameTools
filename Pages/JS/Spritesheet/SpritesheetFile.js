function SpritesheetFile(path)
{

	FileData.call(this, path);

	this.sheet = new Spritesheet();

	this.images = [];
	this.animations = [];

	this.sheet_path = {};
	this.image_path = {};

}

SpritesheetFile.prototype = Object.create(FileData.prototype);
SpritesheetFile.prototype.constructor = SpritesheetFile;

SpritesheetFile.prototype.ImageUsed = function(index)
{

	for(var i = 0; i < this.animations.length; i++)
	{

		var used = this.animations[i].frames.indexOf(index);
		if(used >= 0)
		{

			return true;

		}

	}

	return false;

}

SpritesheetFile.prototype.AddImageData = function(data, index)
{

	if(index === undefined)
	{

		index = this.images.length;

	}

	this.images.splice(index, 0, data);

	this.sheet.frames.splice(index, 0, new FrameData(data.position.X(), data.position.Y(), data.width, data.height, data.offset.X(), data.offset.Y(), data.duration));

}

SpritesheetFile.prototype.RemoveImageData = function(index)
{

	this.images.splice(index, 1);

	this.sheet.frames.splice(index, 1);

}

SpritesheetFile.prototype.UpdateImageData = function(data, index)
{

	this.images[index] = data;

	this.sheet.frames[index] = new FrameData(data.position.X(), data.position.Y(), data.width, data.height, data.offset.X(), data.offset.Y(), data.duration);

}

SpritesheetFile.prototype.AddAnimationData = function(data, index)
{

	if(index === undefined)
	{

		index = this.animations.length;

	}

	this.animations.splice(index, 0, data);

	this.sheet.animations.splice(index, 0, data.frames.splice(0));

}

SpritesheetFile.prototype.RemoveAnimationData = function(index)
{

	this.animations.splice(index, 1);

	this.sheet.animations.splice(index, 1);

}

SpritesheetFile.prototype.UpdateAnimationData = function(data, index)
{

	this.animations[index] = data;

	this.sheet.animations[index] = data.frames.slice(0);

}

SpritesheetFile.prototype.Show = function(context)
{

	//Not all apps have workspaces, so FileData.AddFile calls .Show without a context argument. Not having a context is a signifier of lifecycle calls to Show, such as switching/opening files.
	//We can handle any non-render changes here
	if(!context)
	{

		Workspace.RenderWorkspace();

		AnimationMethods.ClearAnimationSelect();

		for(var i = 0; i < this.animations.length; i++)
		{

			AnimationMethods.CreateSelectElement(this.animations[i].name);

		}

		AnimationMethods.ControlButtons();

		return;

	}

	for(var i = 0; i < this.images.length; i++)
	{

		var data = this.images[i];
		context.drawImage(data.image, data.position.X(), data.position.Y(), data.width, data.height);

	}

	if(ImageMethods.selectedImage >= 0 && ImageMethods.selectedImage < this.images.length)
	{

		var data = this.images[ImageMethods.selectedImage];

		context.beginPath();
		context.lineWidth = "3";
		context.strokeStyle = getComputedStyle(document.documentElement).getPropertyValue('--selected-color');
		context.rect(data.position.X(), data.position.Y(), data.width, data.height);
		context.stroke();

	}

}

SpritesheetFile.prototype.Open = function(json, callback)
{

	var loaded = [];

	this.sheet_path = json.sheet_path;
	this.image_path = json.image_path;

	this.sheet = new Spritesheet();
	this.sheet.Populate(json.sheet, false);

	this.animations = [];

	for(var i = 0; i < json.animations.length; i++)
	{

		this.animations[i] = new AnimationData(json.animations[i].name, json.animations[i].frames);

	}

	for(var i = 0; i < json.images.length; i++)
	{

		var index = i;
		var image = json.images[i];

		loaded[image.index] = false;

		this.images[image.index] = new ImageData(null, image.duration, image.x, image.y, image.width, image.height, image.offsetx, image.offsety);
		this.images[image.index].image = new Image();
	    this.images[image.index].image.src = image.image;
	    this.images[image.index].image.onload = function(e)
		{

			loaded[index] = true;

			for(var i = 0; i < loaded.length; i++)
			{

				if(!loaded[index])
				{

					return;

				}

			}

			callback();

		}

	}

}

SpritesheetFile.prototype.Save = function()
{

	var json = {};

	json.sheet_path = this.sheet_path;
	json.image_path = this.image_path;

	json.sheet = this.sheet.ToJSON();

	json.animations = [];
	for(var i = 0; i < this.animations.length; i++)
	{

		json.animations.push(this.animations[i].ToJSON());

	}

	json.images = [];

	for(var i = 0; i < this.images.length; i++)
	{

		var data = this.images[i].ToJSON(i);
		data.image = ToolHelpers.ImageToBase64(this.images[i].image);

		json.images.push(data);

	}

	return json;

}

SpritesheetFile.prototype.Dimensions = function()
{

	var dimensions = {offsetX: 0, offsetY: 0, width: 0, height: 0};

	if(this.images.length <= 0)
	{

		return dimensions;

	}

	dimensions.offsetX = -this.images[0].position.X();
	dimensions.offsetY = -this.images[0].position.Y();

	dimensions.width = this.images[0].position.X() + this.images[0].width;
	dimensions.height = this.images[0].position.Y() + this.images[0].height;

	for(var i = 0; i < this.images.length; i++)
	{

		var data = this.images[i];

		dimensions.offsetX = -Math.min(data.position.X(), -dimensions.offsetX);
		dimensions.offsetY = -Math.min(data.position.Y(), -dimensions.offsetY);
		dimensions.width = Math.max(data.position.X() + data.width, dimensions.width);
		dimensions.height = Math.max(data.position.Y() + data.height, dimensions.height);

	}

	dimensions.width += dimensions.offsetX;
	dimensions.height += dimensions.offsetY;

	return dimensions;

}

SpritesheetFile.prototype.ExportSheet = function()
{

	dialog.showSaveDialog(null, {defaultPath: this.sheet_path, filters: [{name: 'JSON', extensions: ["json"]}]}, function(path)
    {

		if(!path)
		{

			return;

		}

		var file = FileData.GetFile();

		var dimensions = file.Dimensions();

		var json = file.sheet.ToJSON(new Vector2(dimensions.offsetX, dimensions.offsetY));
		var data = JSON.stringify(json);

		fs.writeFile(path, data, function(err)
        {

                if(err)
                {

                        Logger.LogError("Error " + err + " exporting sheet to " + path);

                        return;

                }

                Logger.LogInfo("Successfully exported spritesheet to " + path);

				file.sheet_path = path;

        });

	});

}

SpritesheetFile.prototype.ExportImage = function()
{

	dialog.showSaveDialog(null, {defaultPath: this.image_path, filters: [{name: 'PNG', extensions: ["png"]}]}, function(path)
	{

		if(!path)
		{

			return;

		}

		var file = FileData.GetFile();

		var dimensions = file.Dimensions();

		var canvas = document.createElement("canvas");
		canvas.width = dimensions.width;
		canvas.height = dimensions.height;

		var context = canvas.getContext("2d");

		for(var i = 0; i < file.images.length; i++)
		{

			var data = file.images[i];
			context.drawImage(data.image, data.position.X() + dimensions.offsetX, data.position.Y() + dimensions.offsetY, data.width, data.height);

		}

		var data = canvas.toDataURL("image/png");
		data = data.replace("data:image/png;base64,", '');

		fs.writeFile(path, data, 'base64', function(err)
		{

				if(err)
				{

						Logger.LogError("Error " + err + " exporting image to " + path);

						return;

				}

				Logger.LogInfo("Successfully exported image to " + path);

				file.image_path = path;

		});

	});

}

FileData.Construct = function(path)
{

        return new SpritesheetFile(path);

}

FileData.HandleOpen = function()
{

	AnimationMethods.AnimationChanged();

}

document.addEventListener('DOMContentLoaded', function()
{

        document.getElementById("export-image-button").addEventListener("click", function(e)
        {

			var file = FileData.GetFile();

			if(file)
			{

				file.ExportImage();

			}

        });

		document.getElementById("export-sheet-button").addEventListener("click", function(e)
		{

			var file = FileData.GetFile();

			if(file)
			{

				file.ExportSheet();

			}


		});

});
