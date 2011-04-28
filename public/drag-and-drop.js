/*

Since searching for good examples of Draging and Droping files using HTML5 proved to be more difficult than I anticpated I thought it would be nice to put this out there for others to use as a good starting point. **Currently this example only works on Google Chrome**

This script expects a tiny bit of markup to subject it's event listening and DOM manipulation on:

    <div id="dropbox">
      <span id="droplabel">Drop file here...</span>
    </div>

    <img id="preview" alt="[ preview will display here ]" />

(You can see the full example in [this project's][] index.html for the full structure)

The `div#dropbox` element will have our event listeners added to it and the `img#preview` element will have it's source updated to whatever image gets dropped onto the `div#dropbox`.

*/

// Use`document.getElementById` to get the elements. **Note** for this basic example there is no need to load all of jQuery to do basic queries, however if you are using jQuery this code is eqiuivelent to `var dropbox =  $('#dropbox')[0];` Notice we would be getting the zeroth element from the jQuery array in this case, doing this allows the use of `element.addEventListener`
var dropbox = document.getElementById('dropbox');

// # Using an EventListener object

// use `element.addEventListener` to hook into the Drag and Drop events on the `div#dropbox` element. The `dropListener` being passed in is an [EventListener][http://www.w3.org/TR/DOM-Level-2-Events/events.html#Events-EventListener] object. It is good practice when needing to keep state between multiple events like this to use an EventListener object rather than using functions directly. Thouch events are another good example of where the EventListener objects are extremely helpful...
dropbox.addEventListener('dragenter', dropListener, false);
dropbox.addEventListener('dragexit', dropListener, false);
dropbox.addEventListener('dragover', dropListener, false);
dropbox.addEventListener('drop', dropListener, false);

// # dropListener
var dropListener = {
  // Since `dropListener` is an implementation of the EventListener interface it is required to have a `handleEvent` method. This method is called whenerver an event occurs that the `dropListener` was registered for. The `handleEvent` dispatches the event to the proper method on the `dropListener`.
  handleEvent: function(event){
    if (event.type === 'dragenter') { this.dragenter(event); }
    if (event.type === 'dragexit') { this.dragexit(event); }
    if (event.type === 'dragover') { this.dragover(event); }
    if (event.type === 'drop') { this.drop(event); }
  },

  // `dragenter` fires when something is dragged onto the `div#dropbox` element, for this example this handler is only preventing the event from propagating.
  dragenter: function(event){
    event.preventDefault();
    event.stopPropagation();
  },

  // `dragexit` fires when something has been moved away from the `div#dropbox` element during a drag, like the `dragenter` handler `dragexit` is preventing the event from propagating.
  dragexit: function(event){
    event.preventDefault();
    event.stopPropagation();
  },

  // `dragover` fires when a drag is held over the `div#dropbox` element, be careful with adding any extra stuff to this event handler as this _event will fire numerous times during a drag_. Like the `dragenter` and `dragexit` this handler is stopping the event from propagating.
  dragover: function(event){
    event.preventDefault();
    event.stopPropagation();
  },

  // `drop` is the meat of this example. Initially the handler is stopping the event from propagating, after that it will proceed with processing whatever files were dropped onto the `div#dropbox` element.

  // The event passed into the `drop` handler will have a `DataTransfer` object on it. The `DataTransfer` object has a `FileList` attached to it that allows access to the files dropped by the user.

  // If there are any files the handler will let the user know that it's processing and create a new `FileReader` object.

  // The [`FileReader`][https://developer.mozilla.org/en/DOM/FileReader] object has several event handlers that can be set, since this is just a basic example the only event handler being used is onloadend
  drop: function(event){
    event.preventDefault();
    event.stopPropagation();

    var files = event.dataTransfer.files,
        file = files[0];

    if (files.length) {
      document.getElementById('droplabel').innerHTML = 'Processing ' +
        file.name;

      var reader = new FileReader();

      // Called when the read is completed, whether successful or not. This is
      // called after either onload or onerror.
      reader.onloadend = this.handleReaderLoadEnd;

      reader.readAsDataURL(file);
    }
  },

  handleReaderLoadEnd: function(event){
    var img = document.getElementById("preview");

    img.src = event.target.result;
  }
};
