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

		$('body').hammer().on('tap', function(){
			if(timeoutBool){
				timeoutBool = false;
				timeoutFunc = setTimeout(function(){
					uiOn = (uiOn) ? false : true;
					if(uiOn){
						$(_this.args.selectors.main).removeClass('uiHidden')
					} else {
						$(_this.args.selectors.main).addClass('uiHidden')
					}
					_this.event('ui.overlay').push({
						on: uiOn
					});
					timeoutBool = true;
				}, 50);
			}
		});

		return dfd.resolve();
	})();

	return dfd.promise();

}
//@ sourceURL=js/modules/touch/touch.js