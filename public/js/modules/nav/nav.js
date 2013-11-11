/*
	navigation module

	nav.init
		fires when the nav is ready
		• path: curent path of the window after default check

	nav.change
		fires when the location changes
		• last: the last hash (coming from page)
		• next: hash being navigated to (going to page)
*/

mmmirror.__proto__._nav = function() {
	var dfd = $.Deferred(),
		_this = this,
		lastPage;

	// do setup to return a resolve or reject
	(function() {
		var curPage = $.address.path(),
			defaultPage = _this.args.defaultPage;

		// default page setup if it exists
		if (typeof defaultPage !== 'undefined' && defaultPage) {
			if (curPage !== defaultPage) $.address.value(defaultPage);
			curPage = defaultPage;
		}
		_this.event('nav.init').push({
			path: curPage
		});

		lastPage = curPage;

		bindNavigation();

		return dfd.resolve();
	})();

	function bindNavigation(){
		$.address.change(function(e) {
			_this.event('nav.change').push({
				last: lastPage,
				next: e.path
			});
			lastPage = e.path;
		})
	}

	return dfd.promise();

}
//@ sourceURL=js/modules/nav/nav.js