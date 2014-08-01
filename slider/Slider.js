/**
 * @description: 焦点图
 * @version: 1.0.0
 * @author: wolf
 * @time: 2014-04-28 10:17:13
 */
define(['../common/Base', '../common/Util', '../common/Template'], function(Class, Util, Template) {
	var Slider = new Class;

	Slider.include({
		init: function (opts) {
			var defaults = {
				//触发事件
				eventType: 'click',
				//slider导航触发事件
				navEventType: 'mouseover',
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
				//是否包含导航
				isHasNav: false,
				//是否自动播放
				isAutoPlay: false,
				//自动播放延迟时间
				delay: 1000,
				//单次滚动的数量是否相同
				isSameStep: false,
				//是否循环滚动
				isLoop: false,
				//是否存在margin
				isHasMargin: false,
				//slider单个元素父级tag
				sliderItemParentTag: 'ul',
				//slider单个元素的tag
				sliderItemTag: 'li',
				//导航单个元素的tag
				sliderNavTag: 'span',
				//slider外部容器的选择器
				slideWrapSelector: '.slider-wrap',
				//slider内容wrap的选择器
				slideCtnWrapSelector: '.slider-show',
				//导航的选择器
				sliderNavSelector: '.slider-nav',
				//slider前一页的选择器
				sliderPreSelector: '.prev',
				//slider后一页的选择器
				sliderNextSelector: '.next',
				//导航当前选中的样式
				sliderNavSelected: 'selected',
				//slider单个元素的宽度
				sliderItemWidth: '',
				//slider单个元素的高度
				sliderItemHeight: '',
				//滚动结束后的回调函数
				callback: function () {}
			},
			settings = $.extend({}, defaults, opts);
			$.extend(this, settings);

			this.targetItemWrap = $(this.sliderItemParentTag, this.slideWrapSelector);
			this.targetItem = $(this.sliderItemTag, this.slideWrapSelector);
			this.slideWrapSelector = $(this.slideWrapSelector);
			this.prevEle = $(this.sliderPreSelector, this.slideWrapSelector);
			this.nextEle = $(this.sliderNextSelector, this.slideWrapSelector);

			this.initStyle();
			this.bindEvent();

			this.isAutoPlay && this.autoPlay();
			this.isHasNav && this.createNav();
		},
		bindEvent: function () {
			this.prevEle.click(this.proxy(this.prev));
			this.nextEle.click(this.proxy(this.next));
		},
		createNav: function () {
			var navtpl = '<div class="<%this.className%>">\
							<%for(var i = 0; i < this.itemNum; i++) {%>\
								<%if (i == 0) {%>\
									<<%this.tag%> class="<%this.selected%>"><%i+1%></<%this.tag%>>\
								<%} else {%>\
									<<%this.tag%>><%i+1%></<%this.tag%>>\
								<%}%>\
							<%}%>\
						</div>\
						', that = this, timer;

			this.slideWrapSelector.find(this.slideCtnWrapSelector).append(Template(navtpl, {itemNum: this.itemNum, className: this.sliderNavSelector.slice(1), tag: this.sliderNavTag, selected: this.sliderNavSelected}));

			this.slideWrapSelector.delegate(that.sliderNavSelector + ' ' + that.sliderNavTag, this.navEventType, function () {
				var _this = this;
				var animateFunction = function () {
					var nIndex = $(_this).index() + 1;

					$(_this).addClass(that.sliderNavSelected).siblings().removeClass(that.sliderNavSelected);

					that.targetItemWrap.animate({left: that.width * nIndex * -1}, that.speed, function () {
						that.isAnimate = false;
						that.callback.call(this, this);
					});
				};

				Util.throttle(animateFunction, 500);
			});	
		},
		initStyle: function () {
			var itemNum = this.targetItem.size(),
				width = this.width || this.targetItem.outerWidth(this.isHasMargin),
				height = this.height || this.targetItem.height(),
				itemParentWdt = itemNum * width,
				itemParentHgt = height,
				nLeft = 0,
				cssStyle = {width: width * this.visible, height: itemParentHgt, position: 'relative', overflow: 'hidden'};

			this.width = width;
			this.height = height;
			this.itemNum = itemNum;
			
			if (this.isLoop) {
				//copy首尾的元素
				var stepFirstItems = this.slideWrapSelector.find(this.sliderItemTag + ':lt(' + this.visible + ')').clone(true).addClass('slider-clone'),
				stepLastItems = this.slideWrapSelector.find(this.sliderItemTag + ':gt(' + (this.itemNum - this.visible - 1) + ')').clone(true).addClass('slider-clone');

				stepFirstItems.insertAfter(this.slideWrapSelector.find(this.sliderItemTag + ':last'));
				stepLastItems.insertBefore(this.slideWrapSelector.find(this.sliderItemTag + ':first'));

				//容器的宽度
				itemParentWdt = (itemNum + this.visible * 2) * width;
				//左边的偏移量
				nLeft = -1 * this.width * this.visible;

				//更新选择器
				this.targetItem = $(this.sliderItemTag, this.slideWrapSelector);
			}

			this.targetItem.css({float: 'left'});
			this.prevEle.css({height: itemParentHgt, left: 0, position: 'absolute'});
			this.nextEle.css({height: itemParentHgt, right: 0, position: 'absolute'});
			this.slideWrapSelector.find(this.slideCtnWrapSelector).andSelf().css(cssStyle);
			this.targetItemWrap.css({width: itemParentWdt, height: itemParentHgt, position: 'absolute', top: 0, left: nLeft, overflow: 'hidden'});

			//根据数量判断是否隐藏按钮
			this.visible < itemNum && this.nextEle.show();
			this.isLoop && this.prevEle.show();
		},
		//计算偏移量以及判断首尾
		getDistanceAndLoc: function (direct) {
			var cutLeft = parseFloat(this.targetItemWrap.css('left')),
				minLeft = -1 * this.width * (this.itemNum - this.visible),
				maxLeft = 0,
				preLeft = direct * this.step * this.width + cutLeft;

			//重置最小偏移量和最大偏移量
			this.isLoop && (minLeft = -1 * this.width * (this.itemNum + this.visible), maxLeft = -1 * this.step * this.width)

			if (direct == 1) {//判断向左方向
				return preLeft > maxLeft || (preLeft == maxLeft && !this.isLoop) ? {distance: 0, isStart: true} : {distance: preLeft, isStart: false};
			} else {//判断向右方向
				return preLeft <= minLeft ? {distance: minLeft, isEnd: true} : {distance: preLeft, isEnd: false};
			}
		},
		run: function (direct) {
			var self = this,
				loc = this.getDistanceAndLoc(direct);

			this.isAnimate = true;
			this.targetItemWrap.animate({left: loc.distance}, this.speed, function () {
				
				self.nextEle.show();
				self.prevEle.show();

				//重置slider状态
				if (self.isLoop) { //循环滚动
					loc.isEnd && $(this).css('left', -1 * self.width * self.visible); 
					loc.isStart && $(this).css('left', -1 * self.width * self.itemNum);
				} else { //非循环滚动，隐藏左右按钮
					loc.isEnd && self.nextEle.hide(); 
					loc.isStart && self.prevEle.hide();
				}

				self.isAnimate = false;
				self.callback.call(this, this);

				//存在导航的情况，需处理下选中导航
				if (self.isHasNav) {
					var index = Math.abs(loc.distance / self.width) - 1;
					//从前往后
					index = index < self.itemNum ? index : 0;
					//从后往前
					index = index < 0 ? index + self.itemNum : index;
					$(self.sliderNavSelector + ' ' + self.sliderNavTag).filter(':eq(' + index + ')').addClass(self.sliderNavSelected).siblings().removeClass(self.sliderNavSelected).end();
				}

			});
		},
		//自动播放
		autoPlay: function () {
			var timer = setInterval($.proxy(this.next, this), this.delay);
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