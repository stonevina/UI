/**
 * @description: 滚动条
 * @version: 1.0.0
 * @author: wolf
 * @time: 2014-05-30 10:50:21
 */
define(['../common/Base', '../common/Template', '../common/Util'], function (Class, Template, Util) {
	var Scrollbar = new Class;

	Scrollbar.include({
		init: function (opts) {
			var defaults = {
				//是否是纵向
				isVertical: true,
				//滚动条是否有头尾按钮
				isHaveHead: false,
				//滚动单次移动距离
				step: 15,
				//横向滚动条样式
				hscrollbarClass: 'ui-hscrollbar-item',
				//纵向滚动条样式
				vscrollbarClass: 'ui-vscrollbar-item',
				//横向滚动条头部样式
				hscrollbarHeadClass: 'ui-hscrollbar-head',
				//纵向滚动条头部样式
				vscrollbarHeadClass: 'ui-vscrollbar-head',
				//横向滚动条尾部样式
				hscrollbarNailClass: 'ui-hscrollbar-nail',
				//纵向滚动条尾部样式
				vscrollbarNailClass: 'ui-vscrollbar-nail',
				//横向滚动条外层样式
				hscrollbarWrapClass: 'ui-hscrollbar-wrap',
				//纵向滚动条外层样式
				vscrollbarWrapClass: 'ui-vscrollbar-wrap',
				//内容区域选择器
				wrapSelector: '',
				//内容区域样式
				wrapClass: 'ui-scrollbox',
				//横向滚动条内容区域样式
				hscrollbarContentClass: 'ui-hscrollContent',
				//纵向滚动条内容区域样式
				vscrollbarContentClass: 'ui-vscrollContent',
				//头尾图片的宽、高，用作偏移量
				scrollbarOffset: 15
			},
			settings = $.extend({}, defaults, opts);
			$.extend(this, settings);

			this.create();
		},
		create: function () {
			var contentClass = this.vscrollbarContentClass,
				wrapScrollbarClass = this.vscrollbarWrapClass,
				scrollbarClass = this.vscrollbarClass,
				scrollbarHeadClass = this.vscrollbarHeadClass,
				scrollbarNailClass = this.vscrollbarNailClass;

			//判断方向
			if (!this.isVertical) {
				contentClass = this.hscrollbarContentClass;
				wrapScrollbarClass = this.hscrollbarWrapClass;
				scrollbarClass = this.hscrollbarClass;
				scrollbarHeadClass = this.hscrollbarHeadClass;
				scrollbarNailClass = this.hscrollbarNailClass;
			}
			
			this.wrap = $(this.wrapSelector).addClass(this.wrapClass).get(0);
			this.content = $('.' + contentClass, this.wrapSelector).get(0);

			this.wrapScrollbar = document.createElement('div');
			this.scrollbar = document.createElement('div');
			this.scrollbarHead = document.createElement('div');
			this.scrollbarNail = document.createElement('div');

			this.setEleSize();

			this.wrapScrollbar.className = wrapScrollbarClass;
			this.scrollbar.className = scrollbarClass;

			this.scrollbarHead.className = scrollbarHeadClass;
			this.scrollbarNail.className = scrollbarNailClass;

			this.wrapScrollbar.appendChild(this.scrollbarHead);
			this.wrapScrollbar.appendChild(this.scrollbarNail);
			this.wrapScrollbar.appendChild(this.scrollbar);
			this.wrap.appendChild(this.wrapScrollbar);

			//判断方向
			this.isVertical ? 
				this.content.style.width = (this.wrap.clientWidth - this.wrapScrollbar.offsetWidth) + 'px' : 
				this.content.style.height = (this.wrap.clientHeight - this.wrapScrollbar.offsetHeight) + 'px';

			this.scrollbar.onmousedown = this.proxy(this.mousedown, this);
			this.scrollbar.onclick = this.preventDefaultAndPropagation;
			this.wrapScrollbar.onclick = this.proxy(this.clickBar, this);
			this.wrap.onmousewheel = this.proxy(this.mouseWheel, this);
			//for firfox
			this.wrap.addEventListener && this.wrap.addEventListener('DOMMouseScroll', this.proxy(this.mouseWheel, this));
		},
		setEleSize: function () {
			//判断方向
			if (this.isVertical) {
				this.wrapScrollbar.style.height = this.wrap.offsetHeight + 'px';
				this.content.style.height = this.wrap.offsetHeight + 'px';
				this.content.scrollTop = 0;
			
				this.scrollbar.style.marginTop = this.scrollbarOffset + 'px';
				this.scrollbar.style.height = parseInt(this.wrap.offsetHeight / this.content.scrollHeight * (this.wrap.offsetHeight - this.scrollbarOffset * 2), 10) + 'px';
			} else {
				this.wrapScrollbar.style.width = this.wrap.offsetWidth + 'px';
				this.content.style.width = this.wrap.offsetWidth + 'px';
				this.content.scrollLeft = 0;

				this.scrollbar.style.marginLeft = this.scrollbarOffset + 'px';
				this.scrollbar.style.width = parseInt(this.wrap.offsetWidth / this.content.scrollWidth * (this.wrap.offsetWidth - this.scrollbarOffset * 2), 10) + 'px';
			}
		},
		update: function () {
			this.setEleSize();
		},
		mousedown: function (e) {
			var e = e || window.event;

			this.scrollbar.y = e.clientY;
			this.scrollbar.oft = parseInt(this.scrollbar.style.marginTop, 10);

			//判断方向
			if (!this.isVertical) {
				this.scrollbar.x = e.clientX;
				this.scrollbar.oft = parseInt(this.scrollbar.style.marginLeft, 10);
			}

			document.onmousemove = this.proxy(this.mousemove, this);
			this.preventDefaultAndPropagation(e);
		},
		mousemove: function (e) {
			var e = e || window.event;

			//判断方向
			this.isVertical ? 
				(this.marginTop = this.scrollbar.oft + e.clientY - this.scrollbar.y) : 
				(this.marginLeft = this.scrollbar.oft + e.clientX - this.scrollbar.x);

			this.changeLoc();

			document.onmouseup = function () {document.onmousemove = null;};
			this.preventDefaultAndPropagation(e);
		},
		changeLoc: function () {

			if (this.marginLeft < this.scrollbarOffset) {
				this.marginLeft = this.scrollbarOffset;
			}

			if (this.marginLeft > this.wrap.offsetWidth - this.scrollbar.offsetWidth - this.scrollbarOffset) {
				this.marginLeft = this.wrap.offsetWidth - this.scrollbar.offsetWidth - this.scrollbarOffset;
			}

			if (this.marginTop < this.scrollbarOffset) {
				this.marginTop = this.scrollbarOffset;
			}

			if (this.marginTop > this.wrap.offsetHeight - this.scrollbar.offsetHeight - this.scrollbarOffset) {
				this.marginTop = this.wrap.offsetHeight - this.scrollbar.offsetHeight - this.scrollbarOffset;
			}

			this.scrollbar.style.marginTop = this.marginTop + 'px';
			this.content.scrollTop = (this.content.scrollHeight - this.wrap.offsetHeight) * (this.marginTop - this.scrollbarOffset) / (this.wrap.clientHeight - this.scrollbar.clientHeight - this.scrollbarOffset * 2);
		
			this.scrollbar.style.marginLeft = this.marginLeft + 'px';
			this.content.scrollLeft = (this.content.scrollWidth - this.wrap.offsetWidth) * (this.marginLeft - this.scrollbarOffset) / (this.wrap.clientWidth - this.scrollbar.clientWidth - this.scrollbarOffset * 2);
		},
		mouseWheel: function (e) {
			var e = e || window.event;
			var delta = e.wheelDelta || e.detail;

			if (delta == 3 || delta == -120) {
				this.marginLeft = parseInt(this.scrollbar.style.marginLeft, 10) + this.step;
				this.marginTop = parseInt(this.scrollbar.style.marginTop, 10) + this.step;
			} else {
				this.marginLeft = parseInt(this.scrollbar.style.marginLeft, 10) - this.step;
				this.marginTop = parseInt(this.scrollbar.style.marginTop, 10) - this.step;
			}

			this.changeLoc();
			this.preventDefaultAndPropagation(e);
		},
		clickBar: function (e) {
			var e = e || window.event;
			var cx = e.clientX;
			var cy = e.clientY;
			var ofx = $(this.wrapScrollbar).offset().left;
			var ofy = $(this.wrapScrollbar).offset().top;
			var marginLeft = parseInt(this.scrollbar.style.marginLeft, 10);
			var marginTop = parseInt(this.scrollbar.style.marginTop, 10);
			var scrollbarWidth = parseInt(this.scrollbar.style.width, 10);
			var scrollbarHeight = parseInt(this.scrollbar.style.height, 10);

			if (cx - ofx > marginLeft + scrollbarWidth) {
				this.marginLeft = parseInt(this.scrollbar.style.marginLeft, 10) + this.step;
			} else {
				this.marginLeft = parseInt(this.scrollbar.style.marginLeft, 10) - this.step;
			}

			if (cy - ofy > marginTop + scrollbarHeight) {
				this.marginTop = parseInt(this.scrollbar.style.marginTop, 10) + this.step;
			} else {
				this.marginTop = parseInt(this.scrollbar.style.marginTop, 10) - this.step;
			}

			this.changeLoc();
			this.preventDefaultAndPropagation(e);
		},
		preventDefaultAndPropagation: function (e) {
			Util.preventPropagation(e);
			Util.preventDefault(e);
		}
	});

	return Scrollbar;
});