mmmirror.__proto__._weather = function(data) {

	var dfd 	= $.Deferred(),
		_this 	= this,
		weather;
	
	// do setup to return a resolve or reject
	(function(){
		_this.event('templatesLoaded').listen(renderWeather);
		_this.event('ui.overlay').listen(showWeather);
		dfd.resolve();
	})();
	
	function showWeather(d){
		if(d.on){
			$('#weather').removeClass('hidden')
		} else {
			$('#weather').addClass('hidden')
		}
	}

	function renderWeather(){
		pullWeather();
		weather = setInterval(pullWeather,60000);
	}
	function pullWeather(){
		_this.event('api.weather').push(function(d){
			console.log(d)
			$('#weather').remove()
			$(_this.args.selectors.main).append($.render.weatherTmpl(d)); 
		})

	}
	return dfd.promise();

}
//@ sourceURL=js/modules/weather/weather.js