const electron = require('electron');

var ToolSet = {};

ToolSet.Create = function(json)
{

    var win = new electron.BrowserWindow(
        {

            width: json.width,
            height: json.height,
            frame: false

        }
    );

    win.loadFile('Pages/' + json.app + '.html');

    return win;

}

module.exports = ToolSet;
