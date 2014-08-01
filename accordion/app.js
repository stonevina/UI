require(['./Accordion'], function(Accordion) {
	var accordion = new Accordion({
		complete: function() {console.info('ok')}
	});
});