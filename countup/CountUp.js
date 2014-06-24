/**
 * @description: 数字滚动
 * @version: 1.0.0
 * @author: wolf
 * @time: 2014-06-24 17:58:17
 */
define(['../common/Base'], function (Class) {
	var CountUp = new Class;

	CountUp.include({
		init: function (opts) {
			var defaults = {
				//目标元素
				target: '',
				//起始值
				startVal: 0,
				//最终值
				endVal: 0,
				//小数位数
				decimals: 0,
				//动画持续时间
				duration: 2.5,
				//分隔符
				splitSign: '.',
				//动画停止后的回调
				complete: $.noop
			},
			settings = $.extend({}, defaults, opts);
			$.extend(this, settings);

			this.countDown = this.startVal > this.endVal ? true : false;
			this.startTime = 0;
			this.timeStam = 0;
			this.remaining = 0;
			this.frameVal = this.startVal;
			this.rAF = 0;
			this.decimals = Math.max(0, opts.decimals || 0);
			this.dec = Math.pow(10, this.decimals);
			this.duration = opts.duration * 1000 || 2000;
			this.originStartVal = this.startVal;

			this.initAnimationFrame();
		},
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
		easeOutExpo: function (t, b, c, d) {
			return c * (-Math.pow(2, -10 * t / d) + 1) * 1024 / 1023 + b;
		},
		count: function (timestamp) {
			if (this.startTime === null) this.startTime = timestamp;

			this.timestamp = timestamp;

			var progress = this.timestamp - this.startTime;
			this.remaining = this.duration - progress;
			
			if (this.countDown) {
				var i = (this.startVal - this.endVal) * (progress / this.duration);
				this.frameVal = this.startVal - i;
			} else {
				this.frameVal = this.startVal + (this.endVal - this.startVal) * (progress / this.duration);
			}
			
			this.frameVal = Math.round(this.frameVal*this.dec) / this.dec;
			
			if (this.countDown) {
                var i = this.easeOutExpo(progress, 0, this.startVal - this.endVal, this.duration);
                this.frameVal = this.startVal - i;
            } else {
                this.frameVal = this.easeOutExpo(progress, this.startVal, this.endVal - this.startVal, this.duration);
            }
			
			this.target.get(0).innerHTML = this.formatNumber(this.frameVal.toFixed(this.decimals));
				   
			if (progress < this.duration) {
				this.rAF = requestAnimationFrame($.proxy(this.count, this));
			} else {
				if (this.complete != null) this.complete();
			}
		},
		start: function () {
			if (!isNaN(this.endVal) && !isNaN(this.startVal)) {
				this.rAF = requestAnimationFrame($.proxy(this.count, this));
			} else {
				console.log('countUp error: startVal or endVal is not a number');
				this.d.innerHTML = '--';
			}
			
			return false;
		},
		stop: function () {
			cancelAnimationFrame(this.rAF);
		},
		resume: function () {
			this.startTime = null;
			this.duration = this.remaining;
			this.startVal = this.frameVal;
			requestAnimationFrame($.proxy(this.count, this));
		},
		reset: function () {
			this.startTime = null;
			this.startVal = this.originStartVal;
			cancelAnimationFrame(this.rAF);
			this.target.get(0).innerHTML = this.formatNumber(this.startVal.toFixed(this.decimals));
		},
		formatNumber: function (nStr) {
			var x, x1, x2;
			nStr += '';
			x = nStr.split('.');
			x1 = x[0];
			x2 = x.length > 1 ? this.splitSign + x[1] : '';
			return x1 + x2;
		}
	});

	return CountUp;
});