function Circle(x, y, rad)
{

	Shape.call(this, x, y);

	this.Radius((rad ? rad : 0));

}

Circle.prototype = Object.create(Shape.prototype);
Circle.prototype.constructor = Circle;

Circle.prototype.Clone = function()
{

	return new Circle(this.X(), this.Y(), this.Radius());

}

Circle.prototype.Radius = function(r)
{

	if(r === undefined)
	{

		return this.radius;

	}

	this.radius = r;

	return;

}

Circle.prototype.IntersectsCircle = function(circle)
{

	var dist = Vector2.Sum(circle.Position(), this.Position().Scale(-1));

	return (dist.LengthSquared() <= ((this.Radius() * this.Radius()) + (2 * this.Radius() * circle.Radius()) + (circle.Radius() * circle.Radius())));

}

Circle.prototype.ContainsPoint = function(point)
{

	var dist = Vector2.Sum(point, this.Position().Scale(-1));

	return (dist.LengthSquared() <= (this.Radius() * this.Radius()));

}

Circle.prototype.MinX = function()
{

	return this.X() - this.Radius();

}

Circle.prototype.MaxX = function()
{

	return this.X() + this.Radius();

}

Circle.prototype.MinY = function()
{

	return this.Y() - this.Radius();

}

Circle.prototype.MaxY = function()
{

	return this.Y() + this.Radius();

}

Circle.prototype.Render = function(context, color, width, borderColor)
{

	context.beginPath();

	context.arc(this.X(), this.Y(), this.Radius(), 0, 2 * Math.PI, false);
	context.fillStyle = color;

	context.fill();

	if(typeof width && typeof borderColor)
	{

		context.lineWidth = width;
		context.strokeStyle = borderColor;
		context.stroke();

	}

}

Circle.prototype.Type = function()
{

	return CONST_SHAPE_CIRCLE;

}
