mmmirror
======

A semi-magic mirror framework, based on node.js and TUIO.

mmmirror system
------

There are quite a lot of things that this project depends on. You will need to have sudo at least on your machine. I don't know how it will build on windows as of now.

You will need to have either some sort of TUIO device sending data to port 3333, or a touch device to use the UI, it is currently bound to hammer.js taps.

to install:
    // clone the repo
    sudo npm install
    sudo npm install -g foreman

to run:

    nf start 

Alternatively, you can load the whole running on the project with the handy init.d script in the `/scripts` folder:

    sudo mkdir /var/node/
    cd /var/node && sudo git clone https://github.com/nucleardreamer/mmmirror.git
    npm install -g forever
    sudo npm install
    // copy the file to /etc/init.d/mmmirror
    sudo su
    chmod a+x /etc/init.d/mmmirror
    update-rc.d mmmirror defaults

After that, simply run `sudo service mmmirror restart`, `stop`, or `start`

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

### modules
Client side "modules" are nothing more than scripts that return a `Deferred()` object. jsRender templates in the same folder are automatically loaded as well, so that the namespace is ready for the module (or any other module) to use.

Here is an example blank module.

    mmmirror.__proto__._blank = function(data) {
    
    	var dfd 	= $.Deferred(),
    		_this 	= this;
    	
    	// do setup to return a resolve or reject
    	(function(){
    		dfd.resolve();
    	})();
    	
    	// return a promise to that we can resolve it
    	return dfd.promise();
    
    }
    // script source mapping so we can keep tabs in our browsers inspector
    //@ sourceURL=js/modules/blank/blank.js



todo
------
add stream buffer pausing, right now you have to kill the whole node process to stop tracks from playing
