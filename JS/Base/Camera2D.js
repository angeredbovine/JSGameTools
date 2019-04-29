function Camera2D(bounds, view)
{

    this.Bounds((typeof bounds !== 'undefined' ? bounds : new Box()));
    this.View((typeof view !== 'undefined' ? view : new Box()));

}

Camera2D.prototype.View = function(v)
{

	if(v === undefined)
	{

		return this.view;

	}

	this.view = v;

	return;

}

Camera2D.prototype.Position = function()
{

        return this.View().Position();

}

Camera2D.prototype.X = function(x)
{

	if(x === undefined)
	{

		return this.View().X();

	}

	this.View().X(x);

	return;

}

Camera2D.prototype.Y = function(y)
{

	if(y === undefined)
	{

		return this.View().Y();

	}


	this.View().Y(y);

	return;

}

Camera2D.prototype.Bounds = function(b)
{

	if(b === undefined)
	{

		return this.bounds;

	}

	this.bounds = b;

	return;

}

Camera2D.prototype.Move = function(v)
{

	this.X(this.X() + v.X());
	this.Y(this.Y() + v.Y());

	this.Bound();

}

Camera2D.prototype.Center = function(focus)
{

        this.X(focus.X() - this.View().Width() / 2);
        this.Y(focus.Y() - this.View().Height() / 2);

        this.Bound();

}

Camera2D.prototype.Bound = function()
{

        if(this.View().X() < this.Bounds().X())
        {

                this.View().X(this.Bounds().X());

        }

        if(this.View().Y() < this.Bounds().Y())
        {

                this.View().Y(this.Bounds().Y());

        }

        if(this.View().X() + this.View().Width() > this.Bounds().X() + this.Bounds().Width())
        {

                this.View().X(this.Bounds().X() + this.Bounds().Width() - this.View().Width());

        }

        if(this.View().Y() + this.View().Height() > this.Bounds().Y() + this.Bounds().Height())
        {

                this.View().Y(this.Bounds().Y() + this.Bounds().Height() - this.View().Height());

        }

}

Camera2D.prototype.Shake = function(magnitude)
{

        this.View().X(this.View().X() + (Math.cos(Timer.LifetimeMilliseconds()) * magnitude));
        this.View().Y(this.View().Y() + (Math.sin(Timer.LifetimeMilliseconds()) * magnitude));

}
