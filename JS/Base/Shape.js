const CONST_SHAPE_SHAPE = "Shape";
const CONST_SHAPE_CIRCLE = "Circle";
const CONST_SHAPE_BOX = "Box";
const CONST_SHAPE_POLYGON = "Polygon";

function Shape(x, y)
{

	this.Position(new Vector2((x ? x : 0), (y ? y : 0)));

	this.shift = new Vector2();

}

Shape.prototype.Clone = function()
{

	Logger.LogError("Trying to clone virtual shape.");

	return new Shape(this.X(), this.Y());

}

Shape.ShapeFactory = function(json)
{

	if(json.type == CONST_SHAPE_CIRCLE)
	{

		return new Circle(json.x, json.y, json.radius);

	}

	if(json.type == CONST_SHAPE_BOX)
	{

		return new Box(json.x, json.y, json.width, json.height);

	}

	if(json.type == CONST_SHAPE_POLYGON)
	{

		return new Polygon(json.x, json.y, json.vertices);

	}

	Logger.LogError("Attempting to create shape of unknown type: " + json.type);

	return new Shape(0, 0);

}

Shape.prototype.X = function(x)
{

	if(x === undefined)
	{

		return this.Position().X();

	}

	this.position.X(x);

	return;

}

Shape.prototype.Y = function(y)
{

	if(y === undefined)
	{

		return this.Position().Y();

	}

	this.position.Y(y);

	return;

}

Shape.prototype.Position = function(p)
{

	if(p === undefined)
	{

		if(this.shift.X() != 0 || this.shift.Y() != 0)
		{

			return Vector2.Sum(this.position, this.shift);

		}

		return this.position;

	}

	this.position = p;

	return;

}

Shape.prototype.Shift = function(v)
{

	this.shift = v;

}

Shape.prototype.ClearShift = function()
{

	this.shift = new Vector2();

}

Shape.prototype.Intersects = function(shape)
{

	if(this.Type() == CONST_SHAPE_BOX && shape.Type() == CONST_SHAPE_BOX)
	{

		return this.IntersectsBox(shape);

	}

	var thisShape = (this.Type() == CONST_SHAPE_BOX ? Polygon.FromBox(this) : this);
	var thatShape = (shape.Type() == CONST_SHAPE_BOX ? Polygon.FromBox(shape) : shape);

	if(thatShape.Type() == CONST_SHAPE_CIRCLE)
	{

		return thisShape.IntersectsCircle(thatShape);

	}
	else if(thisShape.Type() == CONST_SHAPE_CIRCLE)
	{

		return thatShape.IntersectsCircle(thisShape);

	}
	else if(thisShape.Type() == CONST_SHAPE_POLYGON && thatShape.Type() == CONST_SHAPE_POLYGON)
	{

		return thisShape.IntersectsPolygon(thatShape);

	}

	Logger.LogError("Attempting to check intersection with shapes typed " + thisShape.Type() + " and " + thatShape.Type());

	return false;

}

Shape.prototype.MinX = function()
{

	Logger.LogError("Attempting to check min X of virtual shape.");

	return 0;

}

Shape.prototype.MaxX = function()
{

	Logger.LogError("Attempting to check max X of virtual shape.");

	return 0;

}

Shape.prototype.MinY = function()
{

	Logger.LogError("Attempting to check min Y of virtual shape.");

	return 0;

}

Shape.prototype.MaxY = function()
{

	Logger.LogError("Attempting to check max Y of virtual shape.");

	return 0;

}

Shape.prototype.ContainsPoint = function(point)
{

	Logger.LogError("Attempting to check if virtual shape contains a point.");

	return false;

}

Shape.prototype.Render = function(context, color, width, borderColor)
{

	Logger.LogError("Attempting to render virtual shape.");

}

Shape.prototype.Type = function()
{

	return CONST_SHAPE_SHAPE;

}
