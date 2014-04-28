define(['./Base'], function(Class) {
	var Util = new Class;

	Util.extend({
		throttle : function(fn, delay) {
		    var timer = null;
		    return function() {
		        var context = this, args = arguments;
		        clearTimeout(timer);
		        timer = setTimeout(function() {
		            fn.apply(context, args);
		        }, delay);
		    };
		},
		hashTable : {},
		isIE6 : $.browser.msie && $.browser.version == 6,
		isEmpty : function(obj) {
			var name;
			for (name in obj) {
				return false;
			}
			return true;
		},
		setTimer : function(isBreak, func) {
			var timer = setInterval(function() {
				isBreak() ? clearInterval(timer) : func();
			}, 500);
		}
	});

	return Util;
});