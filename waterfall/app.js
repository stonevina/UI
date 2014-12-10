require(['./WaterFall'], function(WaterFall) {

	var tpl = {
		list: '<div class="classify clearfix">\
				{for list in data}\
				<div class="plist">\
					{for item in list}\
					<div class="item fore0${(+item_index) + 1}">\
						<a href="javascript:;">\
							<img src="${item.src}">\
							<div class="txt">${item.text}</div>\
							<div class="hover_bg"></div>\
							<s></s>\
						</a>\
					</div>\
					{/for}\
				</div>\
				{/for}\
			  </div>'
	};

	var oData = [{
		src: 'http://misc.360buyimg.com/user/gift/widget/chooseGift/images/pic1.jpg',
		text: '项链'
	},{
		src: 'http://misc.360buyimg.com/user/gift/widget/chooseGift/images/pic2.jpg',
		text: '项链'
	},{
		src: 'http://misc.360buyimg.com/user/gift/widget/chooseGift/images/pic2.jpg',
		text: '项链'
	},{
		src: 'http://misc.360buyimg.com/user/gift/widget/chooseGift/images/pic2.jpg',
		text: '项链'
	},{
	src: 'http://misc.360buyimg.com/user/gift/widget/chooseGift/images/pic2.jpg',
		text: '项链'
	},{
		src: 'http://misc.360buyimg.com/user/gift/widget/chooseGift/images/pic2.jpg',
		text: '项链'
	},{
		src: 'http://misc.360buyimg.com/user/gift/widget/chooseGift/images/pic2.jpg',
		text: '项链'
	},{
		src: 'http://misc.360buyimg.com/user/gift/widget/chooseGift/images/pic2.jpg',
		text: '项链'
	},{
	src: 'http://misc.360buyimg.com/user/gift/widget/chooseGift/images/pic2.jpg',
		text: '项链'
	},{
		src: 'http://misc.360buyimg.com/user/gift/widget/chooseGift/images/pic2.jpg',
		text: '项链'
	},{
		src: 'http://misc.360buyimg.com/user/gift/widget/chooseGift/images/pic2.jpg',
		text: '项链'
	},{
		src: 'http://misc.360buyimg.com/user/gift/widget/chooseGift/images/pic2.jpg',
		text: '项链'
	}];
	
	var listData = [];
	listData.push(oData);
	
	var waterFall = new WaterFall({
		container: '.chooseGift .mc',
		testData: listData,
		tpl: tpl.list,
		delay: 500,
		loading: function () {
			$('.chooseGift .load').remove();
			$('.chooseGift .mc').append(self.tpl.loading);
		},
		complete: function () {
			$('.chooseGift .load').remove();
			console.info('ok');
		}
	});
});