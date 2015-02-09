require(['./PieProgress.js'], function (PieProgress) {
	
	//默认参数
	var defaults = {
		width: 160,
		height: 160,
		barcolor: 'green',
        barsize: '1',
        trackcolor: '#f2f2f2',
        fillcolor: 'none',
		containerElement: document.body,
		//坐标值
		x: 10,
		y: 10
	};

	if (PieProgress.svg.isSupport()) {
		PieProgress.svg.init(defaults);
	}
	
	if (PieProgress.vml.isSupport()) {
		PieProgress.vml.init(defaults);
	}
});