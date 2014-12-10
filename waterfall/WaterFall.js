/**
 * @description: 瀑布流模块
 * @version: 1.0.0
 * @author: wolf
 * @time: 2014-12-10 17:30:23
 */
define(function(require, exports, module) {
	var Template = require('../common/Template.js');
	var WaterFall = function (opts) {
		opts = $.extend({
			//加载的容器
			container: '',
			//接口地址
			url: '',
			//接口参数
			data: {},
			//测试数据，主用于还没接口测试
			testData: [],
			//返回结果的字段
			resultItem: '',
			//触发的阈值
			threshold: 0,
			//列表生成模板
			tpl: '',
			//显示效果
			effect: 'fadeIn',
			//延迟加载
			scrollTime: null,
			//延迟加载间隔时间
			delay: 100,
			//加载过程中回调
			loading: function () {},
			//加载完成后回调
			complete: function () {}
		}, opts);
		$.extend(this, opts);
		
		this.init();
	};
	
	WaterFall.prototype = {
		init: function () {
			this.bindEvent();
			this.isFinished = true;
		},
		show: function (result) {
			var fragment = Template(this.tpl, result[this.resultItem]);
			$(this.container).append($(fragment)[this.effect]());
			this.complete(result);
			this.isFinished = true;
		}, 
		load: function () {
			var self = this;
			
			if (self.testData && self.testData.length) {
				self.show(self.testData);
				return;
			}
			
			this.isFinished = false;
			
			$.ajax({
				url: self.url,
				data: self.data,
				dataType: 'json',
				success: function (result) {
					self.show(result);
				},
				//XMLHttpRequest 对象、错误信息、（可选）捕获的异常对象
				error: function (XMLHttpRequest, textStatus, errorThrown) {
					console && console.info(XMLHttpRequest, textStatus, errorThrown);
				}
			});
		},
		bindEvent: function () {
			var self = this;
			
			$(window).unbind('scroll resize').bind('scroll resize', function () {
				if (self.isBelow()) {
					clearTimeout(self.scrollTime);
					self.scrollTime = setTimeout(function () {
						if (!self.isFinished) return;
						self.loading.call(self);
						self.load.call(self);
					}, self.delay);
				}
			});
		},
		isBelow: function () {
			var winHeight = $(window).height();
			var scrollTop = $(document).scrollTop();
			var viewHight = $(this.container).offset().top + $(this.container).outerHeight(true);
			
			return winHeight + scrollTop + this.threshold >= viewHight;
		}
	};
	
	return WaterFall;
});