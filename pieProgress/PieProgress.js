/**
*@description: 圆形进度条
*@author: wolf
*@time: 2015-01-06 14:29:32
*/
define(function (require, exports, module) {

	var Util = require('/common/Util.js');
	Util.initAnimationFrame();
	
	var SvgModule = require('module.svg.js');
	var VmlModule = require('module.vml.js');
	var CanvasModule = require('module.canvas.js');
	
	return {
		svg: SvgModule,
		vml: VmlModule
	};
});