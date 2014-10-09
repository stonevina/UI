require(['./CountUp'], function(CountUp) {
	var countup = new CountUp({
		precision: 1000,
		onchange: function (time) {
			var tpl = '{day}天{hour}小时{minute}分钟{second}秒{millisecond}毫秒';
			var time = tpl.replace(/{day}/g, time.day)
					.replace(/{hour}/g, time.hour)
					.replace(/{minute}/g, time.minute)
					.replace(/{second}/g, time.second)
					.replace(/{millisecond}/g, time.millisecond);
				
			$('.time').html(time);
		}
	});
});