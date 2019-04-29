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

    return win;

}

module.exports = ToolSet;
