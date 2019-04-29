const CONST_MK_INPUT_TYPE = "MK";

var m_keys = {};
var m_last_keys = {};

var m_mouse_buttons = {};
var m_last_mouse_buttons = {};
var m_mouseX = 0;
var m_mouseY = 0;

function MKInput()
{

	Input.call(this);

	this.digitals = [];
	this.directions = [];

}

MKInput.prototype = Object.create(Input.prototype);
MKInput.prototype.constructor = MKInput;

function MKDirection(u, d, l, r)
{

	this.upKey = u;
	this.downKey = d;
	this.leftKey = l;
	this.rightKey = r;

}

MKInput.prototype.SetDigital = function(key)
{

	this.digitals.push(key);

}

MKInput.prototype.SetDirection = function(u, d, l, r)
{

	this.directions.push(new MKDirection(u, d, l, r));

}

MKDirection.prototype.Direction = function()
{

	var dir = new Vector2();

	if(m_keys[this.upKey])
	{

		dir.Y(dir.Y() - 1);

	}

	if(m_keys[this.downKey])
	{

		dir.Y(dir.Y() + 1);

	}

	if(m_keys[this.leftKey])
	{

		dir.X(dir.X() - 1);

	}

	if(m_keys[this.rightKey])
	{

		dir.X(dir.X() + 1);

	}

	return dir;

}

MKInput.prototype.DirectionCount = function()
{

	return this.directions.length;

}

MKInput.prototype.DirectionalInput = function(index)
{

	if(index < 0 || index >= this.directions.length)
	{

		return new Vector2();

	}

	return this.directions[index].Direction(this);

}

MKInput.prototype.DigitalCount = function()
{

	return this.digitals.length;

}

MKInput.prototype.DigitalDown = function(index)
{

	return m_keys[this.digitals[index]];

}

MKInput.prototype.DigitalPress = function(index)
{

	return m_keys[this.digitals[index]] && !m_last_keys[this.digitals[index]];

}

MKInput.prototype.CursorLocation = function()
{

	return new Vector2(m_mouseX, m_mouseY);

}

MKInput.prototype.CursorDigitalDown = function(index)
{

	return m_mouse_buttons[index];

}

MKInput.prototype.CursorDigitalPress = function(index)
{

	return m_mouse_buttons[index] && !m_last_mouse_buttons[index];

}

MKInput.prototype.Pump = function()
{

	m_last_keys = Object.assign({}, m_keys);
	m_last_mouse_buttons = Object.assign({}, m_mouse_buttons);

}

MKInput.prototype.Type = function()
{

	return CONST_MK_INPUT_TYPE;

}

MKInput.KeyDownHandler = function(evt)
{

	m_keys[evt.keyCode] = true;

}

MKInput.KeyUpHandler = function(evt)
{

	m_keys[evt.keyCode] = false;

}

MKInput.MouseButtonDownHandler = function(evt)
{

	m_mouse_buttons[evt.which] = true;

}

MKInput.MouseButtonUpHandler = function(evt)
{

	m_mouse_buttons[evt.which] = false;

}

MKInput.MouseLocationHandler = function(evt)
{

	var rect = document.getElementById(CONST_CANVAS_ID).getBoundingClientRect();

	m_mouseX = evt.clientX - rect.left;
	m_mouseY = evt.clientY - rect.top;

}

document.addEventListener("keydown", MKInput.KeyDownHandler, false);
document.addEventListener("keyup", MKInput.KeyUpHandler, false);
document.addEventListener("mousedown", MKInput.MouseButtonDownHandler, false);
document.addEventListener("mouseup", MKInput.MouseButtonUpHandler, false);
document.addEventListener("mousemove", MKInput.MouseLocationHandler, false);
