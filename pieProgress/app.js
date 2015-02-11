require(['./PieProgress.js'], function (PieProgress) {
	
	//默认参数
	var defaults = {
		width: 160,
		height: 160,
		barcolor: 'green',
        barsize: '1',
//      trackcolor: 'black',
		trackcolor: '#f2f2f2',
        fillcolor: 'none',
		containerElement: document.body,
		//坐标值
		x: 20,
		y: 20
	};

	if (PieProgress.svg.isSupport()) {
		var svg = PieProgress.svg.init(defaults);
		//svg.updateBar(89);
	}
	
	if (PieProgress.vml.isSupport()) {
		PieProgress.vml.init(defaults);
	}
	
	if (PieProgress.canvas.isSupport()) {
		PieProgress.canvas.init(defaults);
	}
});