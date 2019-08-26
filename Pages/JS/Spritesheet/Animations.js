function AnimationData(name, frames)
{

    this.name = name;
    this.frames = frames.slice(0);

}

AnimationData.prototype.ToJSON = function()
{

    var json = {};

    json.name = this.name;
    json.frames = this.frames.slice(0);

    return json;

}

AnimationData.EmptyJSON = function()
{

    var json = {};

    json.name = "";
    json.frames = [];

    return json;

}

function AddAnimationAction(index)
{

    Action.call(this);

    this.animation = new AnimationData("Animation #" + index, []);

}

AddAnimationAction.prototype = Object.create(Action.prototype);
AddAnimationAction.prototype.constructor = AddAnimationAction;

AddAnimationAction.prototype.Do = function(file)
{

    file.AddAnimationData(this.animation);

    AnimationMethods.CreateSelectElement(this.animation.name);

    AnimationMethods.DisplayAnimation(this.animation);

    AnimationMethods.ControlButtons(true);

    AnimationMethods.animations_created += 1;

}

AddAnimationAction.prototype.Undo = function(file)
{

    file.RemoveAnimationData(file.animations.length - 1);

    AnimationMethods.RemoveSelectElement(this.animation.name);

    if(file.animations.length > 0)
    {

        AnimationMethods.DisplayAnimation(file.animations[file.animations.length - 1]);

    }

    AnimationMethods.ControlButtons();

    AnimationMethods.animations_created -= 1;

}

function UpdateAnimationAction(index, update, old)
{

    Action.call(this);

    this.index = index;

    this.update = update;
    this.old = old;

}

UpdateAnimationAction.prototype = Object.create(Action.prototype);
UpdateAnimationAction.prototype.constructor = UpdateAnimationAction;

UpdateAnimationAction.prototype.Do = function(file)
{

    file.UpdateAnimationData(this.update, this.index);

    AnimationMethods.UpdateSelectElement(this.old.name, this.update.name);

    AnimationMethods.DisplayAnimation(this.update);

}

UpdateAnimationAction.prototype.Undo = function(file)
{

    file.UpdateAnimationData(this.old, this.index);

    AnimationMethods.UpdateSelectElement(this.update.name, this.old.name);

    AnimationMethods.DisplayAnimation(this.old);

}

function RemoveAnimationAction(index, animation)
{

    Action.call(this);

    this.index = index;
    this.animation = animation;

}

RemoveAnimationAction.prototype = Object.create(Action.prototype);
RemoveAnimationAction.prototype.constructor = RemoveAnimationAction;

RemoveAnimationAction.prototype.Do = function(file)
{

    file.RemoveAnimationData(this.index);

    AnimationMethods.RemoveSelectElement(this.animation.name);

    if(file.animations.length > 0)
    {

        AnimationMethods.DisplayAnimation(file.animations[file.animations.length - 1]);

    }

    AnimationMethods.ControlButtons();

}

RemoveAnimationAction.prototype.Undo = function(file)
{

    file.AddAnimationData(this.animation, this.index);

    AnimationMethods.CreateSelectElement(this.animation.name);

    AnimationMethods.DisplayAnimation(this.animation);

    AnimationMethods.ControlButtons(true);

}

function AnimationMethods()
{

}

AnimationMethods.animation_selection = null;
AnimationMethods.selected_frames = [];
AnimationMethods.selected_index = -1;

AnimationMethods.animations_created = 0;

AnimationMethods.preview = null;
AnimationMethods.preview_scale = 1;
AnimationMethods.preview_paused = false;

AnimationMethods.AddAnimation = function()
{

    var file = FileData.GetFile();

    FileData.Do(new AddAnimationAction(AnimationMethods.animations_created));

}

AnimationMethods.RemoveAnimation = function()
{

    var file = FileData.GetFile();

    var name = document.getElementById("animation-dialog-animation").value;

    var index = file.animations.findIndex(function(element)
    {

        return element.name == name;

    });

    FileData.Do(new RemoveAnimationAction(index, file.animations[index]));

}

AnimationMethods.UpdateAnimation = function()
{

    var file = FileData.GetFile();

    var oldName = document.getElementById("animation-dialog-animation").value;
    var index = file.animations.findIndex(function(element)
    {

        return element.name == oldName;

    });

    var newAnimation = new AnimationData(document.getElementById("animation-dialog-name").value, AnimationMethods.selected_frames);

    FileData.Do(new UpdateAnimationAction(index, newAnimation, file.animations[index]));

}

AnimationMethods.CreateSelectElement = function(name)
{

    var select = document.createElement("option");
    select.value = name;
    select.innerHTML = name;

    select.classList.add("dialog-data-option");

    var dropdown = document.getElementById("animation-dialog-animation");
    dropdown.appendChild(select);

}

AnimationMethods.RemoveSelectElement = function(name)
{

    var dropdown = document.getElementById("animation-dialog-animation");

    for(var i = 0; i < dropdown.options.length; i++)
    {

        if(dropdown.options[i].value == name)
        {

            dropdown.options[i] = null;

            return;

        }

    }

}

