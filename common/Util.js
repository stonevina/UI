define(function(require, exports, module) {
	var Class = require('./Base.js');
	var Util = new Class;

	Util.extend({
		_timer: [],
		//函数节流，主要用于低版本浏览器resize
		throttle: function (fn, delay) {
			var timer;

			for (var i = 0; i < this._timer.length; i++) {
	        	clearTimeout(this._timer[i]);
	        	this._timer = [];
	        }

	        timer = setTimeout(fn, delay);
	        this._timer.push(timer);
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
		},
		//动画帧
		initAnimationFrame: function () {
			//参考http://www.paulirish.com/2011/requestanimationframe-for-smart-animating/
			var lastTime = 0;
			var vendors = ['webkit', 'moz', 'ms'];
			
			for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
				window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
				window.cancelAnimationFrame =
				  window[vendors[x]+'CancelAnimationFrame'] || window[vendors[x] + 'CancelRequestAnimationFrame'];
			}
			
			if (!window.requestAnimationFrame) {
				window.requestAnimationFrame = function (callback, element) {
					var currTime = new Date().getTime();
					var timeToCall = Math.max(0, 16 - (currTime - lastTime));
					var id = window.setTimeout(function () { callback(currTime + timeToCall); },
					  timeToCall);
					lastTime = currTime + timeToCall;
					return id;
				}
			}
			
			if (!window.cancelAnimationFrame) {
				window.cancelAnimationFrame = function (id) {
					clearTimeout(id);
				}
			}
		},
		//检测事件
		isEventSupported: (function () {

		    var TAGNAMES = {
		      'select':'input','change':'input',
		      'submit':'form','reset':'form',
		      'error':'img','load':'img','abort':'img'
		    };

		    function isEventSupported (eventName) {

		      var el = document.createElement(TAGNAMES[eventName] || 'div');
		      eventName = 'on' + eventName;

		      var isSupported = (eventName in el);
		      if (!isSupported) {
		        el.setAttribute(eventName, 'return;');
		        isSupported = typeof el[eventName] == 'function';
		      }
		      el = null;

		      return isSupported;
		    }

		    return isEventSupported;
		})(),
		//补充文本，例如补零操作
		paddingTxt: function (direction, origin, txt, num, isPadding) {
			
			if (!isPadding) {return origin;}
		
			var origin = typeof origin == 'string' ? origin : '' + origin;
				
			while(origin.length < num) {
				//0是头部，1是尾部
				origin = direction == 0 ? txt + origin : origin + txt;
			}
			
			return origin;
		},
		//序列化JSON数据
		stringify: function (obj) {
			var arr = [], that = this;
			
			$.each(obj, function(key, val) {
				var next = '"' + key + '":';
				
				if($.isArray(obj)) {
					next = '';
				}
				
				next += $.isPlainObject(val) || $.isArray(val) ? that.stringify(val) : typeof val == 'number' ? val : '"' + val + '"';

				arr.push(next);
			});
			
			if($.isArray(obj)) {
				return '[' + arr.join() + ']';
			} else {
				return "{" + arr.join() + "}";
			}
			
		}
	});

	return Util;
});