//if(true) process.env.NODE_ENV = 'production';
process.env['DAEMON'] = false;
process.argv.forEach(function (v, i, a) {
	if(v == '-daemon'){
		process.env['DAEMON'] = true;
		console.log('daemon running on: '+__dirname);
	}
});

var express = require('express'),
    http = require('http'),
    color = require('colors'),
    fs = require('fs'),
    cp = require('child_process'),
    BinaryServer = require('binaryjs').BinaryServer;

var EventEmitter = require("events"),
	ee = new EventEmitter.EventEmitter();

var app = express(),
    env = app.settings.env,

    // dev+prod config
    conf = require('./settings/config'),
    settings = conf.settings;

conf(app, express, env);

// server config
require('./cfg').cfg(app);

// routes
require('./routes/index')(app, settings);

var server = http.createServer(app);
var spot = require('./lib/spotify')();
var spotify = new spot();

var es = require('./lib/socketServer')(server, ee, false, spotify);

// binary server
var bs = BinaryServer({port: 9000});
bs.on('connection', function(client){
    console.log('*** binary connection'.bold.inverse.green);
    client.on('stream', spotify.playTrack);
});

server.listen(settings.port, function() {
    console.log("Express server listening on " + " port %d ".bold.inverse.red + " in " + " %s mode ".bold.inverse.green + " with " + "debug flag: %s ".bold.inverse.yellow + " //", settings.port, env, settings.debug);
});

process.on('uncaughtException', function (err) {
    console.log(err)
});

