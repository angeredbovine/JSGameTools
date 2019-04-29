const CONST_MOBILE_INPUT_TYPE = "Mobile";

const CONST_ACCEL_BETA_DEADZONE = 5;
const CONST_ACCEL_GAMMA_DEADZONE = 5;
const CONST_ACCEL_BETA_MAX = 15;
const CONST_ACCEL_GAMMA_MAX = 15;

var m_accel_beta = 0;
var m_accel_gamma = 0;

var m_base_beta = null;
var m_base_gamma = null;

function AccelerationDeadzone(accel, deadzone, max)
{

	if(Math.abs(accel) < deadzone)
	{

		return 0;

	}

	if(Math.abs(accel) > max)
	{

		return Math.sign(accel);

	}

	var normalized_accel = accel - Math.sign(accel) * deadzone;
	normalized_accel = normalized_accel / (max - deadzone);

	return normalized_accel;

}

function MobileInput()
{

	Input.call(this);

	this.digitals = [];
	this.directions = [];

}

MobileInput.prototype = Object.create(Input.prototype);
MobileInput.prototype.constructor = MobileInput;

MobileInput.AccelerometerDirection = function()
{

	if(m_base_beta == null || m_base_gamma == null)
	{

		return new Vector2();

	}

	var direction = new Vector2();
	direction.Y(-AccelerationDeadzone(m_accel_gamma - m_base_gamma, CONST_ACCEL_GAMMA_DEADZONE, CONST_ACCEL_GAMMA_MAX));
	direction.X(AccelerationDeadzone(m_accel_beta - m_base_beta, CONST_ACCEL_BETA_DEADZONE, CONST_ACCEL_BETA_MAX));

	return direction;

}

MobileInput.GetAcceleration = function(acceleration)
{

	m_accel_x = acceleration.x;
	m_accel_y = acceleration.y;
	m_accel_z = acceleration.z;

}

MobileInput.HandleAccelerationError = function()
{

	Logger.LogError("Error attempting to get accelerometer data.");

}

function MobileDirection()
{
}

MobileDirection.prototype.Direction = function()
{
}

MobileDirection.prototype.Pump = function()
{
}

function MobileDigital()
{
}

MobileDigital.prototype.Down = function()
{
}

MobileDigital.prototype.Press = function()
{
}

MobileDigital.prototype.Pump = function()
{
}

MobileInput.prototype.DirectionCount = function()
{

	return this.directions.length + 1;

}


MobileInput.prototype.DirectionalInput = function(index)
{

	if(index > 0)
	{

		if(index > this.directions.length)
		{

			Logger.LogError("Attempting to access invalid mobile direction index (" + index + ")");

			return new Vector2();

		}

		return this.directions[index - 1].Direction();

	}

	return MobileInput.AccelerometerDirection();

}

MobileInput.prototype.DigitalCount = function()
{

	return this.digitals.length;

}

MobileInput.prototype.DigitalDown = function(index)
{

	if(index < 0 || index >= this.digitals.length)
	{

		Logger.LogError("Attempting to access invalid mobile digital index (" + index + ")");

		return false;

	}

	return this.digitals[index].Down();

}

MobileInput.prototype.DigitalPress = function(index)
{

	if(index < 0 || index >= this.digitals.length)
	{

		Logger.LogError("Attempting to access invalid mobile digital index (" + index + ")");

		return false;

	}

	return this.digitals[index].Press();

}

MobileInput.prototype.CursorLocation = function()
{

	return new Vector2();

}

MobileInput.prototype.CursorDigitalDown = function(index)
{

	return false;

}

MobileInput.prototype.CursorDigitalPress = function(index)
{

	return false;

}

MobileInput.prototype.Pump = function()
{

	for(var i = 0; i < this.digitals.length; i++)
	{

		this.digitals[i].Pump();

	}

	for(var i = 0; i < this.directions.length; i++)
	{

		this.directions[i].Pump();

	}

}

MobileInput.prototype.Type = function()
{

	return CONST_MOBILE_INPUT_TYPE;

}

window.addEventListener('deviceorientation', function(evt)
{

	m_accel_beta = evt.beta;
	m_accel_gamma = evt.gamma;

	if(m_base_beta == null)
	{

		m_base_beta = evt.beta;

	}

	if(m_base_gamma == null)
	{

		m_base_gamma = evt.gamma;

	}

});
