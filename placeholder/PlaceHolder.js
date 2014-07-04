/**
 * @description: 占位符
 * @version: 1.0.0
 * @author: wolf
 * @time: 2014-07-04 17:11:06
 */
define(['../common/Base', '../common/Util'], function (Class, Util) {
	var PlaceHolder = new Class;

	PlaceHolder.include({
		init: function (opts) {
			var defaults = {
				
			},
			settings = $.extend({}, defaults, opts);
			$.extend(this, settings);
		}
	});

	return PlaceHolder;
})