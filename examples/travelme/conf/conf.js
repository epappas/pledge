/*
 * Copyright (c) 2013. Developer Evangelos Pappas
 */


var conf = function () {
	var conf = {};
	return (function (conf) {
		'use strict';

		conf = require("./ioc.conf.json");
		var confSet = require("./config.json");
		var def = confSet["defaultSet"];
		var tmpConf = confSet[def];
		process.argv.forEach(function (val) {
			if (val.split("mode").length > 1) {
				switch (val) {
					case "-mode:debug":
						tmpConf = confSet.debugging;
						break;
					case "-mode:dev":
						tmpConf = confSet.dev;
						break;
					case "-mode:enterprise":
						tmpConf = confSet.enterprise;
						break;
				}
			}
		});

		for (var prop in tmpConf) {
			conf[prop] = tmpConf[prop];
		}

		return conf;
	})(conf || (conf = {}));
};

exports.conf = conf;
global.conf = conf();