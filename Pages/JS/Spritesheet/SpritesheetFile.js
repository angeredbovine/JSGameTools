function SpritesheetFile(path)
{

	FileData.call(this, path);

	this.images = [];

}

SpritesheetFile.prototype = Object.create(FileData.prototype);
SpritesheetFile.prototype.constructor = SpritesheetFile;

SpritesheetFile.prototype.Show = function(context)
{

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

SpritesheetFile.prototype.Open = function(json)
{

}

SpritesheetFile.prototype.Save = function()
{

}

FileData.Construct = function(path)
{

        return new SpritesheetFile(path);

}
