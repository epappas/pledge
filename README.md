Pledge (0.1.0)
==========================
A lightweight & simplified Promises Module. It aims to wrap the submitted asynchronous tasks with the lightest and
most efficient way, as it respects performance and simplicity.

Go to examples and hack with travelme example.

Its is not yet published to npm. It'll soon be.

Basic Use

	pledge(function (myPledge) {
		// First called function ...
		// you may append to your flow
		myPledge.then(function (index, next) {
			log(" My Index should equals 2 == " + index);
			next(++index);
		});
		setTimeout(function () {
			// or append asynchronously
			myPledge.then(function (index, next) {
			log(" My Index should equals 3 == " + index);
				next(++index);
			});
			myPledge.resolve(0);
		}, 100)
	}).then(function (index, next) {
			log(" My Index should equals 0 == " + index);
			next(++index);
		}).then(function (index, next) {
			log(" My Index should equals 1 == " + index);
			next(++index);
		})

An other use

	var p = pledge();
	// ... after ages has gone ...

	p.then(function (arr, next) {
		// do awesome stuff here
		arr.push(Date.now());
		next(arr);
	}).onError(function(err) { // can both use onError like this
		console.error(err);
		console.error(err.stack);
	}).then(function (arr, next) {
		// do awesome stuff here
		arr.push(Date.now());
		next(arr);
	}, function(err) { // or use onError like that
		console.error(err);
		console.error(err.stack);
	});

## WireTap your message ##
You may even wireTap synchronously your message. Wiretap will broadcast your last result to your handlers. But never
affect the resulted object, or pass any result to the next step.

	pledge(function (myPledge) {
		// do awesome stuff here
		var arr = [Date.now()];
		myPledge.resolve(arr);
	}).wireTap(function (myPledge, arr) {
      		// do awesome stuff here
      		console.log(arr);
		}).wireTap(function (myPledge, arr) {
			// do awesome stuff here
			console.log(arr);
		}).then(function (arr, next) {
			// do awesome stuff here
			arr.push(Date.now());
			next(arr);
		}).wireTap(function (myPledge, arr) {
			// do awesome stuff here
			console.log(arr);
		}).then(function (index, next) {
			// do awesome stuff here
			// I'm last here
		})

## Process Lists, Arrays ##
Each spin is asynchronous

	pledge.map([0, 1, 2, 3, 4, 5, 6, 7, 8, 9], function (value) {
    		return value * ++value;
	}).then(function (list) {
			//list === [0,2,6,12,20,30,42,56,72,90]
		});

## Ranged loop ##
Each spin is asynchronous

	pledge.range(0, 10,function (index) {
		return index + " " + Date.now();
	}).then(function (list) {
			//list === [0 1381743180028,1 1381743180029,2 1381743180029,3 1381743180029,4 1381743180029,
			//				5 1381743180029,6 1381743180029,7 1381743180029,8 1381743180029,9 1381743180029]
		});

## Lazy Loops ##

	pledge.lazyMap([0, 1, 2, 3, 4, 5, 6, 7, 8, 9],function (value, index, next) {
		setTimeout(function () {
			next(value * ++value)
		}, 10);
	}).then(function (list) {
			//list === [0,2,6,12,20,30,42,56,72,90]
		});

The same exists for ranged loops

	pledge.lazyRange(0, 10,function (index, next) {
		setTimeout(function () {
			next(index + " " + Date.now())
		}, 10);
	}).then(function (list) {
			//list === [0 1381743180047,1 1381743180058,2 1381743180078,3 1381743180098,4 1381743180108,
			//				5 1381743180128,6 1381743180159,7 1381743180182,8 1381743180198,9 1381743180213]
		});

## TODO ##

-- Ranged loops with conditions
-- Event Emitter as each step results a value. It comes in handy when logging.
-- publish to npm

## I found a bug ##

- First drink a beer,
- then create an issue,
- then pray & have faith.

Have fun :)