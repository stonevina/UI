/**
 * @description: 滑块
 * @version: 1.0.0
 * @author: jd.com
 * @time: 2014-08-05 10:17:13
 */
$.fn.sliderBar = function (opts) {
	var defaults = {
		//滑块对象
		barEle: '.dray_cur',
		//滑块的方向，横向 or 纵向
		direction: 'x',
		//当前值
		currentValue: 0,
		//最小值
		minWidth: 0,
		//最大值
		maxWidth: 0,
		//最小值（必须）
		minValue: 0,
		//最大值（必须）
		maxValue: 0,
		//减号元素
		minusBtn: '.minus',
		//加号元素
		plusBtn: '.add',
		//单次滑动步长
		step: 1,
		//自定义刻度
		scaleVal: [0, 100, 200, 500, 1024 * 1, 1024 * 1.5, 1024 * 2, 1024 * 4, 1024 * 8, 1024 * 16, 1024 * 20],
		//单个元素宽度
		itemWidth: 44.9,
		//是否特殊化处理
		isSpecial: false,
		//滑动过程中的回调
		//第一个参数为滑块对象，第二个参数为当前滑块位置，第三个参数为滑动条的最大位移,第四个参数为当前值
		draging: function () {},
		//滑动结束后的回调
		//第一个参数为滑块对象，第二个参数为当前滑块位置，第三个参数为滑动条的最大位移,第四个参数为当前值
		complete: function () {}
	};
	
	opts = $.extend({}, defaults, opts);
	
	var init = function () {
		this.minWidth = opts.minWidth || 0;
		this.maxWidth = opts.maxWidth || parseInt($(this).width(), 10);
		
		this.minValue = opts.minValue;
		this.maxValue = opts.maxValue;
		
		this.isDrap = false;
		this.currentValue = opts.currentValue || 0;
		
		this.bar = $(opts.barEle, this);
		
		bindEvent.call(this);
		move.call(this, this.currentValue);
		
		// var vll = opts.scaleVal;
		// //改变刻度值。
		// $('#network .pb_bar_txt .fy').each(function (k, v) {
			// $(this).text(vll[k]);
		// });
	};
	
	//特殊化处理----start---
	var belongRange = function (item, arr) {
		for (var i = 0, l = arr.length; i < l; i++) {
			if (item < arr[i]) {
				return Math.max(i - 1, 0);
			}
			
			if (item == arr[i]) {
				return i;
			}
		}
	};
	
	var getIntervalRange = function (interval, itemWidth) {
		var arr = []; 
		
		for (var i = 0, l = interval.length; i < l; i++) {
			var temp = +(interval[i] / itemWidth).toFixed(2);
			arr.push(temp);
		}
	
		return arr;
	};
	
	var getInterval = function (range) {
		var arr = [];
		
		for (var i = 0; i < range.length - 1; i++) {
			arr.push(range[i + 1] - range[i]);
		}
		
		return arr;
	};
	
	var itemWidth = opts.itemWidth;
	var range = opts.scaleVal;
	var interval = opts.isSpecial && getInterval(range);
	var intervalRange = opts.isSpecial && getIntervalRange(interval, itemWidth);
	
	var getCalWidth = function (value) {
		var index = belongRange(value, range);
		
		return Math.floor(index * itemWidth + ((value - range[index]) / intervalRange[index] || 0));
	};
	
	var getCalVal = function (width) {
		var index = Math.floor(width / itemWidth);
		var remainWidth = +(width - index * itemWidth).toFixed(2);
		
		return Math.floor(range[index] + (remainWidth * intervalRange[index] || 0));
	};
	
	var specialMove = function (value, width) {		
		value = Math.max(Math.min(value, this.maxValue), this.minValue);
		width = width || getCalWidth(value);
		
		width = Math.max(Math.min(width, this.maxWidth), this.minWidth);
		value = Math.floor(value || getCalVal(width));
		
		this.currentValue = value;
		this.bar.parent().width(width);
		opts.draging.call(this, this.bar, width, this.maxWidth, this.currentValue);
		
		return false;
	};
	//特殊化处理----end---
	
	var move = function (value, width) {
		
		if (opts.isSpecial) {
			specialMove.call(this, value, width);
			return;
		}
	
		value = Math.max(Math.min(value, this.maxValue), this.minValue);
		width = width || value / this.maxValue * this.maxWidth;
		
		width = Math.max(Math.min(width, this.maxWidth), this.minWidth);
		value = Math.floor(value || width / this.maxWidth * this.maxValue);
		
		this.currentValue = value;
		this.bar.parent().width(width);
		opts.draging.call(this, this.bar, width, this.maxWidth, this.currentValue);
		
		return false;
	};
	
	var bindEvent = function () {
		var that = this, timeoutTimer, intervalTimer;
		
		$(this).bind('click', function (e) {

			var filterEle = [$(opts.minusBtn, this).get(0), $(opts.plusBtn, this).get(0), $(opts.barEle, this).get(0)];
			
			for (var i = 0, l = filterEle.length; i < l; i++) {
				if (e.target == filterEle[i]) return;
			}
			
			var offLeft = $(opts.barEle, this).offset().left;
			var x = e.clientX;
			var width = parseInt(that.bar.parent().width(), 10);
			
			width = width + x - offLeft;
			move.call(that, '', width);
		});
		
		//滑块对象
		$(opts.barEle, this).bind('mousedown', function (e) {
		
			that.x = e.clientX;
			that.width = parseInt(that.bar.parent().width(), 10);
			that.isDrap = true;
			
			return false;
		});
		
		//- 按钮
		$(opts.minusBtn, this).bind('mousedown', function (e) {
			if (timeoutTimer) clearTimeout(timeoutTimer);
			timeoutTimer = setTimeout(function () {
				intervalTimer = setInterval(function () {
					var value = that.currentValue - opts.step;
					move.call(that, value);
				}, 150);
			}, 100);
		});
		
		//- 按钮
		$(opts.minusBtn, this).bind('click', function (e) {			
			var value = that.currentValue - opts.step;
			move.call(that, value);
		});
		
		//- 按钮
		$(opts.minusBtn, this).bind('mouseup mouseout', function (e) {
			clearTimeout(timeoutTimer);
			clearInterval(intervalTimer);
		});
		
		//+ 按钮
		$(opts.plusBtn, this).bind('mousedown', function (e) {
			if (timeoutTimer) clearTimeout(timeoutTimer);
			timeoutTimer = setTimeout(function () {
				intervalTimer = setInterval(function () {
					var value = that.currentValue + opts.step;
					move.call(that, value);
				}, 150);
			}, 100);
		});
		
		//+ 按钮
		$(opts.plusBtn, this).bind('click', function (e) {
			var value = that.currentValue + opts.step;
			move.call(that, value);
		});
		
		//+ 按钮
		$(opts.plusBtn, this).bind('mouseup mouseout', function (e) {
			clearTimeout(timeoutTimer);
			clearInterval(intervalTimer);
		});
		
		$(document).bind('mousemove', function (e) {
			if (!that.isDrap) return;
			
			var width = that.width + e.clientX - that.x;
			move.call(that, '', width);
		});
		
		$(document).bind('mouseup', function () {
			that.isDrap = false;
			opts.complete.call(that, that.bar, that.width, that.maxWidth, that.currentValue);
		});
		
	};
	
	var proxy = function (fn, proxy) {
		return function () {
			return fn.apply(proxy, arguments);
		};
	};
	
	init.call(this);
	
	return {
		move: proxy(move, this)
	};
};

