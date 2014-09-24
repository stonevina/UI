require(['./Countdown'], function (Countdown) {
	var countdown = new Countdown({
		beginTime: '2014-09-24 17:43:28',
		endTime: '2014-09-25 17:44:50',
		onchange: function (time) {
			var tpl = '{day}天{hour}小时{minute}分钟{second}秒';
			var time = tpl.replace(/{day}/g, time.day)
					.replace(/{hour}/g, time.hour)
					.replace(/{minute}/g, time.minute)
					.replace(/{second}/g, time.second);
				
			$('.time').html(time);
		}
	});
});