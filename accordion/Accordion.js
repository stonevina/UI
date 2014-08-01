/**
 * @description: 手风琴
 * @version: 1.0.0
 * @author: wolf
 * @time: 2014-08-01 14:25:23
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
				//展开的宽度
				unfoldWidth: 500,
				//移动方向
				direction: 'x',
				//默认选中项
				index: 0,
				//选中项的class
				activeClass: 'active',
				//动画移动速度
				speed: 500,
				//动画停止后的回调
				complete: $.noop
			},
			settings = $.extend({}, defaults, opts);
			$.extend(this, settings);

			this.create();
		},
		create: function () {
			var that = this, 
				cWidth = parseInt($(this.target).width(), 10), 
				size = $(this.accordionItem, this.target).size() - 1,
				offset = (cWidth - that.unfoldWidth) / size;

			this.offset = offset;
			this.cWidth = cWidth;

			//初始化left值
			$(this.accordionItem, this.target).each(function (i) {
				i == 0 ? $(this).css('left', 0) : $(this).css('left', that.unfoldWidth + (i - 1) * offset);
			});

			$(this.target).delegate(this.accordionItem, this.event, function () {
				var _this = this, 
					index = $(this).index(), 
					selfLeft = parseInt($(this).css('left'), 10),
					preLeft = parseInt($(this).prev().css('left'), 10),
					nextLeft = parseInt($(this).next().css('left'), 10),
					currentWidth = $(this).next().size() ? nextLeft - selfLeft : that.cWidth - selfLeft,
					offset = that.unfoldWidth - currentWidth;
				
				var animateFunction = function () {
					if (selfLeft - preLeft >= that.unfoldWidth) {
						$(_this).animate({left: selfLeft - offset}, that.speed, 'linear', function () {
							that.complete(_this);
						});
						$(_this).prev().animate({left: preLeft - offset}, that.speed, 'linear', function () {
							that.complete(_this);
						});
					} else {
						$(_this).next().animate({left: nextLeft + offset}, that.speed, 'linear', function () {
							that.complete(_this);
						});
					}
				};

				Util.throttle(animateFunction, 500);
			});
		}
	});

	return Accordion;
});