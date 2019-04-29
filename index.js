const electron = require('electron');
const Toolset = require('./ToolWindow');

function StartTools()
{

    //TODO: Handle multiple tools, user settings for each type
    var json = {
        width: 800,
        height: 600
    };

    var win = Toolset.Create(json);

}

electron.app.on('ready', StartTools);
