const CONST_MESSAGE_TYPE_EMPTY = "Empty";

var m_messenger;

function Messenger()
{

	this.messages = {};

}

Messenger.StartMessenger = function()
{

	m_messenger = new Messenger();

}

Messenger.PostMessage = function(message)
{

	if(!(message.Type() in m_messenger.messages))
	{

		m_messenger.messages[message.Type()] = [];

	}

	m_messenger.messages[message.Type()].push(message);

}

Messenger.ReadMessage = function(type, discard, index)
{

	if(!(type in m_messenger.messages))
	{

		m_messenger.messages[type] = [];

	}

	if(index < 0 || index >= m_messenger.messages[type].length)
	{

		return Message.Empty();

	} 

	var message = m_messenger.messages[type][index];

	if(discard)
	{

		m_messenger.messages[type].splice(index, 1);

	}

	return message;

}

Messenger.ReadNextMessage = function(type, discard)
{

	return Messenger.ReadMessage(type, discard, 0);

}

function Message(type)
{

	this.type = type;

}

Message.Empty = function()
{

	return new Message(CONST_MESSAGE_TYPE_EMPTY);

}

Message.prototype.Type = function()
{

	return this.type;

}

Message.prototype.IsEmpty = function()
{

	return (this.Type() == CONST_MESSAGE_TYPE_EMPTY);

}
