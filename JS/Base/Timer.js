var m_start = 0;
var m_pause = 0;

function Timer()
{

}

Timer.Time = function()
{

	return Date.now();

}

Timer.Reset = function()
{

	m_start = Date.now();
	m_running = m_start;
	m_pause = 0;

}

Timer.LifetimeMilliseconds = function()
{

	return Timer.Time() - m_start;

}

Timer.RunningMilliseconds = function()
{

	if(m_pause > 0)
	{

		return m_pause - m_running;

	}

	return Timer.Time() - m_running;

}

Timer.Pause = function()
{

	this.pauseTime = Timer.Time();

}

Timer.Unpause = function()
{

	m_running = Timer.Time() - Timer.RunningMilliseconds();
	m_pause = 0;

}
