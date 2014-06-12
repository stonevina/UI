/**
 * @description: 对话框
 * @version: 1.0.0
 * @author: wolf
 * @time: 2014-05-11 16:20:26
 */
define(['../common/Base', '../common/Template', '../common/Util', '../fixer/Fix'], function (Class, Template, Util, Fix) {
	var Dialog = new Class;

	Dialog.include({
		init: function (opts) {
			var defaults = {
				//是否有遮罩层
				isHasMask: true,
				//遮罩层级
				zIndex: 998,
				//遮罩透明度
				opacity: 0.2,
				//遮罩class
				maskClass: '',
				//遮罩iframe样式
				maskIframeClass: 'maskIframe',
				//是否使用iframe创建mask
				maskIsIframe: false,
				//是否有关闭按钮
				isHasCloseBtn: true,
				//是否有确定、取消按钮
				isHasCtrlBtn: false,
				//是否有标题
				isHasTitle: true,
				//位置是否固定
				isFixed: true,
				//对话框类型
				type: 'text',
				//对话框title
				title: '提示',
				//对话框加载内容
				source: '',
				//对话框的宽度
				width: '',
				//对话框的高度
				height: '',
				//自动关闭的时间，倒计时
				autoCloseTime: '',
				//确定按钮的文本
				submitText: '确定',
				//取消按钮的文本
				cancelText: '取消',
				//标题class
				titleClass: 'ui-dialog-title',
				//确定、取消按钮class
				ctrlBtnClass: 'ui-dialog-btn',
				//内容区域class
				contentClass: 'ui-dialog-content',
				//主体class
				wrapClass: 'ui-dialog',
				//创建完成后的回调
				complete: function () {}
			},
			settings = $.extend({}, defaults, opts);
			$.extend(this, settings);

			this.createMain();
			this.bindEvent();
		},
		bindEvent: function () {
			this.closeEle.bind('click', this.proxy(this.close, this));

			$('.ui-dialog-btn-submit').bind('click', function () {});
			$('.ui-dialog-btn-cancel').bind('click', this.proxy(this.close, this));
		},
		tpl: {
				//遮罩层
				mask: '<div class="ui-mask"></div>',
				//关闭按钮
				closeBtn: '<a class="ui-dialog-close" title="关闭">\
						       <span class="ui-icon ui-icon-close"></span>\
						   </a>\
						   ',
				//确定、取消按钮
				ctrlBtn: '<div class="ui-dialog-btn">\
					  		  <a class="ui-dialog-btn-submit"><%this.submitText%></a>\
					  		  <a class="ui-dialog-btn-cancel"><%this.cancelText%></a>\
						  </div>\
						',
				//外层包裹容器
				wrap: '<div class="ui-dialog"></div>',
				//内容区容器
				content: '<div class="ui-dialog-content"></div>',
				//对话框标题
				title: '<div class="ui-dialog-title">\
							<span><%this.title%></span>\
						</div>\
					'
		},
		//标题
		createTitle: function () {
			this.titlEle = Template(this.tpl.title, {title: this.title});
		},
		//操作按钮
		createCtrlBtn: function () {
			this.btnELe = Template(this.tpl.ctrlBtn, {submitText: this.submitText, cancelText: this.cancelText});
		},
		//关闭icon
		createCloseIcon: function () {
			this.closeEle = $(this.tpl.closeBtn);
		},
		//内容区域
		createContent: function () {
			this.contentEle = $(this.tpl.content);

			this.contentEle.css({
				width: this.width || '', 
				height: this.height || ''
			});

			switch(this.type) {
				case 'text':
				case 'html':
					this.contentEle.append(this.source);
					break;
				case 'img':
					var width = this.width ? ' width=' + this.width : '';
					var height = this.height ? ' height=' + this.height : '';

					//直接拼串貌似不用再绑定 load ....
					this.img = $('<img src=' + this.source + width + height + '/>');
					this.contentEle.append(this.img);

					this.img.bind('load', this.proxy(function () {
						this.initSize();
					}, this));
					break;
				case 'iframe':
					this.iframe = $('<iframe marginwidth=0 marginheight=0 frameborder=0 scrolling="no" src=' + this.source +' style="width:100%;height:100%;border:0;"></iframe>');
					this.contentEle.append(this.iframe);

					this.iframe.bind('load', this.proxy(function () {
						var iframeHgt = this.getIframeHgt();
						this.iframe.css('height', iframeHgt);
						this.initSize();
					}, this));
					break;
			}
		},
		//最外层元素
		createWrap: function () {
			this.wrapEle = $(this.tpl.wrap);
		},
		//对话框主体
		createMain: function () {

			this.isHasTitle && this.createTitle();
			this.isHasCtrlBtn && this.createCtrlBtn();
			this.isHasCloseBtn && this.createCloseIcon();
			this.isHasMask && this.createMask();

			this.createContent();
			this.createWrap();

			//页面属性
			this.pageWidth = Util.getClientWidth();
			this.pageHeight = Util.getClientHeight();

			this.isHasTitle && this.wrapEle.append(this.titlEle);
			this.wrapEle.append(this.contentEle);

			this.isHasCtrlBtn && this.wrapEle.append(this.btnELe);
			this.isHasCloseBtn && this.wrapEle.append(this.closeEle);
			this.wrapEle.appendTo(document.body);

			//弹窗的实际显示宽度大于初始化的宽度，需要更改css，去掉padding + margin等
			this.wrapEle.css({
				width: this.contentEle.outerWidth(true)
			});

			this.initSize();

			this.pageTop = parseInt(this.wrapEle.css('top'), 10);
			this.pageLeft = parseInt(this.wrapEle.css('left'), 10);
		},
		createMask: function () {
			this.mask = $('<div>').addClass(this.maskClass);
			this.mask.css({
				position: 'absolute',
				left: 0,
				top: 0,
				width: Util.getDocWidth(),
				height: Util.getDocHeight(),
				opacity: this.opacity,
				zIndex: this.zIndex,
				backgroundColor: '#000',
				display: 'block',
				overflow: 'hidden'
			});

			this.mask.appendTo(document.body);

			if (this.maskIsIframe || Util.isIE6) {
				//ie6下加了src="javascript:;"会返回404
				var iframe = '<iframe class='+ this.maskIframeClass +' frameBorder="0" style="width:100%;height:100%;position:absolute;z-index:'+ (this.zIndex+1) +';opacity:0;filter:alpha(opacity=0);top:0;left:0;"></iframe>';
				this.mask.append(iframe);
			}
		},
		initSize: function () {
			var width = this.wrapEle.outerWidth(true);
			var height = this.wrapEle.outerHeight(true);
			var pageWidth = this.pageWidth;
			var pageHeight = this.pageHeight;

			var dialog = new Fix({
			 	x: 'left', 
				y: 'top',
				xValue: 'center',
				yValue: 'center',
				ele: this.wrapEle,
				zIndex: this.zIndex + 2
			});

			this.mask.css({
				width: Util.getDocWidth(),
				height: Util.getDocHeight()
			});
		},
		getIframeHgt: function () {
			var doc = this.iframe.get(0).contentWindow.document,
				docHeight = doc.documentElement.scrollHeight,
				bodyHeight = doc.body.scrollHeight;
			
			if (docHeight && bodyHeight) {
				return Math.min(docHeight, bodyHeight);
			}

			return docHeight || bodyHeight;
		},
		close: function () {
			this.wrapEle.remove();
			this.mask.remove();
		}
	});

	return Dialog;
});