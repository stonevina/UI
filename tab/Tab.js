/**
 * @description: tab标签切换
 * @version: 1.0
 * @author: wolf
 * @time: 2014-04-30 10:16:59
 */
define(['../common/Base'], function (Class) {
	var Tab = new Class;

	Tab.include({
		init : function (opts) {
			var defaults = {
				//事件类型
				eventType: 'click',
				//导航容器的class
				navWrapClass: 'tabs',
				//导航的class
				navClass: 'ui-tab-item',
				//导航选中的class
				navSelectedClass: 'ui-tab-active',
				//导航元素的标签
				navTag: 'li',
				//内容区的class
				panelWrapClass: 'tabsContent',
				//内容区的class
				panelClass: 'ui-tab-panel',
				//内容区选中的class
				panelSelectedClass: 'ui-tab-panel-active',
				//默认选中的标签，默认选中第一个
				index: 0,
				//标签切换时说用的属性字段
				tabAttr: 'data-tab',
				//已选中的标签再次被选中是否触发事件
				isMulti: false,
				//切换后的回调函数
				callback: function () {}
			},
			settings = $.extend({}, defaults, opts);

			this.eventType = settings.eventType;
			this.navClass = settings.navClass;
			this.navSelectedClass = settings.navSelectedClass;
			this.panelClass = settings.panelClass;
			this.panelSelectedClass = settings.panelSelectedClass;
			this.index = settings.index;
			this.navTag = settings.navTag;
			this.tabAttr = settings.tabAttr;
			this.navWrapClass = settings.navWrapClass;
			this.panelWrapClass = settings.panelWrapClass;
			this.isMulti = settings.isMulti;
			this.callback = settings.callback;

			this.bindEvent();
		},
		bindEvent : function () {
			var self = this,
				ele = $('.' + self.navWrapClass), 
				panel = $('.' + self.panelWrapClass);

			//导航部分绑定事件
			ele.delegate(self.navTag, self.eventType, function (e) {
				var tabName = $(this).attr(self.tabAttr),
					isHasClass = $(this).hasClass(self.navSelectedClass);

				if (isHasClass && !self.isMulti) {
					return;
				}
				ele.trigger('change.tabs', tabName);
			});

			//标签的处理方式
			ele.bind('change.tabs', function (e, tabName) {
				ele.find(self.navTag).removeClass(self.navSelectedClass);
				ele.find('[' + self.tabAttr + '=' + tabName + ']').addClass(self.navSelectedClass);
			});

			//内容区域的处理方式
			ele.bind('change.tabs', function (e, tabName) {
				var selectedEle = panel.find('[' + self.tabAttr + '=' + tabName + ']'),
					panelChild = panel.find('[' + self.tabAttr + ']');

				panelChild.removeClass(self.panelSelectedClass);
				selectedEle.addClass(self.panelSelectedClass);

				self.callback.call(selectedEle, selectedEle, e, tabName);
			});

			//默认选中标签
			var selectedItem = ele.find(self.navTag + ':eq(' + self.index + ')');
			ele.trigger('change.tabs', selectedItem.attr(self.tabAttr));
		}
	});

	return Tab;
});