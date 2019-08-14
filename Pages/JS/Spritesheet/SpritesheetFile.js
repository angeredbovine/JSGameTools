function SpritesheetFile(path)
{

	FileData.call(this, path);

	this.sheet = new Spritesheet();

	this.images = [];
	this.animations = [];

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

	//Not all apps have workspaces, so FileData.AddFile calls .Show without a context argument
	if(!context)
	{

		Workspace.RenderWorkspace();

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

	this.sheet = new Spritesheet();
	this.sheet.Populate(json.sheet, false);

	this.animations = [];
	this.animations= json.animations.slice(0);

	for(var i = 0; i < json.images.length; i++)
	{

		var index = i;
		var image = json.images[i];

		loaded[image.index] = false;

		this.images[image.index] = new ImageData(null, image.duration, image.x, image.y, image.width, image.height);
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

FileData.Construct = function(path)
{

        return new SpritesheetFile(path);

}
