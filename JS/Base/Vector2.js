function Vector2(x, y)
{

	this.X((x ? x : 0));
	this.Y((y ? y : 0));

}

Vector2.Sum = function(vecL, vecR)
{

	return new Vector2(vecL.X() + vecR.X(), vecL.Y() + vecR.Y());

}

Vector2.prototype.X = function(x)
{

	if(x === undefined)
	{

		return this.x;

	}

	this.x = x;

	return;

}

Vector2.prototype.Y = function(y)
{

	if(y === undefined)
	{

		return this.y;

	}

	this.y = y;

	return;

}

Vector2.prototype.Scale = function(s)
{

	return new Vector2(this.X() * s, this.Y() * s);

}

Vector2.prototype.Dot = function(vec)
{

	return this.X() * vec.X() + this.Y() * vec.Y();

}

Vector2.prototype.LengthSquared = function()
{

	return (this.X() * this.X()) + (this.Y() * this.Y());

}

Vector2.prototype.Length = function()
{

	return Math.sqrt(this.LengthSquared());

}

Vector2.prototype.Rotate = function()
{

	//TODO

}
