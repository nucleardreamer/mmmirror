/*
	blank module
*/

mmmirror.__proto__._blank = function(data) {

	var dfd 	= $.Deferred(),
		_this 	= this;
	
	// do setup to return a resolve or reject
	(function(){

		dfd.resolve();
	})();
	
	return dfd.promise();

}
//@ sourceURL=js/modules/blank/blank.js