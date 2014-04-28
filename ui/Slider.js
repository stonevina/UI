define(['./Base', './Util'], function(Class, Util) {
	var Slider = new Class;

	Slider.include({
		typeList : {
			t1 : {
				step : 4
			},
			t2 : {
				step : 5
			}
		},
		init : function(container, opts) {
			var defaults = {
				step : 3,
				duration : 500,
				isResize : true,
				isLazyLoad : true,
				callback : function() {}
			},
			defaults = $.extend(defaults, this.getType()),
			settings = $.extend({}, defaults, opts);

			var outCon = $(container), 
				liNum = outCon.find('li').size(),
				liWdt = settings.width || outCon.find('li:first').get(0).offsetWidth,
				liHgt = settings.height || outCon.find('li:first').get(0).offsetHeight,
				prevEle = outCon.find('.prev'),
				nextEle = outCon.find('.next'),
				oWdt = $('#content')[0].offsetWidth - 70 - 300,
				fix = settings.fix || 0;

			settings.isResize && (liWdt = oWdt / settings.step);
			settings.isResize && (Util.hashTable[container] = this);
			outCon.find('li').css({width : liWdt - 10 - fix});
			oWdt = settings.isResize ? oWdt : settings.step * liWdt;

			outCon.find('ul').css({
				position : 'absolute',
				top : 0,
				left : 0,
				width : Util.isIE6 ? (liWdt + 2) * liNum : liWdt * liNum
			});

			outCon.css({width : oWdt});
			$('.ctrl', outCon).css({height : liHgt});
			$('.slider-show, .slider-show-ctn', outCon).css({height : liHgt});

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
		//返回对应的版本
		getType : function() {
			var width = document.documentElement.clientWidth;
			if(width > 1000 && !Util.isIE6) {
				return this.typeList.t2;
			} else {
				return this.typeList.t1;
			}
		},
		resize : function() {
			window.onresize = Util.throttle(function() {
				for(var key in Util.hashTable) {
					var self = Util.hashTable[key];
					var opts = $.extend({}, self.settings, self.getType());
					self.init(self.outCon, opts);
				}
			}, 1);
		}
	});

	return Slider;
});