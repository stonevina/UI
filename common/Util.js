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
		},
		isIE6: $.browser.msie && 6 == $.browser.version,
		doc: "BackCompat" == document.compatMode ? document.body : document.documentElement,
		//页面级
		getClientWidth: function () {return this.doc.clientWidth;},
		//页面级
		getClientHeight: function () {return this.doc.clientHeight;},
		//文档级
		getDocWidth: function () {return Math.max(this.getClientWidth(), this.doc.scrollWidth);},
		//文档级
		getDocHeight: function () {return Math.max(this.getClientHeight(), this.doc.scrollHeight);},
		//获取滚动差
		getScrollTop: function () {return $(document).scrollTop()},
		//获取滚动差
		getScrollLeft: function () {return $(document).scrollLeft()}
	});

	return Util;
});