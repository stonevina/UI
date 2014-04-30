/**
 * @description: tab标签切换
 * @version: 1.0
 * @author: wolf
 * @time: 2014-04-30 10:16:59
 */
define(['../common/Base'], function(Class) {
	var Tab = new Class;

	Tab.include({
		init : function(container, opts) {
			var defaults = {
				//事件类型
				eventType: 'mouseover',
				//导航的class
				navClass: 'ui-tab-item',
				//导航选中的class
				navSelectedClass: 'ui-tab-active',
				//导航元素的标签
				navTag: 'li',
				//内容区的cclass
				panelClass: 'ui-tab-panel',
				//内容区选中的class
				panelSelectedClass: 'ui-tab-panel-active',
				//默认选中的标签，默认从0开始
				index: 0,
				//标签切换时说用的属性字段
				tabAttr: 'data-tab',
				//选中后的回调函数
				callback: function() {}
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
			this.callback = settings.callback;

			this.bindEvent();
		},
		bindEvent : function() {
			var self = this;
				ele = $('.' + self.navClass), 
				panel = $('.' + self.panelClass);

			ele.delegate(self.navTag, self.eventType, function() {
				var tabName = $(this).attr(self.tabAttr);

				ele.trigger('change.tabs', tabName);
			});

			//标签的处理方式
			ele.bind('change.tabs', function(e, tabName) {
				ele.find(self.navTag).removeClass(self.navSelectedClass);
				ele.find('[' + self.tabAttr + '=' + tabName + ']').addClass(self.navSelectedClass);
			});	

			//内容区域的处理方式
			ele.bind('change.tabs', function(e, ) {

			});
		}
	});

	return Tab;
});