/*
	blank module
*/

mmmirror.__proto__._clock = function(data) {

	var dfd 	= $.Deferred(),
		_this 	= this;
	
	// do setup to return a resolve or reject
	(function(){
		console.log('clock')
		dfd.resolve();
	})();
	
	return dfd.promise();

}
//@ sourceURL=js/modules/blank/blank.js