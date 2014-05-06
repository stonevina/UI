/**
 * @description: 焦点图
 * @version: 1.0.0
 * @author: wolf
 * @time: 2014-04-28 10:17:13
 */
define(['../common/Base', '../common/Util'], function(Class, Util) {
	var Slider = new Class;

	Slider.include({
		init: function (opts) {
			var defaults = {
				//触发事件
				eventType: 'click',
				//动画速度
				speed: 500,
				//是否支持响应式
				isResize: false,
				//图片是否采用懒加载
				isLazyLoad: true,
				//容器内显示的数量
				visible: 2,
				//单次滚动的数量
				step: 5,
				//是否自动播放
				isAutoPlay: false,
				//自动播放延迟时间
				delay: 1000,
				//单次滚动的数量是否相同
				isSameStep: false,
				//是否无限滚动
				isUnlimited: false,
				//是否存在margin
				isHasMargin: false,
				//slider单个元素父级tag
				sliderItemParentTag: 'ul',
				//slider单个元素的tag
				sliderItemTag: 'li',
				//slider外部容器的选择器
				slideWrapSelector: '.slider-wrap',
				//slider内容wrap的选择器
				slideCtnWrapSelector: '.slider-show',
				//slider前一页的选择器
				sliderPreSelector: '.prev',
				//slider后一页的选择器
				sliderNextSelector: '.next',
				//slider单个元素的宽度
				sliderItemWidth: '',
				//slider单个元素的高度
				sliderItemHeight: '',
				//滚动结束后的回调函数
				callback: function () {}
			},
			settings = $.extend({}, defaults, opts);

			this.eventType = settings.eventType;
			this.speed = settings.speed;
			this.isResize = settings.isResize;
			this.isLazyLoad = settings.isLazyLoad;
			this.visible = settings.visible;
			this.step = settings.step;
			this.isAutoPlay = settings.isAutoPlay;
			this.delay = settings.delay;
			this.isSameStep = settings.isSameStep;
			this.isUnlimited = settings.isUnlimited;
			this.isHasMargin = settings.isHasMargin;
			this.slideWrapSelector = settings.slideWrapSelector;
			this.slideCtnWrapSelector = settings.slideCtnWrapSelector;
			this.sliderPreSelector = settings.sliderPreSelector;
			this.sliderNextSelector = settings.sliderNextSelector;
			this.sliderItemWidth = settings.sliderItemWidth;
			this.sliderItemHeight = settings.sliderItemHeight;
			this.sliderItemTag = settings.sliderItemTag;
			this.sliderItemParentTag = settings.sliderItemParentTag;
			this.callback = settings.callback;

			this.animate = false;
			this.targetItemWrap = $(this.sliderItemParentTag, this.slideWrapSelector);
			this.targetItem = $(this.sliderItemTag, this.slideWrapSelector);
			this.prevEle = $(this.sliderPreSelector, this.slideWrapSelector);
			this.nextEle = $(this.sliderNextSelector, this.slideWrapSelector);

			this.initStyle();
			this.bindEvent();
		},
		bindEvent: function () {
			this.prevEle.click(this.proxy(this.prev));
			this.nextEle.click(this.proxy(this.next));
		},
		initStyle: function () {
			var itemNum = this.targetItem.size(),
				width = this.width || this.targetItem.outerWidth(this.isHasMargin),
				height = this.height || this.targetItem.height(),
				itemParentWdt = itemNum * width,
				itemParentHgt = height,
				cssStyle = {width: width * this.visible, height: itemParentHgt};

			this.width = width;
			this.height = height;
			this.itemNum = itemNum;

			this.targetItemWrap.css({width: itemParentWdt, height: itemParentHgt, position: 'absolute', top: 0, left: 0, overflow: 'hidden'});
			$(this.slideCtnWrapSelector, this.slideWrapSelector).css(cssStyle);
			$(this.slideWrapSelector).css(cssStyle);
		},
		//计算偏移量以及判断首尾
		getDistanceAndLoc: function (direct) {
			var cutLeft = parseFloat(this.targetItemWrap.css('left')),
				minLeft = -1 * this.width * (this.itemNum - this.visible),
				maxLeft = 0,
				preLeft = direct * this.step * this.width + cutLeft;

			if(direct == 1) {//判断向左方向
				return preLeft >= 0 ? {distance: maxLeft, isStart: true} : {distance: preLeft, isStart: false};
			} else {//判断向右方向
				return preLeft <= minLeft ? {distance: minLeft, isEnd: true} : {distance: preLeft, isEnd: false};
			}
		},
		//有限slider
		run: function (direct) {
			var self = this,
				loc = this.getDistanceAndLoc(direct);

			this.isAnimate = true;
			this.targetItemWrap.animate({left: loc.distance}, this.speed, function () {
				
				self.nextEle.show();
				self.prevEle.show();

				//重置slider状态
				loc.isEnd && self.nextEle.hide(); 
				loc.isStart && self.prevEle.hide();

				self.isAnimate = false;
				self.callback.call(this, this);
			});
		},
		//direct = 1 为前
		prev: function () {
			!this.isAnimate && this.run(1);
		},
		//direct = -1 为后
		next: function () {
			!this.isAnimate && this.run(-1);
		}
	});

	return Slider;
});