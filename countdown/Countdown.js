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
				//间隔精度
				precision: 1000,
				//是否保留两位
				isTwoDigital: true,
				//倒计时过程中的回调
				onchange: $.noop,
				//倒计时结束时的回调
				onEnd: $.noop
			},
			settings = $.extend({}, defaults, opts);
			$.extend(this, settings);
			
			this.beginTime = this.beginTime ? new Date(this.beginTime) : new Date();
			this.baseTime = new Date().getTime();
			this.endTime = new Date(this.endTime).getTime();
			
			this.start();
		},
		getLeaveTime: function () {
			var now = new Date().getTime();
			var fixValue = now - this.baseTime;
			
			//开始时间使用服务器时间，客户端修改时间容错处理
			if (Math.abs(fixValue) / 1000 > 2) {
				this.beginTime = new Date($.ajax({async: false, type: 'head'}).getResponseHeader('Date')).getTime();;
				//this.baseTime = this.beginTime;
				this.baseTime = new Date().getTime();
			} else {
				this.beginTime = new Date(this.beginTime).getTime() + fixValue;
				this.baseTime = now;
			}
			
			var leaveTime = Math.max((this.endTime - this.beginTime) / 1000, 0);
			var milliPrecision = Math.min(this.precision * 10, 1000);
			
			this.leaveTimeObj = {
				day: Util.paddingTxt(0, Math.floor(leaveTime / 24 / 60 / 60), 0, 2, this.isTwoDigital),
				hour: Util.paddingTxt(0, Math.floor(leaveTime / (60 * 60)) % 24, 0, 2, this.isTwoDigital),
				minute: Util.paddingTxt(0, Math.floor(leaveTime / 60) % 60, 0, 2, this.isTwoDigital),
				second: Util.paddingTxt(0, Math.floor(leaveTime % 60), 0, 2, this.isTwoDigital),
				//millisecond:  Util.paddingTxt(0, Math.floor(leaveTime * milliPrecision % milliPrecision), 0, Math.log(1000) / Math.log(milliPrecision), this.isTwoDigital)
				millisecond: Util.paddingTxt(0, Math.floor(leaveTime * 1000 % 1000), 0, 3, true)
			};
			
			this.onchange.call(this, this.leaveTimeObj);
			this.timer = setTimeout($.proxy(this.getLeaveTime, this), this.precision);
			
			if (leaveTime == 0) {
				this.stop.call(this);
				return;
			}
		},
		start: function () {
			this.getLeaveTime();
		},
		stop: function () {
			clearInterval(this.timer);
			this.timer = null;
			this.onEnd.call(this, this.leaveTimeObj);
		}
	});

	return Countdown;
});