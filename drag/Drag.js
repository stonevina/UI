/**
 * @description: 元素拖拽
 * @version: 1.0.0
 * @author: wolf
 * @time: 2014-06-12 15:34:57
 */
define(['../common/Base', '../common/Util'], function (Class, Util) {
	var Drag = new Class;

	Drag.include({
		init: function (opts) {
			var defaults = {
				//目标元素
				element: '',
				//x方向是否允许出界
				isXlimit: true,
				//y方向是否允许出界
				isYlimit: true,
				//x方向的最小位置
				minX: '',
				//y方向的最小位置
				minY: '',
				//x方向的最大位置
				maxX: '',
				//y方向的最大位置
				maxY: '',
				//拖拽完成后的回调
				complete: function () {}
			},
			settings = $.extend({}, defaults, opts);
			$.extend(this, settings);

			this.bindEvent();
		},
		bindEvent: function () {
			this.element = $(this.element).get(0);
			$(this.element).bind('mousedown', this.proxy(this.mouseDownCallBack, this));
		},
		mouseDownCallBack: function (e) {
			var e = e || window.event;

			this.left = parseInt($(this.element).css('left'), 10);
			this.top = parseInt($(this.element).css('top'), 10);
			this.x = e.clientX;
			this.y = e.clientY;

			document.onmousemove = this.proxy(this.mouseMoveCallBack, this);
			this.preventDefaultAndPropagation(e);
		},
		mouseMoveCallBack: function (e) {
			var e = e || window.event;

			var left = this.left + e.clientX - this.x;
			var top = this.top + e.clientY - this.y;
			var eleWidth = $(this.element).outerWidth();
			var eleHeight = $(this.element).outerHeight();
			var pageWidth = Util.getClientWidth();
			var pageHeight = Util.getClientHeight();

			left = this.isXlimit && left < 0 ? 0 : left;
			left = this.isXlimit && (left > pageWidth - eleWidth) ? (pageWidth - eleWidth) : left;

			left = this.minX !== '' && left < this.minX ? this.minX : left;
			left = this.maxX !== '' && left > this.maxX ? this.maxX : left;

			top = this.isYlimit && top < 0 ? 0 : top;
			top = this.isXlimit && (top > pageHeight - eleHeight) ? (pageHeight - eleHeight) : top;

			top = this.minY !== '' && top < this.minY ? this.minY : top;
			top = this.maxY !== '' && top > this.maxY ? this.maxY : top;

			this.element.style.top = top + 'px';
			this.element.style.left = left + 'px';

			document.onmouseup = this.proxy(function () {
				this.complete.call(this);
				document.onmousemove = null;
			}, this);
			this.preventDefaultAndPropagation(e);
		},
		preventDefaultAndPropagation: function (e) {
			Util.preventPropagation(e);
			Util.preventDefault(e);
		}
	});

	return Drag;
})