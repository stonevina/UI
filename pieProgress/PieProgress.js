/**
*@description: 圆形进度条
*@author: wolf
*@time: 2015-01-06 14:29:32
*/
define(function (require, exports, module) {
	
	var Util = require('/common/Util.js');
	
	//默认参数
	var defaults = {
		width: 160,
		height: 160,
		barcolor: 'green',
        barsize: '1',
        trackcolor: '#f2f2f2',
        fillcolor: 'none',
		containerElement: document.body,
		//坐标值
		x: 10,
		y: 10
	};
	
	//svg模块
	SvgModule = {
		createSvg: function (tag, attrs) {
			var element = document.createElementNS("http://www.w3.org/2000/svg", tag);
			
			$.each(attrs, function (name, value) {
				element.setAttribute(name, value);
			});
			
			return element;
		},
		isSupport: function () {
			return 'createElementNS' in document && new this.createSvg('svg', {}).createSVGRect;
		},
		//返回公共配置
		getParam: function () {
			return {
				cx: this.opts.width / 2 + this.opts.x,
				cy: this.opts.height / 2 + this.opts.y,
                rx: this.opts.width / 2 - this.opts.barsize / 2,
                ry: this.opts.height / 2 - this.opts.barsize / 2,
				barsize: this.opts.barsize
			}
		},
		//绘制轨道
		drawTrack: function () {
			var param = this.getParam();
			
            var ellipse = new this.createSvg('ellipse', {
				//半径
                rx: param.rx,
                ry: param.ry,
				//坐标
                cx: param.cx,
                cy: param.cy,
				//边框颜色
                stroke: this.opts.trackcolor,
				//填充色
                fill: this.opts.fillcolor,
				//边框宽度
                'stroke-width': param.barsize
            });
            
            this.svg.appendChild(ellipse);
		},
		//绘制圆环
		drawBar: function () {
			var path = new this.createSvg('path', {
				stroke: this.opts.barcolor,
                fill: 'none',
                'stroke-width': this.opts.barsize
			});
			
			this.bar = path;
			this.svg.appendChild(path);
			
			this.bar.setAttribute('d', this.getD(100));
			this.drawPercentPath(0);
		},
		getD: function (percent) {
			var param = this.getParam();
			var angle = this.getAngle(percent);
			// var r = Math.min(param.cx, param.cy) - param.barsize / 2;
			var r = Math.min(param.rx, param.ry);
		
			var x1 = param.cx + r * Math.sin(angle.startAngle),
                y1 = param.cy - r * Math.cos(angle.startAngle),
                x2 = param.cx + r * Math.sin(angle.endAngle),
                y2 = param.cy - r * Math.cos(angle.endAngle);
		
			//参数说明 A rx,ry xAxisRotate LargeArcFlag,SweepFlag x,y
			//从当前点到x，y画椭圆，rx，ry为长短半轴，x-axis-rotation 偏转角度，是否是大的圆弧（0小,1大），sweepflag 顺时针还是逆时针（0逆,1顺）
			var d = "M" + x1 + "," + y1 +
                " A" + r + "," + r +
                " 0 " + this.LargeArcFlag + " 1 " +
                x2 + "," + y2;
				
			this.percent = percent;
			
			return d;
		},
		getAngle: function (percent) {
			var startAngle = 0, percent =  Math.min(100 - 0.00001, percent);
			var endAngle = startAngle + percent * Math.PI * 2 / 100;
			
			this.LargeArcFlag = endAngle - startAngle > Math.PI ? 1 : 0;
			
			return {
				startAngle: startAngle,
				endAngle: endAngle
			};
		},
		setPercentage: function (percent) {
			//进度100%时，起终点重合，使用接近100的值
			//http://stackoverflow.com/questions/5737975/circle-drawing-with-svgs-arc-path
			//http://www.jqueryscript.net/demo/Animated-Circle-Progress-Bar-with-jQuery-SVG-asPieProgress
			this.percent = Math.round(100 * percent / 100);
        },
		drawPercentPath: function (percent) {
			var totalLength = this.bar.getTotalLength();
			
			this.bar.style.strokeDasharray = totalLength + ' ' + totalLength;
			this.bar.style.strokeDashoffset = (1 - percent / 100) * totalLength;
			
			this.percent = percent;
		},
		updateBar: function (goal, removeAnimated) {
			var self = this;
			
			goal = Math.min(Math.max(goal, 0), 100);
	
			this.drawPercentPath(this.percent);
			
			//不添加动画
			if (removeAnimated) return;
			
			this.rAF = requestAnimationFrame(function () {
			
				if (goal > self.percent) {
					self.percent++;
				}
				
				if (goal < self.percent) {
					self.percent--;
				}
				
				if (self.percent == goal || self.percent >= 100 || self.percent <= 0) {
				
					self.setPercentage(goal);
					self.updateBar(goal, true);
					
					return cancelAnimationFrame(self.rAF);
				}
				
				self.setPercentage(self.percent);
				self.updateBar(goal);
				
			});
		},
		init: function (opts) {
		
			this.opts = $.extend({}, defaults, opts);
			
			this.svg = new this.createSvg('svg', {
                'width': this.opts.width + this.opts.x,
                'height': this.opts.height + this.opts.y
            });
			
			this.drawTrack();
			this.drawBar();
			this.opts.containerElement.appendChild(this.svg);
		}
	};
	
	//vml模块
	VmlModule = {
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
	
	var checkSupportVml = function () {};
	
	var checkSupportCanvas = function () {};
	
	var checkSupportCSS3 = function () {};
	
	Util.initAnimationFrame();
	
	return {
		svg: SvgModule,
		vml: VmlModule
	};
});