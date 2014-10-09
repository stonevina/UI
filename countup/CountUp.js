/**
 * @description: 正计时
 * @version: 1.0.0
 * @author: wolf
 * @time: 2014-09-25 13:38:32
 */
define(['../common/Base', '../common/Util'], function (Class, Util) {
	var CountUp = new Class;

	CountUp.include({
		init: function (opts) {
			var defaults = {
				//开始时间
				beginTime: '',
				//间隔精度
				precision: 1000,
				//是否保留两位
				isTwoDigital: true,
				//正计时过程中的回调
				onchange: $.noop,
				//正计时结束时的回调
				onEnd: $.noop
			},
			settings = $.extend({}, defaults, opts);
			$.extend(this, settings);
			
			this.beginTime = (this.beginTime ? new Date(this.beginTime) : new Date()).getTime();
			this.currentTime = this.beginTime;
			
			this.start();
		},
		//获取持续时间
		getLastTime: function () {
			this.currentTime += this.precision;
			var lastTime = (this.currentTime - this.beginTime) / 1000;
			var milliPrecision = Math.min(this.precision * 10, 1000);
			
			this.lastTimeObj = {
				day: Util.paddingTxt(0, Math.floor(lastTime / 24 / 60 / 60), 0, 2, this.isTwoDigital),
				hour: Util.paddingTxt(0, Math.floor(lastTime / (60 * 60)) % 24, 0, 2, this.isTwoDigital),
				minute: Util.paddingTxt(0, Math.floor(lastTime / 60) % 60, 0, 2, this.isTwoDigital),
				second: Util.paddingTxt(0, Math.floor(lastTime % 60), 0, 2, this.isTwoDigital),
				millisecond:  Util.paddingTxt(0, Math.floor(lastTime * milliPrecision % milliPrecision), 0, Math.log(1000) / Math.log(milliPrecision), this.isTwoDigital)
			};
			
			this.onchange.call(this, this.lastTimeObj);
			lastTime == 0 && this.stop.call(this);
		},
		//当小于1s的时候，chrome浏览器会做优化，当前的标签隐藏时，js将停止执行
		start: function () {
			this.timer = setInterval($.proxy(this.getLastTime, this), this.precision);
		},
		stop: function () {
			clearInterval(this.timer);
			this.timer = null;
			this.onEnd.call(this);
		}
	});

	return CountUp;
});