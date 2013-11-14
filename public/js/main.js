var debug = true;

var mmmirror = (function() {

	_ee = new EventEmitter();

	var main = function(args) {
		this.args = args;
		this.mod;
		this.socket = io.connect('http://'+document.location.hostname+':' + port);
		if (this.init) this.init();
	}

	main.prototype.init = function() {
		var _this = this;

		_this.socket.emit('init', _this.args);
		_this.load.scripts.call(_this);

		_this.binaryClient = new BinaryClient('ws://'+window.location.hostname+':9000');
		_this.binaryStream = null;
		_this.binaryClient.on('open', function(){
			console.log('*** binary client open')
			_this.event('binary-open').push({});
		})
		_this.event('scriptsLoaded').listen(function() {
			_this.load.templates.call(_this);
		});
	}

	main.prototype.load = {

		scripts: function() {
			var _this = this;
			_this.socket.emit('load.scripts', function(d) {
				// d is the list of plugin directories
				var loaders = [];
				_.each(d, function(e) {
					loaders.push($.ajax({
						// assume the script name is the folder + js
						url: "js/modules/" + e + "/" + e + ".js",
						dataType: 'script',
						async: false,
						context: _this,
                        cache: true
					}));
				});
				// just to make sure the dom is ready
				loaders.push($.Deferred(function(dfd) {
					$(dfd.resolve)
				}));
				$.when(loaders).done(function(data) {
					loaders.length = 0;
					_.each(d, function(e, i, l) {
						_this.socket.emit('load.moduleJson', e, function(d) {
							loaders.push(_this['_' + e](JSON.parse(d)));
						})
					});
					$.when.apply(_this, loaders).done(function() {
						_this.event('scriptsLoaded').push({
							done: true
						});
					})
				});
			});
		},
		templates: function() {
			var _this = this;

			_this.socket.emit('load.templates', function(d) {
				_.each(d, function(e) {
					var data = $(e);
					data.each(function(k, v) {
						var _item = $(v)[0];
						if (_item.nodeName == 'SCRIPT') {
							$.templates(_item.getAttribute('id'), _item.innerHTML.trim());
						}
					});
				});
				_this.event('templatesLoaded').push({
					'done': true
				});
			})
		}
	}
	main.prototype.event = function(namespace) {
		var _this = this;
		return {
			listen: function(func, toserver) {
				if (typeof toserver !== undefined && toserver == true) {
					_this.socket.on(namespace, func);
				}
				_ee.addListener(namespace, func);
				return this;
			},
			push: function(msg, toserver) {
				if (debug) console.log('EVENT: ' + namespace + ' ' + JSON.stringify(msg));
				if (typeof toserver !== undefined && toserver == true) {
					_this.socket.emit(namespace, msg);
				}
				_ee.emit(namespace, msg);
				return this;
			},
			respush: function() {
				var args = _.flatten(new Array(namespace, arguments));
				_this.socket.emit.apply(_this.socket, args);
				return this;
			}
		}
	}

	return main;

})(jQuery)

$.views.helpers({
	log: function(d){
		console.log(d);
		return '';
	},
	commaJoinArray: function(arr){
		return arr.join(', ');
	},
	joinArtists: function(arr){
		var toRet = [];
		_.each(arr, function(e){
			toRet.push(e.name);
		});
		return toRet.join(', ');
	}
});

mmmirror = new mmmirror({
	name: 'mmmirror',
	defaultPage: '/',
	selectors: {
		main: '#container'
	}
});