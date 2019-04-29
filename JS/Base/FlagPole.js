function FlagPole()
{

	this.nextFlag = 1;
	this.numFlags = 0;

	this.funcs = {};

}

FlagPole.prototype.NumFlags = function()
{

	return this.numFlags;

}

FlagPole.prototype.RegisterFlag = function()
{

	var currentFlag = this.nextFlag;

	this.nextFlag = this.nextFlag * 2;
	this.numFlags += 1;

	return currentFlag;

}

FlagPole.prototype.CheckFlag = function(flags, flag)
{

	return ((flags & flag) == flag);

}

FlagPole.prototype.TestFlag = function(flags, flag, expected)
{

	return ((flags & flag) == expected);

}

FlagPole.prototype.Combine = function(flags, flag)
{

	return flags | flag;

}

FlagPole.prototype.FlagByIndex = function(index)
{

	return Math.pow(2, index);

}

FlagPole.prototype.RegisterFunction = function(key, flag, func)
{

	if(typeof this.funcs[key] === "undefined")
	{

		this.funcs[key] = {};

	}

	this.funcs[key][flag] = func;

}

FlagPole.prototype.KeyFlagFunction = function(key, flag)
{

	return this.funcs[key][flag];

}

FlagPole.prototype.CanSlide = function(key, flags, parameters)
{

	for(var i = 0; i < this.numFlags; i++)
	{

		var flag = this.FlagByIndex(i);
		if(this.CheckFlag(flags, flag))
		{

			if(!this.KeyFlagFunction(key, flag)(parameters))
			{

				return false;

			}

		}

	}

	return true;

}

FlagPole.prototype.Slide = function(key, flags, parameters)
{

	for(var i = 0; i < this.numFlags; i++)
	{

		var flag = this.FlagByIndex(i);
		if(this.CheckFlag(flags, flag))
		{

			this.KeyFlagFunction(key, flag)(parameters);

		}

	}

} 
