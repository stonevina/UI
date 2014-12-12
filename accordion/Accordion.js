/**
 * @description: 手风琴
 * @version: 1.0.0
 * @author: wolf
 * @time: 2014-08-01 14:25:23
 * @update: 2014-12-12 16:54:24
 */
define(['../common/Base', '../common/Util'], function (Class, Util) {
	var Accordion = new Class;

	Accordion.include({
		init: function (opts) {
			var defaults = {
				//事件类型
				event: 'mouseover',
				//目标元素
				target: '.container',
				//手风琴单个元素
				accordionItem: '.accordion-box',
				//移动方向
				direction: 'x',
				//默认选中项
				selectedIndex: 0,
				//选中项的class
				activeClass: 'active',
				//最小宽度
				minWidth: 100,
				//最大宽度
				maxWidth: 700,
				//最小宽度
				minHeight: 100,
				//最大宽度
				maxHeight: 100,
				//动画移动速度
				speed: 500,
				//延迟时间
				delayTime: 50,
				//动画停止后的回调
				complete: $.noop
			},
			settings = $.extend({}, defaults, opts);
			$.extend(this, settings);			

			this.create();
		},
		create: function () {
			var self = this;
		
			if (this.direction == 'x') {
				this.minHeight = this.maxHeight = $(this.target).height();
				$(this.accordionItem, this.target).css({float: 'left', width: this.minWidth, height: this.maxHeight});
				$(this.accordionItem + ':eq(' + this.selectedIndex + ')', this.target).css({width: this.maxWidth});
			} else {
				this.minWidth = this.maxWidth = $(this.target).width();
				$(this.accordionItem, this.target).css({height: this.minHeight, width: this.maxWidth});
				$(this.accordionItem + ':eq(' + this.selectedIndex + ')', this.target).css({height: this.maxHeight});
			}
			
			$(this.target).delegate(this.accordionItem, this.event, function () {
			
				var that = this;
				clearTimeout(self.timer);
				self.timer = setTimeout(function () {
					$(that).siblings().removeClass(self.activeClass).animate({width: self.minWidth, height: self.minHeight}, self.speed, function () {
					
					});
					
					$(that).addClass(self.activeClass).animate({width: self.maxWidth, height: self.maxHeight}, self.speed, function () {
						self.complete(that);
					});
				}, self.delayTime);
			
			});
		}
	});

	return Accordion;
});