function Popup()
{

}

Popup.currentPopupId = null;
Popup.popup_callback = null;

Popup.ShowPopup = function(id, json, callback)
{

        var popupContainer = document.getElementById("popup-container");
        popupContainer.style.visibility = "visible";

        Popup.currentPopupId = id;
        var popup = document.getElementById(id);
        popup.style.visibility = "visible";

        Popup.FillPopup(json);

        popup_callback = callback;

}

Popup.FillPopup = function(json)
{

        for (var key in json)
        {

                if (json.hasOwnProperty(key))
                {

                        var input = document.getElementById(Popup.currentPopupId + "-" + key);

                        if(!input)
                        {

                                Logger.LogError("Attempting to set missing popup data " + key);

                                return;

                        }

                        input.value = json[key];

                }

        }

}

Popup.HandlePopup = function()
{

        var popup = document.getElementById(Popup.currentPopupId);

        var json = {};
        var fields = popup.getElementsByClassName("popup-data-name");

        for(var i = 0; i < fields.length; i++)
        {

                var id = fields[i].dataset.input;

                var input = document.getElementById(id);

                json[input.dataset.key] = input.value;

        }

        popup_callback(json);

        Popup.HidePopup();

}

Popup.HidePopup = function()
{

        var popupContainer = document.getElementById("popup-container");
        popupContainer.style.visibility = "hidden";

        var popup = document.getElementById(Popup.currentPopupId);
        popup.style.visibility = "hidden";

}

document.addEventListener('DOMContentLoaded', function()
{

        var popups = document.getElementsByClassName("popup-box");

        for(var i = 0; i < popups.length; i++)
        {

                var confirm = document.getElementById(popups[i].id + "-ok");
                if(confirm)
                {

                    confirm.addEventListener("click", Popup.HandlePopup);

                }

                var cancel = document.getElementById(popups[i].id + "-cancel");
                if(cancel)
                {

                    cancel.addEventListener("click", Popup.HidePopup);

                }

        }

});
