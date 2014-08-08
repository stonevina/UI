/**
 * @description: 滑块组件
 * @version: 1.0.0
 * @author: wolf
 * @time: 2014-08-08 10:57:16
 */
define(['../common/Base', '../common/Util', '../common/Template'], function(Class, Util, Template) {
	var SliderBar = new Class;

	SliderBar.include({
		init: function (opts) {
			var defaults = {
				//滑块容器
				container: '',
				//滑块对象
				barEle: '.dray_cur',
				//滑块的方向，横向 or 纵向
				direction: 'x',
				//当前值
				currentValue: 0,
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
				//滑动过程中的回调
				//第一个参数为滑块对象，第二个参数为当前滑块位置，第三个参数为滑动条的最大位移,第四个参数为当前值
				draging: function () {},
				//滑动结束后的回调
				//第一个参数为滑块对象，第二个参数为当前滑块位置，第三个参数为滑动条的最大位移,第四个参数为当前值
				complete: function () {}
			};
			settings = $.extend({}, defaults, opts);
			$.extend(this, settings);

			//初始化所需参数
			this.minWidth = this.minWidth || 0;
			this.maxWidth = this.maxWidth || parseInt($(this.container).width(), 10);

			this.minHeight = this.minHeight || 0;
			this.maxHeight = this.maxHeight || parseInt($(this.container).height(), 10);
			
			this.minValue = this.minValue;
			this.maxValue = this.maxValue;
			
			this.isDrap = false;
			this.currentValue = this.currentValue || 0;
			this.bar = $(this.barEle, this.container);
			
			this.bindEvent.call(this);
			this.move.call(this, this.currentValue);
		},
		bindEvent: function () {
			var that = this, timeoutTimer, intervalTimer;
			
			$(this.container).bind('click', function (e) {

				var filterEle = [$(that.minusBtn, this).get(0), $(that.plusBtn, this).get(0), $(that.barEle, this).get(0)];
				
				for (var i = 0, l = filterEle.length; i < l; i++) {
					if (e.target == filterEle[i]) return;
				}
				
				//x方向
				var offLeft = $(that.barEle, this).offset().left;
				var x = e.clientX;
				var width = parseInt(that.bar.parent().width(), 10);

				//y方向
				var offTop = $(that.barEle, this).offset().top;
				var y = e.clientY;
				var height = parseInt(that.bar.parent().height(), 10);
				
				if (that.direction == 'x') {
					width = width + x - offLeft;
					that.move.call(that, '', width);

					return;
				}

				height  = height + y - offTop;
				that.move.call(that, '', height);
			});
			
			//滑块对象
			$(this.barEle, this.container).bind('mousedown', function (e) {
			
				that.x = e.clientX;
				that.width = parseInt(that.bar.parent().width(), 10);

				that.y = e.clientY;
				that.height = parseInt(that.bar.parent().height(), 10);

				that.isDrap = true;
				
				return false;
			});
			
			//- 按钮
			$(this.minusBtn, this.container).bind('mousedown', function (e) {
				if (timeoutTimer) clearTimeout(timeoutTimer);
				timeoutTimer = setTimeout(function () {
					intervalTimer = setInterval(function () {
						var value = that.currentValue - that.step;
						that.move.call(that, value);
					}, 150);
				}, 100);
			});
			
			//- 按钮
			$(this.minusBtn, this.container).bind('click', function (e) {			
				var value = that.currentValue - that.step;
				that.move.call(that, value);
			});
			
			//- 按钮
			$(this.minusBtn, this.container).bind('mouseup mouseout', function (e) {
				clearTimeout(timeoutTimer);
				clearInterval(intervalTimer);
			});
			
			//+ 按钮
			$(this.plusBtn, this.container).bind('mousedown', function (e) {
				if (timeoutTimer) clearTimeout(timeoutTimer);
				timeoutTimer = setTimeout(function () {
					intervalTimer = setInterval(function () {
						var value = that.currentValue + that.step;
						that.move.call(that, value);
					}, 150);
				}, 100);
			});
			
			//+ 按钮
			$(this.plusBtn, this.container).bind('click', function (e) {
				var value = that.currentValue + that.step;
				that.move.call(that, value);
			});
			
			//+ 按钮
			$(this.plusBtn, this.container).bind('mouseup mouseout', function (e) {
				clearTimeout(timeoutTimer);
				clearInterval(intervalTimer);
			});
			
			$(document).bind('mousemove', function (e) {
				if (!that.isDrap) return;
				
				if (that.direction == 'x') {	
					var width = that.width + e.clientX - that.x;
					that.move.call(that, '', width);

					return;
				}

				var height = that.height + e.clientY - that.y;
				that.move.call(that, '', height);
			});
			
			$(document).bind('mouseup', function () {
				that.isDrap = false;
				that.complete.call(that, that.bar, that.currentValue);
			});
		},
		//第一个参数为数字，第二个为像素值
		move: function (value, pxValue) {
			value = Math.max(Math.min(value, this.maxValue), this.minValue);

			if (this.direction == 'x') {
				pxValue = pxValue || value / this.maxValue * this.maxWidth;
				pxValue = Math.max(Math.min(pxValue, this.maxWidth), this.minWidth);
				value = Math.floor(value || pxValue / this.maxWidth * this.maxValue);
				
				this.currentValue = value;
				this.bar.parent().width(pxValue);
			}

			if (this.direction == 'y') {
				pxValue = pxValue || value / this.maxValue * this.maxHeight;
				pxValue = Math.max(Math.min(pxValue, this.maxHeight), this.minHeight);
				value = Math.floor(value || pxValue / this.maxHeight * this.maxValue);
				
				this.currentValue = value;
				this.bar.parent().height(pxValue);
			}

			this.draging.call(this, this.bar, this.currentValue);
			
			return false;
		}
	});

	return SliderBar;
});