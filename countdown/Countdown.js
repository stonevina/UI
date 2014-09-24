/**
 * @description: 倒计时
 * @version: 1.0.0
 * @author: wolf
 * @time: 2014-09-24 15:34:32
 */
define(['../common/Base', '../common/Util'], function (Class, Util) {
	var Countdown = new Class;

	Countdown.include({
		init: function (opts) {
			var defaults = {
				//开始时间
				beginTime: '',
				//结束时间
				endTime: '',
				//倒计时过程中的回调
				onchange: $.noop,
				//倒计时结束时的回调
				onEnd: $.noop
			},
			settings = $.extend({}, defaults, opts);
			$.extend(this, settings);
			
			this.precision = 1000;
			this.beginTime = this.beginTime ? new Date(this.beginTime) : new Date();
			
			this.start();
		},
		getLeaveTime: function () {
			this.beginTime += this.precision;
			this.beginTime = new Date(this.beginTime).getTime();
			this.endTime = new Date(this.endTime).getTime();
			
			var leaveTime = (this.endTime - this.beginTime) / 1000;
			
			this.leaveTimeObj = {
				day: Math.floor(leaveTime / 24 / 60 / 60),
				hour: Math.floor(leaveTime / (60 * 60)) % 24,
				minute: Math.floor(leaveTime / 60) % 60,
				second: leaveTime % 60
			};
			
			this.onchange.call(this, this.leaveTimeObj);
			leaveTime == 0 && this.stop.call(this);
		},
		start: function () {
			this.timer = setInterval($.proxy(this.getLeaveTime, this), this.precision);
		},
		stop: function () {
			clearInterval(this.timer);
			this.timer = null;
			this.onEnd.call(this);
		}
	});

	return Countdown;
});