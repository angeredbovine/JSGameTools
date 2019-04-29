const CONST_VIRTUAL_INPUT_TYPE = "Virtual";

function Input()
{

}

Input.prototype.DirectionCount = function()
{

	Logger.LogError("attempting to call virtual Input::DirectionCount method.");

	return -1;

}

Input.prototype.DirectionalInput = function(index)
{

	Logger.LogError("Attempting to call virtual Input::DirectionalInput method.");

	return new Vector2();

}

Input.prototype.DigitalCount = function()
{

	Logger.LogError("Attempting to call virtual Input::DigitalCount method.");

	return -1;

}

Input.prototype.DigitalDown = function(index)
{

	Logger.LogError("Attempting to call virtual Input::DigitalDown method.");

	return false;

}

Input.prototype.DigitalPress = function(index)
{

	Logger.LogError("Attempting to call virtual Input::DigitalPress method.");

	return false;

}

Input.prototype.CursorLocation = function()
{

	Logger.LogError("Attempting to call virtual Input::CursorLocationInput method.");

	return new Vector2();

}

Input.prototype.CursorDigitalDown = function(index)
{

	Logger.LogError("Attempting to call virtual Input::CursorDigitalDown method.");

	return false;

}

Input.prototype.CursorDigitalPress = function(index)
{

	Logger.LogError("Attempting to call virtual Input::CursorDigitalPress method.");

	return false;

}

Input.prototype.Pump = function()
{

	Logger.LogError("Attempting to call virtual Input::Pump method.");

}

Input.prototype.Type = function()
{

	return CONST_VIRTUAL_INPUT_TYPE;

}

var m_input = new Input();

Input.RegisterInput = function(input)
{

	m_input = input;

}

Input.DirectionalInput = function(index)
{

	return m_input.DirectionalInput(index);

}

Input.DigitalDown = function(index)
{

	return m_input.DigitalDown(index);

}

Input.DigitalPress = function(index)
{

	return m_input.DigitalPress(index);

}

Input.CursorLocation = function()
{

	return m_input.CursorLocation();

}

Input.CursorDigitalDown = function(index)
{

	return m_input.CursorDigitalDown(index);

}

Input.CursorDigitalPress = function(index)
{

	return m_input.CursorDigitalPress(index);

}

Input.Pump = function()
{

	m_input.Pump();

}

Input.Type = function()
{

	return m_input.Type();

}
