/**
 * @description: 焦点图
 * @version: 1.0
 * @author: wolf
 * @time: 2014-04-28 10:17:13
 */
define(['../common/Base', '../common/Util'], function(Class, Util) {
	var Slider = new Class;

	Slider.include({
		init : function(container, opts) {
			var defaults = {
				//默认滚动的个数
				step: 3,
				//动画间隔时间
				duration: 500,
				//响应式
				isResize: true,
				//图片采用懒加载方式
				isLazyLoad: true,
				//滚动停止后的回调
				callback: function() {}
			},
			settings = $.extend({}, defaults, opts);

			var outCon = $(container), 
				liNum = outCon.find('li').size(),
				ele = outCon.find('li:first'),
				liWdt = settings.width || ele.width(),
				liHgt = settings.height || ele.height(),
				prevEle = outCon.find('.prev'),
				nextEle = outCon.find('.next'),
				oWdt = $('body').width() - 800,
				fix = settings.fix || 0;
			settings.isResize && (liWdt = oWdt / settings.step);
			settings.isResize && (Util.hashTable[container] = this);
			outCon.find('li').css({width : liWdt - fix});
			oWdt = settings.isResize ? oWdt : settings.step * liWdt;

			outCon.find('ul').css({
				position: 'absolute',
				top: 0,
				left: 0,
				width: ele.outerWidth() * liNum
			});

			outCon.css({width: oWdt});
			$('.ctrl', outCon).css({height: liHgt});
			$('.slider-show, .slider-show-ctn', outCon).css({height: liHgt});

			this.prevEle = prevEle;
			this.nextEle = nextEle;
			this.step = settings.step;
			this.liWdt = liWdt;
			this.outCon = outCon;
			this.liNum = liNum;
			this.duration = settings.duration;
			this.cutIndex = this.step;
			this.isAnimate = false;
			this.settings = settings;
			this.callback = settings.callback;
			this.isLazyLoad = settings.isLazyLoad;
			this.isIE6Contrl = settings.isIE6Contrl;

			this.prevEle.unbind('click').click(this.proxy(this.prev)).hide();
			this.nextEle.unbind('click').click(this.proxy(this.next));
			this.liNum > this.step ? this.nextEle.show() : this.nextEle.hide();

			this.resize();
			this.loadImg();
		},
		//懒加载
		loadImg : function() {
			var self = this;
			this.isLazyLoad && function() {
				self.outCon.find('ul li img:lt(' + self.cutIndex + ')').each(function() {
					$(this).attr('src', $(this).attr('data-src'));
				})
			}();
		},
		//direct = 1 为前， = -1 为后
		gotoLoc : function(direct) {
			var cutLeft = parseFloat(this.outCon.find('ul').css('left')), self = this, tofix = 0;
			this.isAnimate = true;

			if(this.cutIndex <= this.step * 2 && direct == 1) {tofix = this.step * 2 - this.cutIndex;}
			if(this.cutIndex + this.step >= this.liNum && direct == -1) {tofix = this.step - (this.liNum - this.cutIndex);}

			this.outCon.find('ul').animate({
				left : (cutLeft + (this.step - tofix) * this.liWdt * direct).toFixed(1)
			}, this.duration, function() {
				self.isAnimate = false;
				direct == 1 ? (self.cutIndex -= (self.step - tofix)) : (self.cutIndex += (self.step - tofix));

				//重置左右按钮状态
				var cutLeft = parseFloat(self.outCon.find('ul').css('left'));
				self.isStart(cutLeft) ? self.prevEle.show() : self.prevEle.hide();
				self.isEnd(cutLeft, self.liWdt, self.liNum) ? self.nextEle.show() : self.nextEle.hide();

				self.loadImg();
				//回调
				typeof self.callback == 'function' && self.callback();
			});
		},
		prev : function() {
			!this.isAnimate && this.gotoLoc(1);
		},
		next : function() {
			!this.isAnimate && this.gotoLoc(-1);
		},
		isStart : function(left) {
			return left !== 0;
		},
		isEnd : function(left, liWdt, num) {
			return Math.abs(left) / liWdt + this.step !== num;		
		},
		resize : function() {
			window.onresize = Util.throttle(function() {
				for(var key in Util.hashTable) {
					var self = Util.hashTable[key];
					var opts = $.extend({}, self.settings);
					self.init(self.outCon, opts);
				}
			}, 1);
		}
	});

	return Slider;
});