/*
 * Copyright (c) 2013. Developer Evangelos Pappas
 */
var events = require('events');
var conf = require("../conf/conf.js").conf();
global.systemInstance = null;
var system = (function () {

	function System() {
		this.dbioc = conf.dbioc;
	}

	// inherit
	(function (father) {
		// I am your Father!
		this.prototype = father;
		return this;
	}).call(System, new events.EventEmitter());

	System.prototype.getUuid = function () {
		for (var i = 0, a , b = a = ''; ++i < 36; b += (a += i) * 6.5 ? (a ^ 15 ? 8 ^ Math.random() * (a ^ 20 ? 16 : 4) : 4).toString(16) : '-');
		return b
	};

	return System;
})();

module.exports = __getInstance();

function __getInstance() {
	if (global.systemInstance == null) {
		return (global.systemInstance = new system());
	}
	return global.systemInstance;
}
