const CONST_MESSAGE_TYPE_SOUNDEFFECT = "SoundEffect";
const CONST_MESSAGE_TYPE_MUSIC = "Music";

function SoundEffect()
{

    this.loaded = false;
    this.locator = "";

    this.buffer = null;

}

SoundEffect.prototype.Load = function(locator)
{
    //TODO: May want to abstract this out so it can be different in different builds
    var caller = this;

    this.loaded = false;

    this.locator = locator;

    var request = new XMLHttpRequest();
    request.open('GET', "DB/" + locator, true);
    request.responseType = 'arraybuffer';

    request.onload = function()
    {

        SoundManager.context.decodeAudioData(request.response, caller.FillBuffer.bind(caller), caller.BufferError.bind(caller));

    }
    request.send();

}

SoundEffect.prototype.FillBuffer = function(data)
{

    this.buffer = data;

    this.loaded = true;

    GameLoaded();

}

SoundEffect.prototype.BufferError = function(err)
{

    Logger.LogError("Error loading sound effect " + this.locator + " with error: " + err);

}

SoundEffect.prototype.Loaded = function()
{

    return this.loaded;

}

SoundEffect.prototype.Play = function(callback)
{

    var source = SoundManager.context.createBufferSource();
    source.buffer = this.buffer;
    source.connect(SoundManager.context.destination);

    source.start(0);

    source.onended = callback;

}

function SoundManager()
{
}

SoundManager.Initialize = function()
{

    SoundManager.audio_context = window.AudioContext || window.webkitAudioContext;

    if(!SoundManager.audio_context)
    {

        Logger.LogError("Unable to find WebAudio Context");

        return;

    }

    SoundManager.context = new AudioContext();

    SoundManager.buffers = {};

}

SoundManager.LoadSounds = function(json)
{

    for(var i = 0; i < json.length; i++)
    {

        var locator = json[i];
        json[i] = Helpers.TrimLocator(json[i]);

        SoundManager.buffers[json[i]] = new SoundEffect();
        SoundManager.buffers[json[i]].Load(locator);

    }

}

SoundManager.Loaded = function()
{

    SoundManager.loaded_count = 0;
    for(var sound in SoundManager.buffers)
    {

        if(!SoundManager.buffers[sound].Loaded())
        {

            return false;

        }
        SoundManager.loaded_count += 1;

    }

    return true;

}

SoundManager.LoadProgress = function()
{

    var progress = {};
    progress.total = Object.getOwnPropertyNames(SoundManager.buffers).length;
    progress.loaded = SoundManager.loaded_count;

    return progress;

}

SoundManager.ProcessSoundMessages = function()
{

    var message = Messenger.ReadMessage(CONST_MESSAGE_TYPE_SOUNDEFFECT, true, 0);
    while(!message.IsEmpty())
    {

        var sound = message.Sound();

        SoundManager.PlaySound(sound);

        message = Messenger.ReadMessage(CONST_MESSAGE_TYPE_SOUNDEFFECT, true, 0);

    }

    message = Messenger.ReadMessage(CONST_MESSAGE_TYPE_MUSIC, true, 0);
    while(!message.IsEmpty())
    {

        SoundManager.music = message;
        SoundManager.music.InitializeMusic();

        message = Messenger.ReadMessage(CONST_MESSAGE_TYPE_MUSIC, true, 0);

    }

    if(SoundManager.music)
    {

        SoundManager.music.UpdateTracks();

    }

}

SoundManager.PlaySound = function(sound, callback)
{

    if(!(sound in SoundManager.buffers))
    {

        Logger.LogError("Attempting to play missing sound " + sound);

        return;

    }

    SoundManager.buffers[sound].Play(callback);

}

function SoundEffectMessage(sound)
{

	Message.call(this, CONST_MESSAGE_TYPE_SOUNDEFFECT);

	this.sound = sound;

}

SoundEffectMessage.prototype = Object.create(Message.prototype);
SoundEffectMessage.prototype.constructor = SoundEffectMessage;

SoundEffectMessage.prototype.Sound = function()
{

	return this.sound;

}

function MusicMessage()
{

    Message.call(this, CONST_MESSAGE_TYPE_MUSIC);

}

MusicMessage.prototype = Object.create(Message.prototype);
MusicMessage.prototype.constructor = MusicMessage;

MusicMessage.prototype.InitializeMusic = function()
{

    Logger.LogError("Attempting to call InitializeMusic on virtual MusicMessage");

}

MusicMessage.prototype.UpdateTracks = function()
{

    Logger.LogError("Attempting to call UpdateTracks on virtual MusicMessage");

}

function LinearMusicMessage(tracks, delay)
{

    MusicMessage.call(this);

    this.tracks = tracks.slice(0);

    this.delay = delay;
    this.startTime = -1;
    this.playing = false;

    this.currentTrack = 0;

}

LinearMusicMessage.prototype = Object.create(MusicMessage.prototype);
LinearMusicMessage.prototype.constructor = LinearMusicMessage;

LinearMusicMessage.prototype.InitializeMusic = function()
{

    this.PlayTrack();

}

LinearMusicMessage.prototype.PlayTrack = function()
{

    SoundManager.PlaySound(this.tracks[this.currentTrack], this.TrackComplete.bind(this));
    this.playing = true;

}

LinearMusicMessage.prototype.UpdateTracks = function()
{

    if(!this.playing)
    {

        if(Timer.LifetimeMilliseconds() - this.startTime >= this.delay)
        {

            this.PlayTrack();

        }

    }

}

LinearMusicMessage.prototype.TrackComplete = function()
{

    this.currentTrack += 1;
    this.currentTrack = (this.currentTrack % this.tracks.length);

    this.startTime = Timer.LifetimeMilliseconds();

    this.playing = false;

}
