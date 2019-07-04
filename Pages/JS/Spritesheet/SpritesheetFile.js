function ImageData(img, x, y, scaleX, scaleY)
{

	this.image = img;

	this.position = new Vector2(x, y);
	this.scaleX = scaleX;
	this.scaleY = scaleY;

}

function SpritesheetFile(path)
{

	FileData.call(this, path);

	this.images = [];

}

SpritesheetFile.prototype = Object.create(FileData.prototype);
SpritesheetFile.prototype.constructor = SpritesheetFile;

SpritesheetFile.prototype.Show = function(context)
{

}

SpritesheetFile.prototype.Save = function()
{

}

SpritesheetFile.prototype.AddImage = function(path, x, y, scaleX, scaleY)
{

	var file = this;

	var image = new Image();
	image.src = path;
	image.onload = function()
	{

		file.images.push(new ImageData(image, x, y, scaleX, scaleY));

		RenderWorkspace();

	}

}

FileData.Construct = function(path)
{

        return new SpritesheetFile(path);

}
