const CONST_SPRITESHEET_EMPTY = -1;
const CONST_SPRITESHEET_REPLAY = -2;

function FrameData(x, y, w, h, oX, oY, duration)
{

	this.box = new Box(x, y, w, h);
	this.offset = new Vector2(oX, oY);
	this.duration = duration;

}

FrameData.prototype.Duration = function()
{

	return this.duration;

}

FrameData.prototype.Data = function()
{

	return {"box": this.box, "offset": this.offset};

}

function Spritesheet()
{

	Resource.call(this);

	this.frames = [];
	this.animations = [];

}

Spritesheet.prototype = Object.create(Resource.prototype);
Spritesheet.prototype.constructor = Spritesheet;

Spritesheet.prototype.Populate = function(json, proceed)
{

	for(var i = 0; i < json.frames.length; i++)
	{

		var box = json.frames[i].box;
		var offset = json.frames[i].offset;
		this.frames[i] = new FrameData(box.x, box.y, box.width, box.height, offset.x, offset.y, json.frames[i].duration);

	}

	this.animations = json.animations.slice(0);

	this.FinishPopulation(proceed);

}

Spritesheet.prototype.Play = function(animation, loop, start)
{

	if(animation >= 0 && animation <= this.animations.length)
	{

		var frame = 0;
		var time = Timer.RunningMilliseconds() - start;

		while(frame < this.animations[animation].length && time >= this.frames[this.animations[animation][frame]].Duration())
		{

			time = time - this.frames[this.animations[animation][frame]].Duration();
			frame += 1;

		}

		return (frame >= this.animations[animation].length ? ((loop ? CONST_SPRITESHEET_REPLAY : CONST_SPRITESHEET_EMPTY)) : frame);

	}

	Logger.LogError("Attempting to play invalid animation at index " + animation);

	return CONST_SPRITESHEET_EMPTY;

}

Spritesheet.prototype.Data = function(frame)
{

	if(frame >= 0 && frame < this.frames.length)
	{

		return this.frames[frame].Data();

	}

	Logger.LogError("Attempting to access frame at invalid index " + frame);

	return null;

}

function SheetReference(sheet)
{

	this.currentAnimation = CONST_SPRITESHEET_EMPTY;
	this.nextAnimation = CONST_SPRITESHEET_EMPTY;
	this.loop = false;
	this.startTime = 0;

	this.currentFrame = CONST_SPRITESHEET_EMPTY;

	this.sheet = sheet;

}

SheetReference.prototype.Playing = function()
{

	return !(this.currentFrame == CONST_SPRITESHEET_EMPTY);

}

SheetReference.prototype.Promise = function(current, next, loop)
{

	this.currentAnimation = current;
	this.nextAnimation = next;
	this.loop = loop;

	this.Start();
	this.Lookup();

}

SheetReference.prototype.Start = function()
{

	this.startTime = Timer.RunningMilliseconds();
	this.currentFrame = 0;

}

SheetReference.prototype.Lookup = function()
{

	this.currentFrame = this.sheet.Play(this.currentAnimation, (this.nextAnimation != CONST_SPRITESHEET_EMPTY ? false : this.loop), this.startTime);

	if(this.currentFrame == CONST_SPRITESHEET_REPLAY)
	{

		this.Start();

	}

}

SheetReference.prototype.Update = function(delta)
{

	if(this.currentAnimation != CONST_SPRITESHEET_EMPTY)
	{

		this.Lookup();

		if(this.currentFrame == CONST_SPRITESHEET_EMPTY)
		{

			if(this.nextAnimation != CONST_SPRITESHEET_EMPTY)
			{

				this.currentAnimation = this.nextAnimation;
				this.nextAnimation = CONST_SPRITESHEET_EMPTY;

				this.Start();

			}
			else
			{

				this.currentAnimation = CONST_SPRITESHEET_EMPTY;

			}

		}

	}

}

SheetReference.prototype.Data = function()
{

	return this.sheet.Data(this.currentFrame);

}
