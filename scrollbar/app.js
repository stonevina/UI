require(['./Scrollbar'], function(Scrollbar) {
	 var scrollbarHead = new Scrollbar({controledParentEle: '#vscrollbar', controledEle: '.ui-vscrollContent'});
	 var hscrollbarHead = new Scrollbar({controledParentEle: '#hscrollbar', controledEle: '.ui-hscrollContent', isVertical: false});
});