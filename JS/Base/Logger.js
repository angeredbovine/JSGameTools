const CONST_LOGGER_ERROR_COLOR = "color:red;";
const CONST_LOGGER_WARNING_COLOR = "color:orange;";
const CONST_LOGGER_DEBUG_COLOR = "color:green;";
const CONST_LOGGER_INFO_COLOR = "color:blue;";

function Logger()
{
}

Logger.Log = function(text, css)
{

	console.log("%c - " + CONST_GAME_NAME + " " + text, css);

}

Logger.LogError = function(err)
{

	Logger.Log("Error: " + err, CONST_LOGGER_ERROR_COLOR);

}

Logger.LogWarning = function(warn)
{

	Logger.Log("Warning: " + warn, CONST_LOGGER_WARNING_COLOR);

}

Logger.LogDebug = function(debug)
{

	Logger.Log("Debug: " + debug, CONST_LOGGER_DEBUG_COLOR);

}

Logger.LogInfo = function(info)
{

	Logger.Log("Info: " + info, CONST_LOGGER_INFO_COLOR);

}
