/**
 * @description: 老虎机
 * @version: 1.0.0
 * @author: wolf
 * @time: 2014-06-25 10:06:23
 */
define(['../common/Base', '../common/Template', '../common/Util', '../common/Tween'], function (Class, Template, Util, Tween) {
	var Slot = new Class;

	Slot.include({
		init: function (opts) {
			var defaults = {
				//目标元素
				target: '',
				//初始值
				startVal: 0,
				//变化值
				changeVal: 0,
				//持续时间
				duration: 0,
				//开始时间
				startTime: 0,
				//步长
				step: 1,
				//结果索引值
				result: 4,
				//动画停止后的回调
				complete: $.noop
			},
			settings = $.extend({}, defaults, opts);
			$.extend(this, settings);

			this.loadData();
			this.bindEvent();
			Util.initAnimationFrame();
		},
		//@override
		tpl: '<%for(var i = 0; i < this.length; i++) {%>\
				<div class="fore" id="solt-item-<%i%>">\
					<ul>\
						<%for(var j = 0, m = this[i]; j < m.length; j++) {%>\
							<li id="<%m[j].id%>" title="<%m[j].title%>">\
								<img width=100 height=100 src="<%m[j].src%>" alt="<%m[j].title%>" data-img="1" class="err-product"/>\
							</li>\
						<%}%>\
					</ul>\
					<em></em>\
				</div>\
			<%}%>\
			',
		//@override
		loadData: function () {
            var defaultImage = 'http://misc.360buyimg.com/vip/skin/2013/i/tks.jpg',
                defaultStartImage = 'http://misc.360buyimg.com/vip/skin/2013/i/e-i2.png';

            //加载抽奖部分数据
            var dataSource = $('.gift-list li a').children(),
      			data = [];

            $.each(dataSource, function(i, v) {
                var obj = {
                    href  : '',
                    src : $(this).attr('src'),
                    id : $(this).parent().attr('itemid'),
                    title : $(this).attr('title')
                };
                data.push(obj);
            })

            //增加默认图片
            var defaultImageObj = {
                href : '',
                src : defaultImage,
                id : '',
                title : '谢谢参与'
            },
            defaultStartImageObj = {
                href : '',
                src : defaultStartImage,
                id : '',
                title : '京东抽奖'
            };
            data.push(defaultImageObj);
            data.unshift(defaultStartImageObj);
            //此数据用户无缝滚动
            data.push(defaultStartImageObj);

            $('.draw-box>div.d-list').empty().append(Template(this.tpl, [data, data, data]));
		},
		bindEvent: function () {

			//抽奖按钮
			$('a.draw-btn').click($.proxy(this.start, this));

			$('a.draw-btn').mouseup(function () {
				$(this).removeClass('drawed-btn');
			});

			$('a.draw-btn').mousedown(function () {
				$('.d-list em').css('z-index', 2);
				$(this).addClass('drawed-btn');
			});

		},
		start: function () {

			this.goal = $(this.target).find('ul');
			this.itemHeight = $(this.target).find('li').outerHeight();
			this.itemTotalHeight = ($(this.target).find('li').length - 1) * this.itemHeight;
			this.changeVal = this.result * this.itemHeight;

			this.reset();
			this.freeRun();

		},
		//自由滚动
		freeRun: function () {
			this.goal.css('marginTop', Math.ceil(Tween.Quad.easeOut(this.startTime, this.startVal, -1 * this.itemTotalHeight, this.duration)));

			if (this.startTime < this.duration) {
				this.startTime += this.step;
				this.rAF = requestAnimationFrame($.proxy(this.freeRun, this));
			} else {
				this.reset();
				this.goalRun();
			}
		},
		//目标定位滚动
		goalRun: function () {
			this.goal.css('marginTop', Math.ceil(Tween.Back.easeOut(this.startTime, this.startVal, -1 * this.changeVal, this.duration)));

			if (this.startTime < this.duration) {
				this.startTime += this.step;
				this.rAF = requestAnimationFrame($.proxy(this.goalRun, this));
			} else {
				this.reset();
				this.complete();
			}
		},
		reset: function () {
			cancelAnimationFrame(this.rAF);
			this.startTime = 0;
		}
	});

	return Slot;
});