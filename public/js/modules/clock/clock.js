/*
	blank module
*/

mmmirror.__proto__._clock = function(data) {

	var dfd 	= $.Deferred(),
		_this 	= this,
		clock;
	
	// do setup to return a resolve or reject
	(function(){
		_this.event('templatesLoaded').listen(startClock);
		dfd.resolve();
	})();

	function startClock(store){
		$(_this.args.selectors.front).append($.render.clockTmpl()); 
		clock = setInterval(function(){
			var date = moment().format('dddd, MMMM DD'),
				time = moment().format('hh:mm:ss A');
			$('#clock .text').text(time)
			$('#calendar').find('.date').text(date);
		}, 500)
	}
	return dfd.promise();

}
//@ sourceURL=js/modules/clock/clock.js