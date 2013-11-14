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
		
		var uiOn = false, timeoutFunc, timeoutBool = true;

		$('body').hammer().on('tap', function(e){
			if(timeoutBool){
				timeoutBool = false;
				timeoutFunc = setTimeout(function(){
					var target = $(e.target);
					console.log(target)
					if(target.attr('data-link')){
						$.address.value(target.attr('data-link'));
					} else if(!target.attr('data-action')){
						$.address.value(target.parent('[data-link]').attr('data-link'));
					}
					timeoutBool = true;
				}, 50);
			}
		});

		return dfd.resolve();
	})();

	return dfd.promise();

}
//@ sourceURL=js/modules/touch/touch.js