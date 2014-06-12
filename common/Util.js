define(['./Base'], function(Class) {
	var Util = new Class;

	Util.extend({
		//函数节流，主要用于低版本浏览器resize
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
		//延迟执行
		setTimer: function (isBreak, func) {
			var timer = setInterval(function () {
				isBreak() ? clearInterval(timer) : func();
			}, 500);
		},
		isIE6: $.browser.msie && 6 == $.browser.version,
		//获取文档根元素
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
		getScrollLeft: function () {return $(document).scrollLeft()},
		//阻止默认事件
		preventDefault: function (e) {
			if (!e) {
			    return;
			}
			if (e.preventDefault) {
			    e.preventDefault();
			} else {
			    e.returnValue = false;
			}
		},
		//阻止冒泡
		preventPropagation: function (e) {
            if (!e) {
                return;
            }
            if (e.stopPropagation) {
                e.stopPropagation();
            }
            e.cancelBubble = true;
		}
	});

	return Util;
});