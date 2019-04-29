function Polygon(x, y, vertices)
{

	Shape.call(this, x, y);

	this.vertices = vertices.slice(0);

}

Polygon.prototype = Object.create(Shape.prototype);
Polygon.prototype.constructor = Polygon;

Polygon.prototype.Clone = function()
{

	var vertices = [];
	for(var i = 0; i < this.vertices.length; i++)
	{

		vertices[i] = new Vector2(this.vertices[i].X(), this.vertices[i].Y());

	}

	return new Polygon(this.X(), this.Y(), vertices);

}

Polygon.FromBox = function(box)
{

	var x = box.X();
	var y = box.Y();

	var vertices = [];
	vertices[0] = new Vector2(0, 0);
	vertices[1] = new Vector2(box.Width(), 0);
	vertices[2] = new Vector2(box.Width(), box.Height());
	vertices[3] = new Vector2(0, box.Height());

	return new Polygon(x, y, vertices);

}

Polygon.prototype.IntersectsCircle = function(circle)
{

	var pos = circle.Position();

	if(this.ContainsPoint(pos))
	{

		return true;

	}

	var start;
	var end = Vector2.Sum(this.Position(), this.vertices[this.vertices.length - 1]);
	for(var i = 0; i < this.vertices.length; i++)
	{

		start = end;
		end = Vector2.Sum(this.Position(), this.vertices[i]);

		var dX = end.X() - start.X();
		var dY = end.Y() - start.Y();

		var t = ((pos.X() - start.X()) * dX + (pos.Y() - start.Y()) * dY) / ((dX * dX) + (dY * dY));

		if(t < 0)
		{

			dX = pos.X() - start.X();
			dY = pos.Y() - start.Y();

		}
		else if (t > 1)
		{

			dX = pos.X() - end.X();
			dY = pos.Y() - end.Y();

		}
		else
		{

			dX = pos.X() - start.X() - t * dX;
			dY = pos.Y() - start.Y() - t * dY;

		}

		if((dX * dX) + (dY * dY) < circle.Radius() * circle.Radius())
		{

			return true;

		}

	}

	return false;

}

Polygon.NoOverlap = function(poly1, poly2, normal)
{

	var min1 = Vector2.Sum(poly1.Position(), poly1.vertices[0]).Dot(normal);
	var max1 = min1;

	var min2 = Vector2.Sum(poly2.Position(), poly2.vertices[0]).Dot(normal);
	var max2 = min2;

	for(var i = 1; i < poly1.vertices.length; i++)
	{

		var dot = Vector2.Sum(poly1.Position(), poly1.vertices[i]).Dot(normal);

		min1 = Math.min(min1, dot);
		max1 = Math.max(max1, dot);

	}

	for(var i = 1; i < poly2.vertices.length; i++)
	{

		var dot = Vector2.Sum(poly2.Position(), poly2.vertices[i]).Dot(normal);

		min2 = Math.min(min2, dot);
		max2 = Math.max(max2, dot);

	}

	return (max1 < min2) || (max2 < min1);

}

Polygon.prototype.IntersectsPolygon = function(poly)
{

	var normal;

	var start;
	var end = this.vertices[this.vertices.length - 1];
	for(var i = 0; i < this.vertices.length; i++)
	{

		start = end;
		end = this.vertices[i];
		normal = new Vector2(start.Y() - end.Y(), end.X() - start.X());

		if(Polygon.NoOverlap(this, poly, normal))
		{

			return false;

		}

	}

	end = poly.vertices[poly.vertices.length - 1];
	for(var i = 0; i < poly.vertices.length; i++)
	{

		start = end;
		end = poly.vertices[i];
		normal = new Vector2(start.Y() - end.Y(), end.X() - start.X());

		if(Polygon.NoOverlap(this, poly, normal))
		{

			return false;

		}

	}

	return true;

}

Polygon.prototype.ContainsPoint = function(point)
{

	var inside = false;

	var normalized_point = new Vector2(point.X() - this.X(), point.Y() - this.Y())

	var start;
	var end = this.vertices[this.vertices.length - 1];
	for(var i = 0; i < this.vertices.length; i++)
	{

		start = end;
		end = this.vertices[i];

		if(((end.Y() > normalized_point.Y()) != (start.Y() > normalized_point.Y())) && (normalized_point.X() < ((start.X() - end.X()) * ((normalized_point.Y() - end.Y()) / (start.Y() - end.Y()))) + end.X()))
		{

			inside = !inside;

		}

	}

	return inside;

}

Polygon.prototype.MinX = function()
{

	var minX = this.X();

	for(var i = 0; i < this.vertices.length; i++)
	{

		var min = this.X() + this.vertices[i].X();
		if(min < minX)
		{

			minX = min;

		}

	}

	return minX;

}

Polygon.prototype.MaxX = function()
{

	var maxX = this.X();

	for(var i = 0; i < this.vertices.length; i++)
	{

		var max = this.X() + this.vertices[i].X();
		if(max > maxX)
		{

			maxX = max;

		}

	}

	return maxX;


}

Polygon.prototype.MinY = function()
{

	var minY = this.Y();

	for(var i = 0; i < this.vertices.length; i++)
	{

		var min = this.Y() + this.vertices[i].Y();
		if(min < minY)
		{

			minY = min;

		}

	}

	return minY;


}

Polygon.prototype.MaxY = function()
{

	var maxY = this.Y();

	for(var i = 0; i < this.vertices.length; i++)
	{

		var max = this.Y() + this.vertices[i].Y();
		if(max > maxY)
		{

			maxY = max;

		}

	}

	return maxY;


}

Polygon.prototype.Type = function()
{

	return CONST_SHAPE_POLYGON;

}

Polygon.prototype.Render = function(context, fillColor, width, borderColor)
{

	var vector = Vector2.Sum(this.Position(), this.vertices[0]);

	context.beginPath();

	context.moveTo(vector.X(), vector.Y());
	for(var i = 0; i < this.vertices.length; i++)
	{

		vector = Vector2.Sum(this.Position(), this.vertices[i]);
		context.lineTo(vector.X(), vector.Y());

	}
	context.closePath();

	context.fillStyle = fillColor;
	context.fill();

	if(typeof width && typeof borderColor)
	{

		context.lineWidth = width;
        context.strokeStyle = borderColor;
		context.stroke();

	}

}
