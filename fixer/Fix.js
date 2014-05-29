/**
 * @description: 元素固定器
 * @version: 1.0.0
 * @author: wolf
 * @time: 2014-05-28 16:42:32
 */
define(['../common/Base', '../common/Util'], function (Class, Util) {
	var Fix = new Class;

	Fix.include({
		init: function (opts) {
			var defaults = {
				//x方向,left/right
				x: 'left',
				//y方向,top/bottom
				y: 'top',
				//x方向的偏移量
				xValue: 'center',
				//y方向的偏移量
				yValue: 'center',
				//元素层级
				zIndex: '',
				//目标元素
				ele: ''
			},
			settings = $.extend({}, defaults, opts);
			$.extend(this, settings);

			this.initLoc();
			this.bindEvent(settings);
		},
		bindEvent: function (settings) {
			$(window).resize(this.proxy(function () {
				$.extend(this, settings);
				this.initLoc();
			}, this));
		},
		initLoc: function () {
			var isIE6 = Util.isIE6;
			var width = this.ele.outerWidth(true);
			var height = this.ele.outerHeight(true);
			var pageWidth = Util.getClientWidth();
			var pageHeight = Util.getClientHeight();
			var currentStyle = {};

			if (this.xValue == 'center') {
				this.xValue = (pageWidth - width) / 2;
			}

			if (this.yValue == 'center') {
				this.yValue = (pageHeight - height) / 2;
			}

			if (isIE6) {
				var xLeftValue = (document.documentElement||document.body).scrollLeft + this.xValue;
				var yTopValue = (document.documentElement||document.body).scrollTop + this.yValue;

				if (this.x == 'left') {
					this.ele.css('left', xLeftValue);
				}

				if (this.x == 'right') {
					this.ele[0].style.setExpression("left", "(eval((document.documentElement||document.body).scrollLeft + "+ - this.xValue + " + (document.documentElement||document.body).clientWidth-this.offsetWidth)-(parseInt(this.currentStyle.marginLeft,10)||0)-(parseInt(this.currentStyle.marginRight,10)||0))+'px'");
				}

				if (this.y == 'top') {
					this.ele.css('top', yTopValue);
				}

				if (this.y == 'bottom') {
					this.ele[0].style.setExpression("top", "eval((document.documentElement||document.body).scrollTop+ "+ - this.yValue + " + (document.documentElement||document.body).clientHeight-this.offsetHeight-(parseInt(this.currentStyle.marginTop,10)||0)-(parseInt(this.currentStyle.marginBottom,10)||0))+'px'");
				}
				currentStyle['position'] = 'absolute';
			} else {
				currentStyle[this.x] = this.xValue;
				currentStyle[this.y] = this.yValue;
				currentStyle['position'] = 'fixed';
			}

			//针对弹窗做特殊处理
			currentStyle['zIndex'] = this.zIndex;
			this.ele.css(currentStyle);
		}
	});

	return Fix;
});