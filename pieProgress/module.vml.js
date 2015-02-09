/**
*@description: SVG模块
*@author: wolf
*@time: 2015-02-09 15:29:08
*/
define(function (require, exports, module) {

	//vml模块
	module.exports = {
		createVml: function (tag, attrs) {
			var doc = document, element, rStyle = /^\s*(width\b|height\b|position\b|top\b|left\b|bottom\b|right\b)\s*$/;
			
			doc.createStyleSheet().addRule("v\\:\*", "{behavior:url(#default#vml);}");
			
			if (!doc.namespaces.rvml) {
				doc.namespaces.add("v", "urn:schemas-microsoft-com:vml");
			}
			
			element = doc.createElement('<v:' + tag + '>');
			
			//样式文件和属性必须得分开赋值
			$.each(attrs, function (name, value) {				
				if (rStyle.test(name)) {
					element.style[name] = value;
				} else {
					element[name] = value;
				}
			});
			
			return element;
		},
		//http://stackoverflow.com/questions/654112/how-do-you-detect-support-for-vml-or-svg-in-a-browser
		isSupport: function () {
			var detectDiv = document.body.appendChild(document.createElement('div'));
			detectDiv.innerHTML = '<v:shape id="vml_flag1" adj="1" />';
			
			var detectVml = detectDiv.firstChild;
			detectVml.style.behavior = 'url(#default#VML)';
			
			var supportsVml;
			
			supportsVml = detectVml ? typeof detectVml.adj == 'object' : true;
			detectDiv.parentNode.removeChild(detectDiv);
			
			return supportsVml;
		},
		//返回公共配置
		getParam: function () {
			return {
				width: this.opts.width,
				height: this.opts.height,
				barsize: this.opts.barsize,
				position: 'absolute',
				left: this.opts.x,
				top: this.opts.y
			}
		},
		//绘制轨道
		drawTrack: function () {
			var param = this.getParam();
			
            var oval = new this.createVml('oval', $.extend({		
				strokecolor: this.opts.trackcolor,
				filled: false,
				strokeweight: param.barsize
            }, param));
            
            this.opts.containerElement.appendChild(oval);
		},
		//绘制圆环
		drawBar: function () {
			var param = this.getParam();
			
			var arc = new this.createVml('arc', $.extend({
				strokecolor: this.opts.barcolor,
                filled: false,
                strokeweight: this.opts.barsize,
				startangle: 0,
				endangle: 0
			}, param));
			
			this.bar = arc;
			this.opts.containerElement.appendChild(arc);
			
			this.setPercentage(0);
		},
		setPercentage: function (percent) {
			this.percent = Math.round(100 * percent / 100);
        },
		updateBar: function () {
			var self = this;
			
			setInterval(function () {				
				self.percent += 1;
				self.percent = self.percent > 100 ? 0 : self.percent;
				
				self.bar.setAttribute('endangle', self.percent * 3.6);
			}, 100);
		},
		init: function (opts) {
		
			this.opts = $.extend({}, defaults, opts);
			
			this.drawTrack();
			this.drawBar();
			
			this.updateBar();
		}
	};
})