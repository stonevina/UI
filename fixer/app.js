require(['./Fix'], function(Fix) {
	for(var i = 0, html = []; i < 100; i++) {html.push('<li>&nbsp;</li>');}
    $('#thelist').html(html.join(''));

    new Fix({
    	x: 'left', 
		y: 'top',
		xValue: 50,
		yValue: 40,
		ele: $('#fixable1')
	});

    new Fix({
		x:'left', 
		y:'bottom',
		xValue:0,
		yValue:0,
		ele: $('#fixable2')
	});

    new Fix({
		x:'right', 
		y:'top',
		xValue:0,
		yValue:0,
		ele: $('#fixable3')
	});

    new Fix({
		x:'right', 
		y:'bottom',
		xValue:0,
		yValue:0,
		ele: $('#fixable4')
	});

    new Fix({
		x:'right', 
		y:'bottom',
		xValue:0,
		yValue:'center',
		ele: $('#fixable5')
	});

    new Fix({
		x:'right', 
		y:'bottom',
		xValue:'center',
		yValue:0,
		ele: $('#fixable6')
	});

    new Fix({
		x:'right', 
		y:'top',
		xValue:'center',
		yValue:0,
		ele: $('#fixable7')
	});

    new Fix({
		x:'right', 
		y:'top',
		xValue:'center',
		yValue:'center',
		ele: $('#fixable8')
	});

    new Fix({
		x:'left', 
		y:'top',
		xValue:0,
		yValue:'center',
		ele: $('#fixable9')
	});
});