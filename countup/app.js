require(['./CountUp'], function(CountUp) {
	var countup = new CountUp({
		target: $('#myTargetElement'),
		startVal: 100,
		endVal: 50,
		decimals: 2,
		duration: 20,
		complete: function() {alert('ok')}
	});

	$('#start').click($.proxy(countup.start, countup));
	$('#stop').click($.proxy(countup.stop, countup));
	$('#resume').click($.proxy(countup.resume, countup));
	$('#reset').click($.proxy(countup.reset, countup));
});