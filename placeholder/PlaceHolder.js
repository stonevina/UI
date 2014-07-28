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
				//占位符样式
				placeholderClass: 'placeholder'
			},
			settings = $.extend({}, defaults, opts);
			$.extend(this, settings);

			this.bindEvent();
		},
		bindEvent: function () {
			var selector = this.detect().selector, that = this;

			$(document).delegate(selector, 'blur', function () {that.setPlaceHolder(that, this)});
			$(document).delegate(selector, 'focus', function () {that.removePlaceHolder(that, this)});

			$(document).find(selector).each(function () {that.setPlaceHolder(that, this)});
		},
		//检测是否支持placeholder
		detect: function () {
			var input = ('placeholder' in document.createElement('input'));
			var textarea = ('placeholder' in document.createElement('textarea'));
			var selector = ':input[placeholder]';

			return {
				input: input,
				textarea: textarea,
				selector: selector
			};
		},
		extractAttributes: function (ele) {
			var attr = ele.attributes, copy = {}, skip = /^jQuery\d+/;

			for(var i = 0; i < attr.length; i++) {
				if (attr[i].specified && !skip.test(attr[i].name)) {
					copy[attr[i].name] = attr[i].value;
				}
			}

			return copy;
		},
		setPlaceHolder: function (obj, target) {
			var placeholder;
			var target = $(target);
			var cid;
			var clone;

			//浏览器支持
			//if (this.detect().input && this.textarea) return;

			//浏览器不支持
			placeholder = target.attr('placeholder');
			
			//有内容时不做处理
			if ($.trim(target.val()).length > 0) return;

			//password类型的input,需创建一个text的input覆盖
			if (target.is(':password')) {
				cid = target.attr('id') + '-clone';
				clone = $('<input>')
						.attr($.extend(obj.extractAttributes(target.get(0)), {type: 'text', value: placeholder, 'data-password': 1, id: cid}))
						.addClass(obj.placeholderClass);
				target.before(clone).hide();
				return;
			}

			//非password类型的input
			target.val(placeholder);
			target.addClass(obj.placeholderClass);
		},
		removePlaceHolder: function (obj, target) {
			var placeholder;
			var realVal;
			var target = $(target);
			
			placeholder = target.attr('placeholder');
			realVal = target.val();

			//password类型
			if (target.data('password')) {
				target.next().show().focus();
				target.remove();
				return;
			}

			//非password类型的input
			if (placeholder == realVal) {
				target.val('');
				target.removeClass(obj.placeholderClass);
			}
		}
	});

	return PlaceHolder;
})