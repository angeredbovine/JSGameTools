function ToolHelpers()
{

}

ToolHelpers.ImageToBase64 = function(image)
{

        var canvas = document.createElement("canvas");
        canvas.width = image.width;
        canvas.height = image.height;

        var context = canvas.getContext("2d");
        context.drawImage(image, 0, 0);

        return canvas.toDataURL("image/png").replace(/^data:image\/(png|jpg);base64,/, "");

}
