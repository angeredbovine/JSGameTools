var CONST_FRAME_RATE = 60;
var CONST_FRAME_DURATION = 1.0 / CONST_FRAME_RATE;
var CONST_MAX_FRAME_DURATION = 1000.0 / 240;
var CONST_PANIC = 10;

function GameLoop(time, game)
{

	if(!GameLoop.initialized || time < 0)
	{

		GameLoop.initialized = true;

		GameLoop.delta = 0;
		GameLoop.lastFrame = time;

		GameLoop.game = game;

	}

	if(time < GameLoop.lastFrame + CONST_MAX_FRAME_DURATION)
	{

		requestAnimationFrame(GameLoop);
		return;

	}

	GameLoop.delta += (time - GameLoop.lastFrame);
	GameLoop.lastFrame = time;

	var numUpdates = 0;
	while (GameLoop.delta >= CONST_FRAME_DURATION)
	{

		GameLoop.game.Update(CONST_FRAME_DURATION);

		GameLoop.delta -= CONST_FRAME_DURATION;

		SoundManager.ProcessSoundMessages();

		numUpdates++;
		if(numUpdates >= CONST_PANIC)
		{

			GameLoop.delta = 0;

		}

	}

	Input.Pump();

	GameLoop.game.Render();

	requestAnimationFrame(GameLoop);
	return;

}

GameLoop.Reset = function()
{

	GameLoop.initialized = false;

	GameLoop.delta = 0;
	GameLoop.lastFrame = 0;

	Messenger.StartMessenger();

}

GameLoop.Pause = function()
{

	Timer.Pause();

	if(GameLoop.initialized)
	{

		GameLoop.game.Pause();

	}

}

GameLoop.Unpause = function()
{

	if(GameLoop.initialized && GameLoop.game.UnpauseCondition())
	{

		Timer.Unpause();

		GameLoop.game.Unpause();

	}

}

GameLoop.Reset();
