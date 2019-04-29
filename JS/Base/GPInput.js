const CONST_GP_INPUT_TYPE = "GP";
const CONST_DEADZONE = 0.25;

function ControllerDeadzone(axisValue, deadzone)
{

	if(Math.abs(axisValue) < deadzone)
	{

		return 0;

	}


	var newValue = axisValue - Math.sign(axisValue) * deadzone;

	return (newValue / (1.0 - deadzone));

}


function ControllerFromIndex(index)
{

	return navigator.getGamepads()[index];

}

function ControllerDigitalDown(controller, index)
{

	return (controller.buttons[index]);

}

function GPInput(controllerIndex)
{

	Input.call(this);

 	this.index = controllerIndex;
 	this.controller = ControllerFromIndex(this.index);
 	this.lastController = this.controller;

}

GPInput.prototype = Object.create(Input.prototype);
GPInput.prototype.constructor = GPInput;

GPInput.prototype.DirectionCount = function(index)
{

	if(!this.controller || !this.controller.axes)
	{

		Logger.LogError("Attempting to access controller (" + this.index + ") that is not recognized.");

		return 0;

	}

	return (this.controller.axes.length / 2);

}

GPInput.prototype.DirectionalInput = function(index)
{

	if(!this.controller || !this.controller.axes || !this.controller.axes[index])
	{

		Logger.LogError("Attempting to access controller (" + this.index + ") or axis (" + index + ") that is not recognized.");

		return new Vector2();

	}

	var dir = new Vector2();

	dir.X(ControllerDeadzone(this.controller.axes[index], CONST_DEADZONE));
	dir.Y(ControllerDeadzone(this.controller.axes[index + 1], CONST_DEADZONE));

	return dir;

}

GPInput.prototype.DigitalCount = function()
{
  
	if(!this.controller || !this.controller.buttons)
	{

		Logger.LogError("Attempting to access controller (" + this.index + ") that is not recognized.");

		return 0;
	
	}

	return (this.controller.buttons.length);

}

GPInput.prototype.DigitalDown = function(index)
{

	if(!this.controller || !this.controller.buttons || !this.controller.buttons[index])
	{

		Logger.LogError("Attempting to access controller (" + this.index + ") or button (" + index + ") that is not recognized.");


		return false;

	}

	return ControllerDigitalDown(this.controller, index);

}

GPInput.prototype.DigitalPress = function(index)
{

	if(!this.controller || !this.controller.buttons || !this.controller.buttons[index])
	{

		Logger.LogError("Attempting to access controller (" + this.index + ") or button (" + index + ") that is not recognized.");

		return false;

	}

	return (ControllerDigitalDown(this.controller, index) && !ControllerDigitalDown(this.lastController, index));

}

GPInput.prototype.CursorLocation = function()
{

	return new Vector2();

}

GPInput.prototype.CursorDigitalDown = function(index)
{

	return false;

}

GPInput.prototype.CursorDigitalPress = function(index)
{

	return false;

}

GPInput.prototype.Pump = function()
{

	this.lastController = this.controller;
	this.controller = ControllerFromIndex(this.index);

}

GPInput.prototype.Type = function()
{

	return CONST_GP_INPUT_TYPE;

}

window.addEventListener("gamepadconnected", function(e)
{

	Logger.LogInfo("Controller connected at index " + e.gamepad.index);

});

window.addEventListener("gamepaddisconnected", function(e)
{

	Logger.LogInfo("Controller disconnected at index " + e.gamepad.index);

	delete gp_input_controllers[e.gamepad.index];

});
