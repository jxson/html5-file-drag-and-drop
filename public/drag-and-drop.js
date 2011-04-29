// Searching Google for good examples of processing files with HTML5's drag
// and drop proved to be more difficult than I anticipated. This example
// exists to provide both a solid starting point for any other nerds looking
// to implement drag and drop as well as provide detailed contextual
// documentation for working with drag and drop events, the JavaScript
// `FileList` collection, and the JavaScript `FileReader` objects.

// This example's source is hosted on
// [github](https://github.com/jxson/html5-file-drag-and-drop), feel free to
// send me any pull requests or
// [report any
// issues](https://github.com/jxson/html5-file-drag-and-drop/issues).

// ## Caveats

// * Currently this example only works with **Google Chrome**

// # The Markup

// This script expects a tiny bit of markup to subject to it's event listening
// and DOM manipulation (for the entire page take a look at
// [this project's](https://github.com/jxson/html5-file-drag-and-drop)
// index.html):
//
//     <div id="dropbox">
//       <span id="droplabel">Drop file here...</span>
//     </div>
//
//     <img id="preview" alt="[ preview will display here ]" />
//
// The `div#dropbox` element will have our event listeners added to it and the
// `img#preview` element will have it's source updated to whatever image gets
// dropped onto the `div#dropbox`.

// # The JavaScript

// Set a reference the the `div#dropbox` element using `document.getElementById`. Since this example is fairly simple and needs access to the normal DOM element there is an intentional avoidance of [jQuery](), however you will most likely be using something like jQuery or [Zepto]() wherever you are looking to implement drag and drop. Keep in mind:
//
//     var dropbox = document.getElementById('dropbox');
//
// Is eqiuivelent to:
//
//    var dropbox =  $('#dropbox')[0];
//
// Notice that using the query above requires the zeroth element from the jQuery object. This is so that the node can be acted on directly with `element.addEventListener`.
var dropbox = document.getElementById('dropbox');

// ## Adding drag and drop event listeners

// Use `dropbox.addEventListener` to add event handlers to the necessary drag and drop events on the `div#dropbox` element.
dropbox.addEventListener('dragenter', dropListener, false);
dropbox.addEventListener('dragexit', dropListener, false);
dropbox.addEventListener('dragover', dropListener, false);
dropbox.addEventListener('drop', dropListener, false);

// ### Why use an EventListener object?

// use `element.addEventListener` to hook into the Drag and Drop events on the `div#dropbox` element. The `dropListener` being passed in is an [EventListener][http://www.w3.org/TR/DOM-Level-2-Events/events.html#Events-EventListener] object. It is good practice when needing to keep state between multiple events like this to use an EventListener object rather than using functions directly. Thouch events are another good example of where the EventListener objects are extremely helpful...


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
