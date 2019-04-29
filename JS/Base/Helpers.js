const CONST_ID_DELIMITER = "-";

const CONST_TERM_ADDITION_SYMBOL = "+";
const CONST_TERM_MULTIPLICATION_SYMBOL = "*";

const CONST_PIECEWISE_DELIMITER = "=";
const CONST_RANDOM_DELIMITER = "=";

Helpers.function_array = [];

Helpers.function_array[0] = {};
Helpers.function_array[0].code = "sin";
Helpers.function_array[0].func = Math.sin;

Helpers.function_array[1] = {};
Helpers.function_array[1].code = "cos";
Helpers.function_array[1].func = Math.cos;

function Helpers()
{

}

Helpers.TrimLocator = function(locator)
{

	return 	locator.substring(locator.indexOf("/") + 1);

}

Helpers.GenerateID = function(base)
{

	return base + CONST_ID_DELIMITER + (Helpers.id_counter++);

}

Helpers.id_counter = 0;

//Random float 0 inclusive, 1 exclusive.
Helpers.Random = function()
{

	return Math.random();

}

Helpers.RandomInteger = function(min, max)
{

	return Math.floor(Helpers.RandomFloat(min, max));

}

Helpers.RandomFloat = function(min, max)
{

	return min + (Helpers.Random() * (max - min));

}

Helpers.ConstantFunction = function(c)
{

	return function(time){ return c; };

}

Helpers.ParametrizeString = function(paramString)
{

	//Allow for the use of time as a variable in expressions. Returns it in seconds as opposed to milliseconds
	if(paramString == "t")
	{

		return function(time) { return 0.001 * time; };

	}

	//Trim outside parentheses
	if(paramString.charAt(0) == "(" && paramString.charAt(paramString.length - 1) == ")")
	{

		return Helpers.ParametrizeString(paramString.substring(1, paramString.length - 1));

	}

	//If there's an addition symbol, handle that case separately
	if(paramString.indexOf(CONST_TERM_ADDITION_SYMBOL) > -1)
	{

		var func = Helpers.AdditionParametrization(paramString);

		//Check if the method returned a function, if not, then we need to resolve it some other way
		if(func != null)
		{

			return func;

		}

	}

	//If there's a multiplication symbol, handle that case separately
	if(paramString.indexOf(CONST_TERM_MULTIPLICATION_SYMBOL) > -1)
	{

		var func = Helpers.MultiplicationParametrization(paramString);

		//Check if the method returned a function, if not, then we need to resolve it some other way
		if(func != null)
		{

			return func;

		}

	}

	//Return a constant function for numbers
	var numberConversion = parseFloat(paramString);
	if(!isNaN(paramString) && !isNaN(numberConversion))
	{

		return Helpers.ConstantFunction(numberConversion);

	}

	//Negate the resulting parametrization
	if(paramString.charAt(0) == '-')
	{

		var func = Helpers.ParametrizeString(paramString.substring(1));
		return function(time){ return -func(time); };

	}

	//Handle random number generation
	if(paramString.charAt(0) == 'r')
	{

		var integer = (paramString.charAt(1) == 'i');

		paramString = paramString.substring(2);

		var terms = paramString.split(CONST_RANDOM_DELIMITER);

		var min = parseFloat(terms[0]);
		var max = parseFloat(terms[1]);

		if(isNaN(min) || isNaN(max))
		{

			Logger.LogError("Random parametrization expected numerical parameters. Parameters: " + paramString);

			return Helpers.ConstantFunction(0);

		}

		return Helpers.ConstantFunction((integer ? Helpers.RandomInteger(Math.floor(min), Math.floor(max)) : Helpers.RandomFloat(min, max)));

	}

	//Invert the parametrization, logging an error whenever it is zero
	if(paramString.indexOf("1/") == 0)
	{

		var func = Helpers.ParametrizeString(paramString.substring(2));
		return function(time)
		{

			var value = func(time);

			if(value == 0)
			{

				Logger.LogError("Parametrization attempted to divide by 0.");

				return 0;

			}

			return 1 / value;

		};

	}

	//Process any appearances of predefined functions
	for(var i = 0; i < Helpers.function_array.length; i++)
	{

		if(paramString.indexOf(Helpers.function_array[i].code + '(') == 0 && paramString.charAt(paramString.length - 1) == ')')
		{

			paramString = paramString.substring(4, paramString.length - 1);
			var func = Helpers.ParametrizeString(paramString);

			return function(time) { return Helpers.function_array[i].func(func(time)); }

		}

	}

	Logger.LogError("Could not parametrize string. Parameters: " + paramString);

	return Helpers.ConstantFunction(0);

}