AnimationMethods.ClearAnimationSelect = function()
{

    var dropdown = document.getElementById("animation-dialog-animation");
    dropdown.innerHTML = "";

}

AnimationMethods.UpdateSelectElement = function(oldName, newName)
{

    AnimationMethods.RemoveSelectElement(oldName);
    AnimationMethods.CreateSelectElement(newName);

}

AnimationMethods.ControlButtons = function(hasAnimations)
{

    var file = FileData.GetFile();

    var enabled = hasAnimations || (file && file.animations.length > 0);

    if(enabled)
    {

        var buttons = document.getElementsByClassName("animation-needed");

        for(var i = 0; i < buttons.length; i++)
        {

            buttons[i].classList.remove("disabled");

        }

        return;

    }

    var buttons = document.getElementsByClassName("animation-needed");

    for(var i = 0; i < buttons.length; i++)
    {

        buttons[i].classList.add("disabled");

    }

}

AnimationMethods.StartFrameSelection = function()
{

    AnimationMethods.animation_selection = true;

    var button = document.getElementById("animation-dialog-select");
    button.value = "Finish";
    button.addEventListener("click", AnimationMethods.EndFrameSelection);
    button.removeEventListener("click", AnimationMethods.StartFrameSelection);

    var workspace = document.getElementById("tool-content-workspace");
    workspace.addEventListener("mousedown", AnimationMethods.FrameSelection);
    workspace.addEventListener("wheel", AnimationMethods.FrameIndex);

    AnimationMethods.DisplayFrames(AnimationMethods.selected_frames, AnimationMethods.selected_index);

}

AnimationMethods.FrameSelection = function(e)
{

    e = e || window.event;

    var file = FileData.GetFile();

    if(AnimationMethods.animation_selection && file)
    {

        e.preventDefault();

        if(e.button == 0)
        {

            var canvas = document.getElementById(CONST_WORKSPACE_CANVAS_ID);
            var point = new Vector2(e.clientX - canvas.offsetLeft, e.clientY - canvas.offsetTop);

            var index = 0;

            for(var i = 0; i < file.images.length; i++)
            {

                var data = file.images[i];

                var box = new Box(data.position.X() - Workspace.worldX, data.position.Y() - Workspace.worldY, data.width, data.height);

                if(box.ContainsPoint(point))
                {

                        index = i;

                }

            }

            AnimationMethods.selected_frames.splice(AnimationMethods.selected_index, 0, index);
            AnimationMethods.selected_index += 1;

        }
        else if(e.button == 2)
        {

            if(AnimationMethods.selected_index > 0 && AnimationMethods.selected_frames.length > 0)
            {

                AnimationMethods.selected_frames.splice(AnimationMethods.selected_index, 1);

            }

        }

        AnimationMethods.DisplayFrames(AnimationMethods.selected_frames, AnimationMethods.selected_index);

    }

}

AnimationMethods.FrameIndex = function(e)
{

    e = e || window.event;

    if(AnimationMethods.animation_selection)
    {

        e.preventDefault();

        AnimationMethods.selected_index += e.deltaY * -0.01; // Standard single click of a wheel is 100 in the opposite direction that is natural. The same multiplicative factor is used by MDN

        AnimationMethods.selected_index = Math.max(AnimationMethods.selected_index, 0);
        AnimationMethods.selected_index = Math.min(AnimationMethods.selected_index, AnimationMethods.selected_frames.length);

        AnimationMethods.DisplayFrames(AnimationMethods.selected_frames, AnimationMethods.selected_index);

    }

}

AnimationMethods.EndFrameSelection = function()
{

    AnimationMethods.DisplayFrames(AnimationMethods.selected_frames);

    AnimationMethods.animation_selection = false;
    AnimationMethods.selected_index = AnimationMethods.selected_frames.length;

    var button = document.getElementById("animation-dialog-select");
    button.value = "Select Frames";
    button.addEventListener("click", AnimationMethods.StartFrameSelection);
    button.removeEventListener("click", AnimationMethods.EndFrameSelection);

    var workspace = document.getElementById("tool-content-workspace");
    workspace.removeEventListener("click", AnimationMethods.FrameSelection);
    workspace.removeEventListener("wheel", AnimationMethods.FrameIndex);

}

AnimationMethods.DisplayAnimation = function(animation)
{

    document.getElementById("animation-dialog-animation").value = animation.name;
    document.getElementById("animation-dialog-name").value = animation.name;

    AnimationMethods.selected_frames = animation.frames.slice(0);
    AnimationMethods.selected_index = animation.frames.length;

    AnimationMethods.DisplayFrames(animation.frames, animation.frames.length);

    AnimationMethods.Preview();
    AnimationMethods.RenderAnimation();

}

AnimationMethods.DisplayFrames = function(frames, index)
{

    var container = document.getElementById("animation-frame-container");
    container.innerHTML = '';

    var cellOpen = '<td class="animation-frame-index ';
    var cellMiddle = '">';
    var cellClose = '</td>';

    var cells = '';

    for(var i = 0; i < frames.length; i++)
    {

        cells += cellOpen + (i == index ? 'animation-frame-selected' : '') + cellMiddle + frames[i] + cellClose;

    }

    if(index == frames.length)
    {

        cells += cellOpen + 'animation-frame-selected' + cellMiddle + cellClose;

    }

    container.insertAdjacentHTML('afterbegin', cells);

}

