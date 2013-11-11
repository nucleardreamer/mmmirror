module.exports = function(server, ee, test) {

	var walk = require('walk'),
		fs = require('fs');
	if(!test){
		var io = require('socket.io').listen(server);
	} 
	var request = require('request'),
		qs = require('querystring'),
		Caress = require('caress-server'),
		_ = require('underscore'),
		_socket;

	// enable custom cookies on request
	var j = request.jar();
	request = request.defaults({
		jar: j
	});
	var cookie = null;

	if(!test){
		// socket config
		if (require('os').platform() !== 'win32') {
			io.enable("browser client minification");
			io.enable("browser client etag");
			io.enable("browser client gzip");
		}


		io.set("log level", 1);
		io.set("transports", [
			"websocket",
			"flashsocket",
			"htmlfile",
			"xhr-polling",
			"jsonp-polling"
		]);

		var caress = new Caress('127.0.0.1', 3333, {
			json: true
		});

		io.sockets.on('connection', function(socket) {
			_socket = socket;

			_io.api.init();

			ee.on('card.read', function(d) {
				socket.emit('card.read', d);
			});

			socket.on('load.scripts', _io.load.scripts);
			socket.on('load.templates', _io.load.templates);
			socket.on('load.moduleJson', _io.load.moduleJson);

			socket.on('api.test', _io.api.test);

			socket.on('init', function(args) {
				console.log(args)
			});

			caress.on('tuio', function(msg) {
				socket.emit('tuio', msg);
			});
		});
	}
	var _io = {
		api: {
			baseUrl: "http://10.9.255.222/gc-2.2",
			lat: "37.355780",
			lon: "-121.912537",
			user: null,
			init: function() {
				// do stuff
			},
			test: function(params, cb) {
				cb({a: 'ok', params: params});
			}
		},
		load: {
			scripts: function(cb) {
				var walker = walk.walk(__dirname + "/../public/js/modules"),
					store = [];

				walker.on("directories", function(root, dirs, next) {
					dirs.forEach(function(e) {
						if (e.name[0] !== '.' && e.name[0] !== '_') {
							store.push(e.name);
						}
					})
					next();
				});
				walker.on("end", function() {
					console.log('*** modules compiled');
					cb(store);
				});

			},
			templates: function(cb) {
				var walker = walk.walk(__dirname + "/../public/js/modules"),
					store = [];

				walker.on("directories", function(root, fileStats, next) {
					next();
				});
				walker.on("file", function(root, fileStats, next) {
					if (fileStats.name == 'main.tmpl.html') {
						fs.readFile(root + '/' + fileStats.name, {
							encoding: 'utf8'
						}, function(e, d) {
							store.push(d);
							next();
						});
					} else {
						next();
					}
				});
				walker.on("end", function() {
					cb(store);
				});
			},
			moduleJson: function(name, cb) {
				fs.readFile(__dirname + '/../public/js/modules/' + name + '/' + name + '.json', {
					encoding: 'utf8'
				}, function(e, d) {
					cb(d);
				});
			}
		}
	}

	return _io;
}