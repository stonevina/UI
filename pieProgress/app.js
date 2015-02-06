require(['./PieProgress.js'], function (PieProgress) {
	if (PieProgress.svg.isSupport()) {
		PieProgress.svg.init();
	}
	
	if (PieProgress.vml.isSupport()) {
		PieProgress.vml.init();
	}
});