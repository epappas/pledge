/*
 * Copyright (c) 2013. Developer Evangelos Pappas
 */
var pledge = require("../../../index.js");
var System = require("./system.js");
var uuid = require("./modUUID.js");
var crypto = require('crypto');

var hex = uuid(16);
var hexUuid = new hex('xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx');
var hexEmail = new hex('xxxxx.xxxxx@gmail.com');
var hexUName = new hex('xxxxx xxxxx');
var hexPass = new hex('xxxxxxxx');
var hexPassSeed = new hex('xxx');

module.exports = (function (redis, modQuery, memcached) {

	return {
		users       : function (token, callback) {
			var started = Date.now();
			pledge.lazyRange(0, 1000,function (index, next) {

				var seed = hexPassSeed.get();
				var pass = crypto.createHash('md5').update(hexPass.get() + "" + seed).digest('hex');
				var email = hexEmail.get();

				modQuery.newModQuery()
					.insertInto("user")
					.insert("ukey", hexUuid.get())
					.insert("email", email)
					.insert("uname", hexUName.get())
					.insert("pass", pass)
					.insert("seed", seed)
					.insert("settings", "{}")
					.insert("status", 1)
					.insert("registered", Math.round(Date.now() / 1000))
					.insert("last_active", Math.round(Date.now() / 1000))
					.addParallel() // other row
					.insertInto("email_alias")
					.insert("alias_key", hexUuid.get())
					.insert("email", email)
					.insert("alias", email)
					.insert("status", 1)
					.execute(function (rows, err, sql) {
						if (err) {
							console.log(sql);
							console.log(err);
							next(null);
							return;
						}
						next(rows);
					});
			}).then(function (list, next) {
					callback(null, {
						status: "Success",
						took  : Date.now() - started,
						data  : list
					});
				});
		},
		interactions: function (token, callback) {
			var started = Date.now();

			modQuery.newModQuery()
				.select()
				.from("user")
				.execute(function (rows, err, sql) {
					if (err) {
						console.log(sql);
						console.log(err);
						next(null);
						return;
					}
					pledge.lazyMap(rows,function (user, index, next) {
						//--------------------------------------------------------
						pledge.lazyRange(0, 1000,function (index, next) {
							var interaction = Math.round(Math.random() * 5);
							var money = Math.random() * 1000;
							var lat = Math.random() * 90 * (Math.round(Math.random() * 2) > 1 ? 1 : -1);
							var lon = Math.random() * 90 * (Math.round(Math.random() * 2) > 1 ? 1 : -1);
							// insert a random interaction
							modQuery.newModQuery()
								.insertInto("User_Interactions")
								.insert("uid", user.id)
								.insert("time", Math.round(Date.now() / 1000) - (Math.round(Math.random() * 2678400)))
								.insert("type", interaction)
								.insert("`value`", (interaction < 2 ? money : JSON.stringify({
									lat: lat,
									lon: lon
								})))
								.execute(function (rows, err, sql) {
									if (err) {
										console.log(sql);
										console.log(err);
										next(null);
										return;
									}
									next(rows);
								});
						}).then(function () {
								next(index);
							});
						//-----------------------------------------------------------
					}).then(function (list, next) {
							callback(null, {
								status: "Success",
								took  : Date.now() - started,
								data  : list
							});
						});
				});
		}
	};
});