mmmirror
======

mmmirror system
------

There are quite a lot of things that this project depends on. You will need to have sudo at least on your machine. I don't know how it will build on windows as of now.

You will need to have either some sort of TUIO device sending data to port 3333, or a touch device to use the UI, it is currently bound to hammer.js taps.

to install:

    sudo apt-get install libasound2-dev
    sudo npm install

to run:

    npm start

how it runs
------
### events
The entire project runs off of socket.io, there are no client side ajax calls. Events run transparently on both the back and front end. This is accomplished through a client side `EventEmitter` which passes closures over the web socket connection. There is a global `EventEmitter` on the node side, the event names are repeated to keep consistancy.

The client side exposes a prototype object called `event` which has three methods:

    // emit events locally, with the option at the end for server side passthrough
    obj.event('namespace').push({my: 'json'},[bool])
    
    // register a callback for an event emit
    obj.event('namespace').listen(function(data){})
    
    // emit events locally and also with a registered callback over socket transport
    // the server will be able to call the callback
    obj.event('namespace').respush({
      data: {my: 'json'},
      cb: function(data){
        // callback from the other side
      }
    });




todo
------
add stream buffer pausing, right now you have to kill the whole node process to stop tracks from playing
