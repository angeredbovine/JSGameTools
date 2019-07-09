function SpritesheetFile(path)
{

	FileData.call(this, path);

	this.images = [];

}

SpritesheetFile.prototype = Object.create(FileData.prototype);
SpritesheetFile.prototype.constructor = SpritesheetFile;

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
