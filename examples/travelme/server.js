/*
 * Copyright (c) 2013. Developer Evangelos Pappas
 */
var conf = require("./conf/conf.js").conf();
var System = require("./hooks/system.js");
var pledge = require("../../index.js");
var express = require('express');
var io = require('socket.io');
var redis = require("redis");
var modQ = require("modquery");
var http = require('http');
var events = require('events');
var util = require('util');
var crypto = require('crypto');
var Memcached = require('memcached');

if (typeof setImmediate === "undefined") {
	require('setimmediate');
}

// initiations of clients
var memcached = new Memcached("localhost:11211");
var redisClient = redis.createClient();
var port = (process.env.PORT || conf.port);
var app = express();
var server = http.createServer(app);

var modQuery = new modQ({
	dbArgs: conf.mysql
});

// globalize
System.conf = conf;
System.modQuery = modQuery;
System.memcached = memcached;
System.interactions = {
	INCOME   : 0,
	SPEND    : 1,
	TRAVEL   : 2,
	RETURN   : 3,
	ONPLANE  : 4,
	DISEMBARK: 5
};

// Require hooks
var generate = require("./hooks/generate.js");
var list = require("./hooks/list.js");

process.on('uncaughtException', function (err) {
	console.error(err);
	console.error(err.stack);
});

//Setup Express
app.configure(function () {
	app.use(express.methodOverride());
	app.use(express.bodyParser());
	app.use(express.logger('dev'));
	app.use(express.cookieParser('secret'));
	app.use(app.router);
});

/* SOLVES THE CORS PROBLEM */
app.all('/*', function (req, res, next) {
	res.header("Access-Control-Allow-Origin", "localhost");
	res.header("Access-Control-Allow-Headers", 'Content-Type, X-Requested-With');
	res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
	res.header('Access-Control-Allow-Credentials', 'true');
	next();
});

/**
 * handle OPTIONS requests from the browser
 */
app.options("*", function (req, res, next) {
	res.send(200);
});

app.listen(port);

//Setup Socket.IO
io.listen(server).sockets.on('connection', function (socket) {
	console.log('Client Connected on WS');
	socket.on('message', function (data) {
		console.log('WS received :', data);
	});
	socket.on('disconnect', function () {
		console.log('Client Disconnected.');
	});
});

console.log('Listening on http://0.0.0.0:' + port);

///////////////////////////////////////////
//              Routes                   //
///////////////////////////////////////////

app.post('/status', function (req, res, next) {
	res.send({state: "running"});
	res.end();
});
app.get('/status', function (req, res, next) {
	res.send({state: "running"});
	res.end();
});

app.post('/list', function (req, res, next) {
	pledge(function (myPledge) {
		__checkCache(req, res, next, function (req, res, next) {
			myPledge.resolve(req, res, next);
		});
	}).then(function (req, res, next) {
			list(redisClient, modQuery, memcached)
				.users(req, function (err, token) {
					if (token) {
						res.writeHead(200, { 'Content-Type': 'application/json' });
						res.write(JSON.stringify(token));
						res.end();
						return;
					}
					next();
				});
		});
});
app.post('/generate/users', function (req, res, next) {
	pledge(function (myPledge) {
		__checkCache(req, res, next, function (req, res, next) {
			myPledge.resolve(req, res, next);
		});
	}).then(function (req, res, next) {
			generate(redisClient, modQuery, memcached)
				.users(req, function (err, token) {
					if (token) {
						res.writeHead(200, { 'Content-Type': 'application/json' });
						res.write(JSON.stringify(token));
						res.end();
						return;
					}
					next();
				});
		});
});
app.post('/generate/interactions', function (req, res, next) {
	pledge(function (myPledge) {
		__checkCache(req, res, next, function (req, res, next) {
			myPledge.resolve(req, res, next);
		});
	}).then(function (req, res, next) {
			generate(redisClient, modQuery, memcached)
				.interactions(req, function (err, token) {
					if (token) {
						res.writeHead(200, { 'Content-Type': 'application/json' });
						res.write(JSON.stringify(token));
						res.end();
						return;
					}
					next();
				});
		});
});

function __checkCache(req, res, next, callback) {
	var token = (req.body.token || "none");
	memcached.get(token, function (err, ressult) {
		if (err) {
			console.error(err);
			console.error(ressult);
			callback(req, res, next); // not sure what's going on, lets recompute
			return;
		}
		if (!ressult) { // req not cached
			callback(req, res, next);
			return;
		}
		res.send(ressult);
	});
}
