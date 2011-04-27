var dropListener = {
  handleEvent: function(event){
    if (event.type === 'dragenter') { this.dragenter(event); }
    if (event.type === 'dragexit') { this.dragexit(event); }
    if (event.type === 'dragover') { this.dragover(event); }
    if (event.type === 'drop') { this.drop(event); }
  },

  dragenter: function(event){
    event.preventDefault();
    event.stopPropagation();

    console.debug('dragenter')
  },

  dragexit: function(event){
    event.preventDefault();
    event.stopPropagation();

    console.debug('dragexit')
  },

  dragover: function(event){
    event.preventDefault();
    event.stopPropagation();

    console.debug('dragover')
  },

  drop: function(event){
    event.preventDefault();
    event.stopPropagation();

    console.debug('drop')

    var files = event.dataTransfer.files,
        file = files[0];

    if (files.length) {
      document.getElementById('droplabel').innerHTML = 'Processing ' + file.name;

      var reader = new FileReader();

      // console.debug(file.type.match('image.*'))

      // Called when the read operation is aborted.
      reader.onabort = function(){
        console.debug('onabort')
      }

      // Called when an error occurs.
      reader.onerror = function(){
        console.debug('onerror')
      }

      // Called when the read operation is successfully completed.
      reader.onload = function(){
        console.debug('onload')
      }

      // Called when the read is completed, whether successful or not. This is
      // called after either onload or onerror.
      reader.onloadend = this.handleReaderLoadEnd;

      // Called when reading the data is about to begin.
      reader.onloadstart = function(){
        console.debug('onloadstart')
      }

      // Called periodically while the data is being read.
      reader.onprogress = function(){
        console.debug('.')
      }

      reader.readAsDataURL(file);
    }
  },

  handleReaderLoadEnd: function(event){
    var img = document.getElementById("preview");

    console.debug(event.target.error.code)

    img.src = event.target.result;
  }
};

var dropbox = document.getElementById("dropbox")

dropbox.addEventListener("dragenter", dropListener, false);
dropbox.addEventListener("dragexit", dropListener, false);
dropbox.addEventListener("dragover", dropListener, false);
dropbox.addEventListener("drop", dropListener, false);