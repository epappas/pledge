/*
 * Copyright (c) 2013. Developer Evangelos Pappas
 */

var pledge = require("../lib/pledge.js");

//first Test
(function (test) {
	"use strict";
	pledge(function (myPledge) {
		myPledge.then(function (index, next) {
			log("TEst: " + test + ", " + index + " -- INNER 1");
			next(++index);
		});
		setTimeout(function () {
			myPledge.then(function (index, next) {
				log("TEst: " + test + ", " + index + " -- INNER 2");
				next(++index);
			});
			myPledge.resolve(0);
		}, 100)
	}).then(function (index, next) {
			log("TEst: " + test + ", " + index + " ");
			next(++index);
		}).then(function (index, next) {
			log("TEst: " + test + ", " + index + " ");
			next(++index);
		}).then(function (index, next) {
			log("TEst: " + test + ", " + index + " ");
			next(++index);
		}).then(function (index, next) {
			log("TEst: " + test + ", " + index + " ");
			next(++index);
		}).then(function (index, next) {
			log("TEst: " + test + ", " + index + " ");
			next(++index);
		});
})(1);

//second Test
(function (test) {
	"use strict";
	pledge(function (myPledge) {
		myPledge.then(function (arr, next) {
			arr.push(Date.now());
			log("TEst: " + test + ", " + arr + " -- INNER 1");
			next(arr);
		});
		setTimeout(function () {
			myPledge.then(function (arr, next) {
				arr.push(Date.now());
				log("TEst: " + test + ", " + arr + " -- INNER 2");
				next(arr);
			});
			myPledge.resolve([Date.now()]);
		}, 100)
	}).then(function (arr, next) {
			arr.push(Date.now());
			log("TEst: " + test + ", " + arr + " ");
			setTimeout(function () {
				next(arr);
			}, 100);
		}).then(function (arr, next) {
			arr.push(Date.now());
			log("TEst: " + test + ", " + arr + " ");
			setTimeout(function () {
				next(arr);
			}, 100);
		}).then(function (arr, next) {
			arr.push(Date.now());
			log("TEst: " + test + ", " + arr + " ");
			setTimeout(function () {
				next(arr);
			}, 100);
		}).then(function (arr, next) {
			arr.push(Date.now());
			log("TEst: " + test + ", " + arr + " ");
			setTimeout(function () {
				next(arr);
			}, 100);
		}).then(function (arr, next) {
			arr.push(Date.now());
			log("TEst: " + test + ", " + arr + " ");
			setTimeout(function () {
				next(arr);
			}, 100);
		});
})(2);

//third Test
(function (test) {
	"use strict";
	var p = pledge(function (myPledge) {
		setTimeout(function () {
			myPledge.then(function (arr, next) {
				arr.push(Date.now());
				log("TEst: " + test + ", " + arr.length + " -- END");
				next(arr);
			});
			myPledge.resolve([Date.now()]);
		}, 100)
	});
	for (var i = 0; i < 10000; ++i) {
		if (i % 100 === 0) {
			(function (index) {
				p.then(function (arr, next) {
					arr.push(Date.now());
					log("TEst: " + test + ", Progress " + arr.length + " " + index);
					next(arr);
				});
			})(i);
		}
		else {
			(function (index) {
				p.then(function (arr, next) {
					arr.push(Date.now() + " " + index);
					next(arr);
				});
			})(i);
		}
	}
})(3);

//forth Test
(function (test) {
	"use strict";
	pledge.map([0, 1, 2, 3, 4, 5, 6, 7, 8, 9],function (value) {
		return value * ++value;
	}).then(function (list) {
			log("Test: " + test + " " + list);
		})
})(4);

//fifth Test
(function (test) {
	"use strict";
	pledge.range(0, 10,function (index) {
		return index + " " + Date.now();
	}).then(function (list) {
			log("Test: " + test + " " + list);
		})
})(5);

//sixth Test
(function (test) {
	"use strict";
	pledge.lazyMap([0, 1, 2, 3, 4, 5, 6, 7, 8, 9],function (value, index, next) {
		setTimeout(function () {
			next(value * ++value)
		}, 10);
	}).then(function (list) {
			log("Test: " + test + " " + list);
		})
})(6);

//seventh Test
(function (test) {
	"use strict";
	pledge.lazyRange(0, 10,function (index, next) {
		setTimeout(function () {
			next(index + " " + Date.now())
		}, 10);
	}).then(function (list) {
			log("Test: " + test + " " + list);
		})
})(7);


function log(str) {
	"use strict";
	console.log("Log[" + Date.now() + "] " + str);
	return this;
}
function err(str) {
	"use strict";
	console.log("Error[" + Date.now() + "] " + str);
	return this;
}
function warn(str) {
	"use strict";
	console.log("Warning[" + Date.now() + "] " + str);
	return this;
}
