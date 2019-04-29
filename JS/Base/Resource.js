function Resource()
{

	this.populated = true;

}

Resource.prototype.Load = function(locator)
{

	this.populated = false;

	DB.LoadResource(locator, this);

}

Resource.prototype.Populate = function(json)
{

	Logger.LogError("Attempting to populate abstract Resource class.");

}

Resource.prototype.FinishPopulation = function(proceed)
{

	if(!proceed)
	{

		this.populated = true;

	}

}

Resource.prototype.Loaded = function()
{

	return this.populated;

}
