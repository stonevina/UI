require(['./Drag'], function(Drag) {
	var drag = new Drag({element: $('.ui-drag'), minY: 20, maxY: 400, complete: function () {console && console.log('finish@~~@')}});
})