/*
	blank module
*/

mmmirror.__proto__._loader = function(data) {

	var dfd 	= $.Deferred(),
		_this 	= this;
	
	// do setup to return a resolve or reject
	(function(){
		_this.event('templatesLoaded').listen(function(){
			var cl = new CanvasLoader('loader');
			cl.setColor('#00b7ff'); // default is '#000000'
			cl.setDiameter(120); // default is 40
			cl.setDensity(16); // default is 40
			cl.setRange(1.2); // default is 1.3
			cl.setFPS(20); // default is 24
			cl.show(); // Hidden by default
		});
		dfd.resolve();
	})();
	
	return dfd.promise();

}
//@ sourceURL=js/modules/loader/loader.js