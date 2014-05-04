require(['./Tab'], function(Tab) {
	var tab = new Tab({eventType: 'mouseover', index: 1, isMulti: false, callback: function(ele, e, tabName) {
		console.log(ele);
	}});
});