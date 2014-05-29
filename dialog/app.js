require(['./Dialog'], function(Dialog) {
	$('#textDialog').click(function () {var dialog = new Dialog({width: 400, height: 300, source: 'hello world'});})
	$('#htmlDialog').click(function () {var dialog = new Dialog({width: 400, height: 200, source: '<h1>hello world</h1>', isHasCtrlBtn: true});})
	$('#imgDialog').click(function () {var dialog = new Dialog({width: 500, source: 'http://img11.360buyimg.com/da/g14/M00/15/15/rBEhVlJeCegIAAAAAADhV3zKug8AAEO1AGW8mYAAOFv185.jpg', type: 'img'});})
	$('#iframeDialog').click(function () {var dialog = new Dialog({width: 400, source: './iframe.html', type: 'iframe', isHasCtrlBtn: false});})
});