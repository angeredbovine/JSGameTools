const electron = require('electron');

var ToolSet = {};

ToolSet.Create = function(json)
{

        var win = new electron.BrowserWindow(
        {

                width: json.width,
                height: json.height,
                frame: false,
                webPreferences:
                {

                        nodeIntegration: true

                }

        });

        win.loadFile('Pages/' + json.app + '.html');
        //win.webContents.openDevTools();
        return win;

}

module.exports = ToolSet;
