/*
	touch module
*/

mmmirror.__proto__._touch = function() {
	var dfd = $.Deferred(),
		_this = this;

	// do setup to return a resolve or reject
	(function() {
		//_this.socket.on('tuio', function(e){console.log(e)});
		window.client = new Caress.Client({
			host: 'localhost',
			port: 3001,
			socket: _this.socket
		});
		client.connect();
		
		return dfd.resolve();
	})();

	return dfd.promise();

}
//@ sourceURL=js/modules/touch/touch.js