/**
*@description: 圆形进度条
*@author: wolf
*@time: 2015-01-06 14:29:32
*/
define(function (require, exports, module) {
	
	//默认参数
	var defaults = {
        goal: 100,
        speed: 15,
		width: 160,
		height: 160,
		barcolor: 'green',
        barsize: '4',
        trackcolor: '#f2f2f2',
        fillcolor: 'none',
		containerElement: document.body
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
				width: this.opts.width,
				height: this.opts.height,
				cx: this.opts.width / 2,
				cy: this.opts.height / 2,
				barsize: this.opts.barsize
			}
		},
		//绘制轨道
		drawTrack: function () {
			var param = this.getParam();
			
            var ellipse = new this.createSvg('ellipse', {
                rx: param.cx - param.barsize / 2,
                ry: param.cy - param.barsize / 2,
                cx: param.cx,
                cy: param.cy,
                stroke: this.opts.trackcolor,
                fill: this.opts.fillcolor,
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
			
			this.setPercentage(5);
			this.bar.setAttribute('d', this.getD());
		},
		getD: function () {
			var param = this.getParam();
			var angle = this.getAngle();
			var r = Math.min(param.cx, param.cy) - param.barsize / 2;
		
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
			
			return d;
		},
		getAngle: function () {
			var startAngle = 0;
			var endAngle = startAngle + this.percentage * Math.PI * 2 / 100;
			
			this.LargeArcFlag = endAngle - startAngle > Math.PI ? 1 : 0;
			
			return {
				startAngle: startAngle,
				endAngle: endAngle
			};
		},
		setPercentage: function (percent) {
			this.percentage = Math.round(100 * percent / 100);
        },
		updateBar: function (percent) {
			var self = this;
			
			setInterval(function () {
				self.percentage += 1;
				self.percentage = self.percentage > 100 ? 0 : self.percentage;
				self.bar.setAttribute('d', self.getD());
			}, 100);
		},
		init: function (opts) {
		
			this.opts = $.extend({}, defaults, opts);
			
			this.svg = new this.createSvg('svg', {
                'width': this.opts.width,
                'height': this.opts.height
            });
			
			this.drawTrack();
			this.drawBar();
			this.opts.containerElement.appendChild(this.svg);
		},
	};
	
	//vml模块
	VmlModule = {
		createVml: function (tag, attrs) {
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
				width: this.opts.width,
				height: this.opts.height,
				cx: this.opts.width / 2,
				cy: this.opts.height / 2,
				barsize: this.opts.barsize
			}
		},
		//绘制轨道
		drawTrack: function () {
			var param = this.getParam();
			
            var ellipse = new this.createSvg('ellipse', {
                rx: param.cx - param.barsize / 2,
                ry: param.cy - param.barsize / 2,
                cx: param.cx,
                cy: param.cy,
                stroke: this.opts.trackcolor,
                fill: this.opts.fillcolor,
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
			
			this.setPercentage(5);
			this.bar.setAttribute('d', this.getD());
		},
		getD: function () {
			var param = this.getParam();
			var angle = this.getAngle();
			var r = Math.min(param.cx, param.cy) - param.barsize / 2;
		
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
			
			return d;
		},
		getAngle: function () {
			var startAngle = 0;
			var endAngle = startAngle + this.percentage * Math.PI * 2 / 100;
			
			this.LargeArcFlag = endAngle - startAngle > Math.PI ? 1 : 0;
			
			return {
				startAngle: startAngle,
				endAngle: endAngle
			};
		},
		setPercentage: function (percent) {
			this.percentage = Math.round(100 * percent / 100);
        },
		updateBar: function (percent) {
			var self = this;
			
			setInterval(function () {
				self.percentage += 1;
				self.percentage = self.percentage > 100 ? 0 : self.percentage;
				self.bar.setAttribute('d', self.getD());
			}, 100);
		},
		init: function (opts) {
		
			this.opts = $.extend({}, defaults, opts);
			
			this.svg = new this.createSvg('svg', {
                'width': this.opts.width,
                'height': this.opts.height
            });
			
			this.drawTrack();
			this.drawBar();
			this.opts.containerElement.appendChild(this.svg);
		},
	};
	
	var checkSupportVml = function () {};
	
	var checkSupportCanvas = function () {};
	
	var checkSupportCSS3 = function () {};
	
	return {
		svg: SvgModule
	};
});