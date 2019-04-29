function ImageResource()
{

	this.image = new Image();

}

ImageResource.prototype = Object.create(Resource.prototype);
ImageResource.prototype.constructor = ImageResource;

ImageResource.prototype.Load = function(locator)
{

	this.populated = false;

	DB.LoadImage(locator, this);

}

ImageResource.prototype.Populate = function(json)
{

	var caller = this;
	this.image.onload = function()
	{

		caller.FinishPopulation(false);

		GameLoaded();

	};

	this.image.src = json.src;

}

ImageResource.prototype.Image = function()
{

	return this.image;

}
