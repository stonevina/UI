require(['./CountUp'], function(CountUp) {
	var countup = new CountUp({
		target: $('#myTargetElement'),
		startVal: 24.02,
		endVal: 94.62,
		decimals: 2,
		duration: 2.5,
		complete: function() {console.info('ok')}
	});

	$('#start').click($.proxy(countup.start, countup));
	$('#stop').click($.proxy(countup.stop, countup));
	$('#resume').click($.proxy(countup.resume, countup));
	$('#reset').click($.proxy(countup.reset, countup));
});