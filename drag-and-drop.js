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

    console.debug(files)

    if (files.length) {
      document.getElementById('droplabel').innerHTML = 'Processing ' + file.name;

      var reader = new FileReader();

      reader.onloadend = this.handleReaderLoadEnd;

      reader.readAsDataURL(file);
    }
  },

  handleReaderLoadEnd: function(event){
    var img = document.getElementById("preview");

    console.debug(event)

    img.src = event.target.result;
  }
};

var dropbox = document.getElementById("dropbox")

dropbox.addEventListener("dragenter", dropListener, false);
dropbox.addEventListener("dragexit", dropListener, false);
dropbox.addEventListener("dragover", dropListener, false);
dropbox.addEventListener("drop", dropListener, false);