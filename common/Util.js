define(['./Base'], function(Class) {
	var Util = new Class;

	Util.extend({
		throttle: function (fn, delay) {
		    var timer = null;
		    return function () {
		        var context = this, args = arguments;
		        clearTimeout(timer);
		        timer = setTimeout(function () {
		            fn.apply(context, args);
		        }, delay);
		    };
		},
		setTimer: function (isBreak, func) {
			var timer = setInterval(function () {
				isBreak() ? clearInterval(timer) : func();
			}, 500);
		}
	});

	return Util;
});