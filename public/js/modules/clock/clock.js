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
		_this.event('ui.overlay').listen(showCalendar);
		dfd.resolve();
	})();
	
	function showCalendar(d){
		if(d.on){
			$('#calendar').removeClass('hidden')
		} else {
			$('#calendar').addClass('hidden')
		}
	}

	function startClock(store){
		$(_this.args.selectors.main).append($.render.clockTmpl()); 
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