AnimationMethods.AnimationChanged = function()
{

    var name = document.getElementById("animation-dialog-animation").value;

    var file = FileData.GetFile();

    for(var i = 0; i < file.animations.length; i++)
    {

        if(name == file.animations[i].name)
        {

            AnimationMethods.DisplayAnimation(file.animations[i]);

            if(file.animations[i].frames.length > 0)
            {

                AnimationMethods.Preview();

            }

            return;

        }

    }

}

AnimationMethods.Preview = function()
{

        var file = FileData.GetFile();

        AnimationMethods.preview = new SheetReference(file.sheet);

        //Set the correct animation
        var name = document.getElementById("animation-dialog-animation").value;
        var index = file.animations.findIndex(function(element)
        {

            return element.name == name;

        });

        AnimationMethods.preview.currentAnimation = index;

        //Compute the preview scale
        var canvas = document.getElementById("animation-dialog-preview");
        var context = canvas.getContext('2d');

        AnimationMethods.preview_scale = 1;

        var center = new Vector2(canvas.width / 2, canvas.height / 2);
        for(var i = 0; i < file.animations[index].frames.length; i++)
        {

            var data = file.images[file.animations[index].frames[i]];

            if(data.offset.X() > 0)
            {

                AnimationMethods.preview_scale = Math.min(center.X() / data.offset.X(), AnimationMethods.preview_scale);

            }

            if(data.offset.Y() > 0)
            {

                AnimationMethods.preview_scale = Math.min(center.Y() / data.offset.Y(), AnimationMethods.preview_scale);

            }

            if(data.width - data.offset.X() > 0)
            {

                AnimationMethods.preview_scale = Math.min((canvas.width - center.X()) / (data.width - data.offset.X()), AnimationMethods.preview_scale);

            }

            if(data.height - data.offset.Y() > 0)
            {

                AnimationMethods.preview_scale = Math.min((canvas.height - center.Y()) / (data.height - data.offset.Y()), AnimationMethods.preview_scale);

            }

        }

}

AnimationMethods.Play = function(loop)
{

    if(AnimationMethods.preview)
    {

        Timer.Reset();

        AnimationMethods.preview.loop = loop;
        AnimationMethods.preview.Start();

        requestAnimationFrame(AnimationMethods.Update);

    }

}

AnimationMethods.Update = function()
{

    if(AnimationMethods.preview && !AnimationMethods.preview_paused)
    {

        AnimationMethods.preview.Lookup();

        AnimationMethods.RenderAnimation();

        requestAnimationFrame(AnimationMethods.Update);

    }

}

AnimationMethods.RenderAnimation = function()
{

    if(!Workspace.tile)
    {

            return;

    }

    var canvas = document.getElementById("animation-dialog-preview");
    var context = canvas.getContext('2d');

    context.clearRect(0, 0, canvas.width, canvas.height);

    context.fillStyle = Workspace.tile;
    context.fillRect(0, 0, canvas.width, canvas.height);

    if(AnimationMethods.preview)
    {

        var file = FileData.GetFile();
        var data = file.images[file.animations[AnimationMethods.preview.currentAnimation].frames[(AnimationMethods.preview.currentFrame >= 0 ? AnimationMethods.preview.currentFrame : 0)]];
        var center = new Vector2(canvas.width / 2, canvas.height / 2);
        var scale = AnimationMethods.preview_scale;

        context.drawImage(data.image, center.X() - (data.offset.X() * scale), center.Y() - (data.offset.Y() * scale), data.width * scale, data.height * scale);

    }

}

document.addEventListener('DOMContentLoaded', function()
{

    document.getElementById("animation-dialog-addanimation").addEventListener('click', AnimationMethods.AddAnimation);
    document.getElementById("animation-dialog-removeanimation").addEventListener('click', AnimationMethods.RemoveAnimation);

    document.getElementById("animation-dialog-animation").addEventListener("change", AnimationMethods.AnimationChanged);

    document.getElementById("animation-dialog-select").addEventListener("click", AnimationMethods.StartFrameSelection);

    document.getElementById("animation-dialog-save").addEventListener("click", AnimationMethods.UpdateAnimation);

    document.getElementById("animation-dialog-play").addEventListener('click', function(event)
    {

        AnimationMethods.Play(false);

    });

    document.getElementById("animation-dialog-loop").addEventListener('click', function(event)
    {

        AnimationMethods.Play(true);

    });

    document.getElementById("animation-dialog-pause").addEventListener('click', function(event)
    {

        if(AnimationMethods.preview_paused)
        {

            AnimationMethods.preview_paused = false;
            Timer.Unpause();

            AnimationMethods.Update();

        }
        else
        {

            AnimationMethods.preview_paused = true;
            Timer.Pause();

        }

    });

});
