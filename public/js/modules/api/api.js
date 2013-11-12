/*
	api module
	events:

		search
		event('api.search').push({
			q: 'shoes', 
			cb: function 
		})

		details
		event('api.details').push({
			pid: 23482834, 
			cb: function 
		})
*/

mmmirror.__proto__._api = function() {
	var dfd = $.Deferred(),
		_this = this;

	// do setup to return a resolve or reject
	(function() {
		_this.event('api.weather').listen(weatherApi);
		return dfd.resolve();
	})();

	function weatherApi(cb){
		_this.event('api.weather').respush(function(data) {
			cb(data);
		});
	}

	return dfd.promise();

}
//@ sourceURL=js/modules/api/api.js