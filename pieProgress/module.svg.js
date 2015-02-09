/**
*@description: SVG模块
*@author: wolf
*@time: 2015-02-09 15:22:39
*/
define(function (require, exports, module) {
	
	//svg模块
	module.exports = {
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
				
				if (self.percent == goal || self.percent >= 100 || self.percent <= 0 || Math.abs(self.percent - goal) < 1) {
				
					self.setPercentage(goal);
					self.updateBar(goal, true);
					
					return cancelAnimationFrame(self.rAF);
				}
				
				self.setPercentage(self.percent);
				self.updateBar(goal);
				
			});
		},
		init: function (opts) {
		
			this.opts = $.extend({}, opts);
			
			this.svg = new this.createSvg('svg', {
                'width': this.opts.width + this.opts.x,
                'height': this.opts.height + this.opts.y
            });
			
			this.drawTrack();
			this.drawBar();
			this.opts.containerElement.appendChild(this.svg);
		}
	};
})