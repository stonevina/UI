define(['./Base', './Util'], function(Class, Util) {
	var Tab = new Class;

	Tab.include({
		init : function(container, opts) {
			var defaults = {
				eventType : 'mouseover',
				currClass : 'curr',
				tabItem : '.tab li>a',
				tabContent : '.tab-con',
				source : 'href', 
				callback : function() {},
				index : 0
			},
			settings = $.extend({}, defaults, opts);

			this.container = container;
			this.tabItem = settings.tabItem;
			this.tabContent = settings.tabContent;
			this.eventType = settings.eventType;
			this.currClass = settings.currClass;
			this.index = settings.index;
			this.source = settings.source;
			this.callback = settings.callback;

			this.bindEvent();
		},
		bindEvent : function() {
			var that = this;

			$(this.tabItem, $(this.container)).each(function() {
				$(this).bind(that.eventType, function() {
					var tabInex = $(that.tabItem).index($(this));
					$(that.container).find(that.tabItem).removeClass(that.currClass);
					$(this).addClass(that.currClass);
					$(that.container).trigger('change.tab', tabInex);
				});
			});

			$(this.container).bind('change.tab', function(e, tabInex) {
				that.callback(tabInex);
			});
		}
	});

	return Tab;
});