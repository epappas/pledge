/*
 * Copyright (c) 2013. Developer Evangelos Pappas
 */
var System = require("./system.js");
var pledge = require("../../../index.js");

if (typeof setImmediate === "undefined") {
	require('setimmediate');
}
module.exports = (function (redis, modQuery, memcached) {

	return {
		users: function (token, callback) {
			var started = Date.now();
			var page = (token.body.page || 0);
			modQuery.newModQuery() //
				.select() //
				.from("user") //
				.limit(page, System.conf.perPage)
				.sortBy('id')
				.execute(function (rows, err, sql) {
					if (err) {
						console.log(sql);
						console.log(err);
						callback(err, false);
						return;
					}

					pledge.lazyMap(rows,function (user, index, next) {
						user.deposit = 0;
						user.transactions = [];
						user.history = [];
						user.location = {
							lat: 0,
							lon: 0
						};

						modQuery.newModQuery()
							.select()
							.from("user_interactions")
							.filterBy("user_interactions", "uid").equals(user.id) //
							.sortBy('time', 'DESC')
							.execute(function (rows, err, sql) {
								if (err) {
									console.log(sql);
									console.log(err);
									next(user);
									return;
								}
								var doIncome = __doIncome0;
								var doLocation = __doLocation0;
								var incomeCounter = 0;
								var locationCounter = 0;
								rows.map(function (interaction, index) {
									switch (interaction.type) {
										case 0:
										case 1:
											doIncome(parseFloat(interaction.value));
											break;
										case 2:
										case 3:
										case 4:
										case 5:
											doLocation(JSON.parse(interaction.value));
											break;
									}
									return interaction;
								});
								next(user);

								// a patent to avoid ifs in long loops
								function __doIncome0(money) {
									user.deposit += money;
									user.transactions.push(money);
									if (++incomeCounter > 10) {
										doIncome = __doIncome1;
									}
									return user;
								}

								function __doIncome1(money) {
									user.deposit += money;
									return user;
								}

								function __doLocation0(loc) {
									user.location = loc;
									user.history.push(loc);
									doLocation = __doLocation1;
									++locationCounter;
									return user;
								}

								function __doLocation1(loc) {
									user.history.push(loc);
									if (++locationCounter > 10) {
										doLocation = __doLocation2;
									}
									return user;
								}

								function __doLocation2(loc) {
									return user;
								}
							});

					}).then(function (list, next) {
							callback(null, {
								status: "Success",
								took  : Date.now() - started,
								data  : list
							});
						});
				}); //
			return this;
		}
	};
});

