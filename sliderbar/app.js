require(['./SliderBar', '../common/Template'], function(SliderBar, Template) {
	var phoneBar = new SliderBar({
		container: '#phoneTimeBar',
		currentValue: $('#phoneTime>input').val(),
		minValue: 0,
		maxValue: 200,
		draging: function (a, b) {
			$('#phoneTimeTxt>span').html(b + '分钟')
			$('#phoneTime>input').val(b);
		},
		complete: function () {
			console.info('finish......')
		}
	});

	$('#phoneTime>input').bind('keyup', function () {
		var value = $(this).val();
		var reg = /\d+/;
		
		value = (value.match(reg) || [0])[0];
		phoneBar.move(value);
	});

	var networkBar = new SliderBar({
		container: '#networkBar',
		direction: 'y',
		currentValue: $('#network>input').val(),
		minValue: 0,
		maxValue: 450,
		draging: function (a, b) {
			$('#networkTxt>span').html(b + 'M')
			$('#network>input').val(b);
		}
	});

	$('#network>input').bind('keyup', function () {
		var value = $(this).val();
		var reg = /\d+/;
		
		value = (value.match(reg) || [0])[0];
		networkBar.move(value);
	});
});