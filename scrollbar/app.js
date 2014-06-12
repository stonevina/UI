require(['./Scrollbar'], function(Scrollbar) {
	 var scrollbarHead = new Scrollbar({wrapSelector: '#vscrollbar'});
	 var hscrollbarHead = new Scrollbar({wrapSelector: '#hscrollbar', isVertical: false});
});