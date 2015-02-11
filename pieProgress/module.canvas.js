/**
*@description: canvas模块
*@author: wolf
*@time: 2015-02-09 17:39:39
*/
define(function (require, exports, module) {

	//canvas模块
	module.exports = {
		createCanvas: function (attrs) {
			var element = document.createElement('canvas');
			
			$.each(attrs, function (name, value) {
				element.setAttribute(name, value);
			});
			
			return element; 
		},
		//http://stackoverflow.com/questions/654112/how-do-you-detect-support-for-vml-or-svg-in-a-browser
		isSupport: function () {
			var elem = document.createElement('canvas');
			return !!(elem.getContext && elem.getContext('2d'));
		},
		//绘制轨道
		drawTrack: function () {
			this.context.beginPath();
			//context.arc(x, y, radius, startAngle, endAngle, counterClockwise);
			this.context.arc(this.opts.width / 2 + this.opts.x, 
								this.opts.height / 2 + this.opts.y, 
								this.opts.width / 2 - this.opts.barsize / 2,
								0, 2 * Math.PI, false);
			this.context.lineWidth = this.opts.barsize;
			this.context.strokeStyle = this.opts.trackcolor;
			this.context.stroke();
			this.context.closePath();
		},
		//绘制圆环
		drawBar: function () {
			var endAngle = Math.PI * 1.49;
			
			this.context.beginPath();
			this.context.arc(this.opts.width / 2 + this.opts.x,
							this.opts.height / 2 + this.opts.y,
							this.opts.width / 2 - this.opts.barsize / 2,
							Math.PI * 1.5, endAngle, false);
			this.context.lineWidth = this.opts.barsize;
			this.context.strokeStyle = this.opts.barcolor;
			this.context.stroke();
		},
		updateBar: function () {
			
		},
		init: function (opts) {
		
			var canvasSzie;
		
			if (!this.isSupport) return;
			
			this.opts = $.extend({}, opts);
			
			canvasSize = (this.opts.width / 2 + this.opts.x) * 2;
			
			this.canvas = this.createCanvas({width: canvasSize, height: canvasSize});
			this.context = this.canvas.getContext('2d');
			
			this.opts.containerElement.appendChild(this.canvas);
			
			this.drawTrack();
			this.drawBar();
			
			return this;
		}
	};
})