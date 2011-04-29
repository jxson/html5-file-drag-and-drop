// Searching Google for good examples of processing files with HTML5's drag
// and drop proved to be more difficult than I anticipated. This example
// exists to provide both a solid starting point for any other nerds looking
// to implement drag and drop as well as provide detailed contextual
// documentation for working with drag and drop events, the JavaScript
// `FileList` collection, and the JavaScript `FileReader` objects.
//
// This example's source is hosted on
// [github](https://github.com/jxson/html5-file-drag-and-drop), feel free to
// send me any pull requests or
// [report any
// issues](https://github.com/jxson/html5-file-drag-and-drop/issues).
//
// ## Caveats
//
// * Currently this example only works with **Google Chrome**
//
// ## Reference
//
// * [WHATWG Drag and drop spec](http://www.whatwg.org/specs/web-apps/current-work/multipage/dnd.html#dnd)
// * [W3C `File` API](http://www.w3.org/TR/FileAPI/)
//    * [`FileReader` API](http://www.w3.org/TR/file-upload/#dfn-filereader)
// * [MDC `FileReader` documentation](https://developer.mozilla.org/en/DOM/FileReader)
// * [W3C `EventListener` interface](http://www.w3.org/TR/DOM-Level-2-Events/events.html#Events-EventListener)
// * Tutorials and rants that helped put this example together:
//    * [HTML5 Rocks - Reading local files in JavaScript](http://www.html5rocks.com/tutorials/file/dndfiles/#toc-reading-files)
//    * [PPk's - The HTML5 drag and drop disaster](http://www.quirksmode.org/blog/archives/2009/09/the_html5_drag.html)
//    * [Riyad Kalla's - HTML5 Drag and Drop and File API Tutorial (I couldn't get this one to work but it served as a great reference)](http://www.thebuzzmedia.com/html5-drag-and-drop-and-file-api-tutorial/)
//
// # The Markup
//
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

// Set a reference the the `div#dropbox` element using
// `document.getElementById`. Since this example is fairly simple and needs
// access to the normal DOM element there is an intentional avoidance of
// [jQuery](http://jquery.com/), however you will most likely be using
// something like jQuery or [Zepto](http://zeptojs.com/) wherever you are
// looking to implement drag and drop. Keep in mind:
//
//      var dropbox = document.getElementById('dropbox');
//
// Is eqiuivelent to:
//
//      var dropbox =  $('#dropbox')[0];
//
// Notice that using the query above requires the zeroth element from the
// jQuery object. This is so that the node can be acted on directly with
// `element.addEventListener`.
var dropbox = document.getElementById('dropbox');

// ## Adding drag and drop event listeners

// Use `dropbox.addEventListener` to add event handlers to the necessary drag
// and drop events on the `div#dropbox` element. The second argument being
// passed to `dropbox.addEventListener` in every case is a single
// `EventListener` object, this object uses the `EventListener` interface to
// dispatch the different events to the proper methods on the object.
dropbox.addEventListener('dragenter', dropListener, false);
dropbox.addEventListener('dragexit', dropListener, false);
dropbox.addEventListener('dragover', dropListener, false);
dropbox.addEventListener('drop', dropListener, false);

// ### Why use an EventListener object?

// It is good practice when needing to keep state and provide encapsulation
// between multiple events to use the `EventListener` interface rather than
// adding functions directly
// ([take a look at the spec for it](http://www.w3.org/TR/DOM-Level-2-Events/events.html#Events-EventListener)).
// This also helps to simplify the mental model in
// a way that allows one to think about the listener as a complete feature
// even though it might be spread out across numerous events. This wouldn't be
// as useful where you only care about single click events etc., but in the
// case of drag and drop it works out nicely. Touch events are another place
// where the `EventListener` object can come in really handy.
var dropListener = {
  // Since `dropListener` is an implementation of the EventListener interface
  // it is required to have a `handleEvent` method. This method is called
  // whenever an event occurs that the `dropListener` was registered for. The
  // `dropListener.handleEvent` dispatches the event to the proper method on
  // the `dropListener` object.
  handleEvent: function(event){
    if (event.type === 'dragenter') { this.onDragEnter(event); }
    if (event.type === 'dragexit') { this.onDragExit(event); }
    if (event.type === 'dragover') { this.onDragOver(event); }
    if (event.type === 'drop') { this.onDrop(event); }
  },

  // `dropListener.onDragEnter` fires when something is dragged onto the
  // `div#dropbox` element, for this example this handler is only stopping
  // the event from propagating.
  onDragEnter: function(event){
    event.preventDefault();
    event.stopPropagation();
  },

  // `dropListener.onDragExit` fires when something has been moved away from
  // the `div#dropbox` element during a drag, like the
  // `dropListener.onDragEnter` handler `dropListener.onDragExit` is stopping
  // the event from propagating.
  onDragExit: function(event){
    event.preventDefault();
    event.stopPropagation();
  },

  // `dropListener.onDragOver` fires when a drag is held over the
  // `div#dropbox` element, be careful with adding any extra stuff to this
  // event handler as **this event will fire numerous times during a drag**.
  // Like the `dropListener.onDragEnter` and `dropListener.onDragExit`
  // this handler is stopping the event from propagating.
  onDragOver: function(event){
    event.preventDefault();
    event.stopPropagation();
  },

  // `dropListener.onDrop` is the meat of this example. Initially the handler
  // is stopping the event from propagating, after that it will proceed with
  // processing whatever files were dropped onto the `div#dropbox` element.
  onDrop: function(event){
    event.preventDefault();
    event.stopPropagation();

    // The `drop` event handler will have a `DataTransfer` object on its event
    // which has a `FileList` attached to it. The `FileList` will allow access
    // to the files dropped by the user.
    var files = event.dataTransfer.files,
        file = files;

    // If there are any files the `file` variable will be populated with the
    // zeroth element in the event's `FileList`, the `span#droplabel` will be
    // updated to let the user know that the image is processing, and a call
    // to `dropListener.processImage` will be made.
    if (files.length) {
      file = files[0];

      document.getElementById('droplabel').innerHTML = 'Processing ' +
        file.name;

      this.processImage(file);
    }
  },

  // `processImage` will let the user know there is a problem and return
  // immediately if the file is not an image.
  processImage: function(file){
    if (! file.type.match('image.*')) {
      document.getElementById('droplabel').innerHTML = file.name +
        ' is not an image.';

      return;
    }

    // If the file is an image a new `FileReader` object will be created. The
    // `FileReader` object has several event handlers that can be set ([take a
    // look at the MDC docs for the FileReader Event handlers](https://developer.mozilla.org/en/DOM/FileReader#Event_handlers)),
    // since this is just a basic example the only event handler being set is
    // `onloadend`. In your implementation it would be a good idea to also add
    // `onerror` and `onprogress`.
    var reader = new FileReader();

    // `reader.onloadend` is set to `dropHandler.onReaderLoadEnd` which will
    // be called when reading the file is completed, whether successful or
    // not.
    reader.onloadend = this.onReaderLoadEnd;

    // `reader.readAsDataURL` will start the file reading process, when it is
    // finished `reader.onReaderLoadEnd` will be called with a data uri
    // populated in the event's target result.
    reader.readAsDataURL(file);
  },

  // `onReaderLoadEnd` will update the `img#preview`'s `src` attribute to
  // `event.target.result` this will show the image that user dropped onto the
  // `div#dropbox`.
  onReaderLoadEnd: function(event){
    var img = document.getElementById("preview");

    img.src = event.target.result;
  }
};

// Piece of cake right?