/*  //语音通话量
var phoneBar = $('#phoneTimeBar').sliderBar({
	currentValue: $('#phoneTime>input').val(),
	minValue: 0,
	maxValue: 200,
	draging: function (a, b, c, d) {
		$('#phoneTimeTxt>span').html(d + '分钟')
		$('#phoneTime>input').val(d);
	}
});

$('#phoneTime>input').bind('keyup', function () {
	var value = $(this).val();
	var reg = /\d+/;
	
	value = (value.match(reg) || [0])[0];
	phoneBar.move(value);
});

//网络流量
var networkBar = $('#networkBar').sliderBar({
	currentValue: $('#network>input').val(),
	minValue: 0,
	maxValue: 20480,
	isSpecial: true,
	draging: function (a, b, c, d) {
		$('#networkTxt>span').html(d + 'M')
		$('#network>input').val(d);
	}
});

$('#network>input').bind('keyup', function () {
	var value = $(this).val();
	var reg = /\d+/;
	
	value = (value.match(reg) || [0])[0];
	networkBar.move(value);
});

//短/彩信量
var messageBar = $('#messageBar').sliderBar({
	currentValue: $('#message>input').val(),
	minValue: 0,
	maxValue: 100,
	draging: function (a, b, c, d) {
		$('#messageTxt>span').html(d + '条')
		$('#message>input').val(d);
	}
});

$('#message>input').bind('keyup', function () {
	var value = $(this).val();
	var reg = /\d+/;
	
	value = (value.match(reg) || [0])[0];
	messageBar.move(value);
});  */