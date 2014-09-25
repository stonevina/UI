require(['./Roll'], function(Roll) {
	var roll = new Roll({
		target: $('#myTargetElement'),
		startVal: 24.02,
		endVal: 94.62,
		decimals: 2,
		duration: 2.5,
		complete: function() {console.info('ok')}
	});

	$('#start').click($.proxy(roll.start, roll));
	$('#stop').click($.proxy(roll.stop, roll));
	$('#resume').click($.proxy(roll.resume, roll));
	$('#reset').click($.proxy(roll.reset, roll));
});