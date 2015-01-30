require(['./PieProgress.js'], function (PieProgress) {
	if (PieProgress.svg.isSupport) {
		PieProgress.svg.init();
	}
});