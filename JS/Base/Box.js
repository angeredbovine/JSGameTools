const CONST_COLLISION_FP_ERROR = 0.0001;

function Box(x, y, w, h)
{

	Shape.call(this, x, y);

	this.Width((w ? w : 0));
	this.Height((h ? h : 0));

}

Box.prototype = Object.create(Shape.prototype);
Box.prototype.constructor = Box;

Box.prototype.Clone = function()
{

	return new Box(this.X(), this.Y(), this.Width(), this.Height());

}

Box.prototype.Width = function(w)
{

	if(w === undefined)
	{

		return this.width;

	}

	this.width = w;

	return;

}

Box.prototype.Height = function(h)
{

	if(h === undefined)
	{

		return this.height;

	}

	this.height = h;

	return;

}

Box.prototype.Dimensions = function()
{

	return new Vector2(this.Width(), this.Height());

}

Box.prototype.Center = function()
{

	return Vector2.Sum(this.Position(), this.Dimensions().Scale(0.5));

}

Box.prototype.IntersectsBox = function(box)
{

	if(box.X() + box.Width() <= this.X())
	{

		return false;

	}

	if(box.X() >= this.X() + this.Width())
	{

		return false;

	}

	if(box.Y() + box.Height() <= this.Y())
	{

		return false;

	}

	if(box.Y() >= this.Y() + this.Height())
	{

		return false;

	}

	return true;

}

Box.prototype.CollisionCorrection = function(box, boxV, thisV)
{

	var correction = new Vector2();

	if(box.X() + box.Width() <= this.X())
	{

		return correction;

	}

	if(box.X() >= this.X() + this.Width())
	{

		return correction;

	}

	if(box.Y() + box.Height() <= this.Y())
	{

		return correction;

	}

	if(box.Y() >= this.Y() + this.Height())
	{

		return correction;

	}

	if (boxV.X() >= 0)
	{

		correction.X(box.X() - this.X() - this.Width());

	}
	else if (boxV.X() < 0)
	{

		correction.X(box.X() + box.Width() - this.X());

	}

	if (boxV.Y() > 0)
	{

		correction.Y(box.Y() - this.Y() - this.Height());

	}
	else if (boxV.Y() < 0)
	{

		correction.Y(box.Y() + box.Height() - this.Y());

	}

	if (Math.abs(correction.X()) >= Math.abs(correction.Y()) && correction.Y() != 0 && !(correction.Y() > 0 && thisV.Y() < 0 && boxV.Y() >= -CONST_COLLISION_FP_ERROR))
	{

		correction.X(0);

	}
	else
	{

		correction.Y(0);

	}

	return correction;

}

Box.prototype.ContainsPoint = function(point)
{

	if(point.X() <= this.X())
	{

		return false;

	}

	if(point.X() >= this.X() + this.Width())
	{

		return false;

	}

	if(point.Y() <= this.Y())
	{

		return false;

	}

	if(point.Y() >= this.Y() + this.Height())
	{

		return false;

	}

	return true;

}

Box.prototype.MinX = function()
{

	return this.X();

}

Box.prototype.MaxX = function()
{

	return this.X() + this.Width();

}

Box.prototype.MinY = function()
{

	return this.Y();

}

Box.prototype.MaxY = function()
{

	return this.Y() + this.Height();

}

Box.prototype.Type = function()
{

	return CONST_SHAPE_BOX;

}

Box.prototype.Render = function(context, fillColor, width, borderColor)
{

	context.beginPath();
    context.rect(this.X(), this.Y(), this.Width(), this.Height());
	context.fillStyle = fillColor;
	context.fill();

	if(typeof width && typeof borderColor)
	{

        context.lineWidth = width;
        context.strokeStyle = borderColor;
		context.stroke();

	}

}