Helpers.PiecewiseParametrization = function(paramString)
{

	if(!paramString.charAt(0) == 'p')
	{

		Logger.LogError("Expected 'p' to lead parameters for piecewise parametrization. Parameters: " + paramString);

		return Helpers.ConstantFunction(0);

	}

	paramString = paramString.substring(1);
	var terms = paramString.split(CONST_PIECEWISE_DELIMITER);

	if(terms.length % 2 != 1)
	{

		Logger.LogError("Incorrect number of terms for piecewise parametrization. Expected an odd number. Parameters: " + paramString);

		return Helpers.ConstantFunction(0);

	}

	var data = [];
	data[0] = {};
	data[0].time = 0;
	data[0].func = Helpers.ParametrizeString(terms[0]);

	var numTerms = (terms.length  - 1) / 2;
	var oldTime = 0;

	for(var i = 1; i <= numTerms; i++)
	{

		data[i] = {};
		data[i].time = parseFloat(terms[(2 * i) - 1]);
		data[i].func = Helpers.ParametrizeString(terms[2 * i]);

		if(data[i].time <= oldTime)
		{

			Logger.LogError("Piecewise parametrizations require increasing times. Parameters: " + paramString);

			return Helpers.ConstantFunction(0);

		}

		oldTime = data[i].time;

	}

	return function(time)
	{

		var index = 0;
		while(index < data.length - 1 && data[index + 1].time <= time)
		{

			index += 1;

		}

		return data[index].func(time - data[index].time);

	};

}

Helpers.AdditionParametrization = function(paramString)
{

	var terms = Helpers.ParenthesesSymbolSplit(paramString, CONST_TERM_ADDITION_SYMBOL);

	if(terms.length <= 1)
	{

		//All addition is inside the parentheses, so we should ignore it
		return null;

	}

	for(var i = 0; i < terms.length; i++)
	{

		terms[i] = Helpers.ParametrizeString(terms[i]);

	}

	return function(time)
		{

			var sum = 0;

			for(var i = 0; i < terms.length; i++)
			{

				sum += terms[i](time);

			}

			return sum;

		};

}

Helpers.MultiplicationParametrization = function(paramString)
{

	var terms = Helpers.ParenthesesSymbolSplit(paramString, CONST_TERM_MULTIPLICATION_SYMBOL);

	if(terms.length <= 1)
	{

		//All multip[lication is inside the parentheses, so we should ignore it
		return null;

	}

	for(var i = 0; i < terms.length; i++)
	{

		terms[i] = Helpers.ParametrizeString(terms[i]);

	}

	return function(time)
		{

			var product = 1;

			for(var i = 0; i < terms.length; i++)
			{

				product *= terms[i](time);

			}

			return product;

		};

}

Helpers.CreateParametrization = function(paramString)
{

	paramString = paramString.toLowerCase();
	paramString = paramString.replace(/\s+/g, '');

	//Handle Piecewise
	if(paramString.charAt(0) == 'p')
	{

		return Helpers.PiecewiseParametrization(paramString);

	}

	return Helpers.ParametrizeString(paramString);

}

Helpers.ParenthesesSymbolSplit = function(str, symbol)
{

	var total_split = str.split(symbol);

	var split = [];
	var splitCount = 0;

	var numLeft = 0;
	var numRight = 0;

	var lastIndex = -1;

	for(var i = 0; i < total_split.length; i++)
	{

		numLeft += total_split[i].split("(").length;
		numRight += total_split[i].split(")").length;

		if(numLeft == numRight)
		{

			split[splitCount] = "";

			for(var j = lastIndex + 1; j <= i; j++)
			{

				split[splitCount] += total_split[j] + symbol;

			}

			split[splitCount] = split[splitCount].substring(0, split[splitCount].length - 1);

			lastIndex = i;
			splitCount += 1;

		}

	}

	return split;

}


Helpers.Create2DArray = function(width, height, def)
{

	var array = [];

	for(var i = 0; i < height; i++)
	{

		array[i] = [];

		for(var j = 0; j < width; j++)
		{

			array[i][j] = def;

		}

	}

	return array;

}
