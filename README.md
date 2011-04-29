# A Simple File Drag and Drop Example

Work in progress...

You will get a security error when trying to read the file if you don't run this code on a server, to test locally see the Development section below.

Check out the heavily annotated source here [http://jxson.github.com/html5-file-drag-and-drop/](http://jxson.github.com/html5-file-drag-and-drop/)

# Development

To get around a security restriction with using the [FileReader][] API on local files this project is wrapped in a tiny [Sinatra][] application for local development. To get up and running you will need an install of ruby and the bundler gem. Once you have all that (most of you should have this stuff already) you can run:

    bundle install # get the prerequisites
    bundle exec rackup # fire up the server
    open http://localhost:9292 # open the example in you default browser

If you don't want to mess with all that ruby stuff you can always copy the public directory to a server that you have access to.

[FileReader]: https://developer.mozilla.org/en/DOM/FileReader "FileReader"
[Sinatra]: http://www.sinatrarb.com/ "Sinatra"
