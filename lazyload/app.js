require(['./Lazyload'], function (Lazyload) {
	var lazy = new Lazyload({
		selector: 'img.lazy',
		effect: 'fadeIn',
		load: function (a,b,c) {console.info(a,b,c)},
		error: function (a,b,c) {console.info(a,b,c)}
	});
});