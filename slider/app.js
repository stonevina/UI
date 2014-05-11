require(['./Slider', '../common/Template'], function(Slider, Template) {

	var data = ["http://img12.360buyimg.com/da/g13/M07/12/07/rBEhVFLZBwkIAAAAAAAc7KqmHbkAAIByQOfYG0AAB0E099.jpg", 
				"http://img12.360buyimg.com/da/g13/M07/12/12/rBEhVFLc9p8IAAAAAAA8wQEsmSYAAIF8ABdpLcAADzZ023.jpg", 
				"http://img12.360buyimg.com/da/g13/M05/12/06/rBEhUlLY4l0IAAAAAAAoYKOkbWYAAIBUQP_z9YAACh4094.jpg", 
				"http://img14.360buyimg.com/da/g14/M04/0D/1C/rBEhVVLdxjUIAAAAAAAa1rtJQxUAAIM7ABBUiAAABru736.jpg", 
				"http://img11.360buyimg.com/da/g13/M04/12/11/rBEhVFLc1-MIAAAAAAAjQ9ffNfEAAIFkgNMbYMAACNb055.jpg", 
				"http://img13.360buyimg.com/da/g14/M03/0D/18/rBEhVVLcs4EIAAAAAAAxlrSHBK0AAILqgJqAWkAADGu049.jpg", 
				"http://img13.360buyimg.com/da/g14/M03/0D/18/rBEhVVLcs4EIAAAAAAAxlrSHBK0AAILqgJqAWkAADGu049.jpg", 
				"http://img11.360buyimg.com/da/g13/M04/12/11/rBEhVFLc1-MIAAAAAAAjQ9ffNfEAAIFkgNMbYMAACNb055.jpg", 
				"http://img13.360buyimg.com/da/g14/M03/0D/18/rBEhVVLcs4EIAAAAAAAxlrSHBK0AAILqgJqAWkAADGu049.jpg", 
				"http://img13.360buyimg.com/da/g14/M03/0D/18/rBEhVVLcs4EIAAAAAAAxlrSHBK0AAILqgJqAWkAADGu049.jpg", 
				"http://img11.360buyimg.com/da/g13/M04/12/11/rBEhVFLc1-MIAAAAAAAjQ9ffNfEAAIFkgNMbYMAACNb055.jpg", 
				"http://img13.360buyimg.com/da/g14/M03/0D/18/rBEhVVLcs4EIAAAAAAAxlrSHBK0AAILqgJqAWkAADGu049.jpg", 
				"http://img13.360buyimg.com/da/g14/M03/0D/18/rBEhVVLcs4EIAAAAAAAxlrSHBK0AAILqgJqAWkAADGu049.jpg"];

	$('#slider01 ul, #slider02 ul, #slider03 ul').empty().append(Template($('#listTemplate').html(), data));

	var shopSlider01 = new Slider({speed: 400,step: 1,visible:1,slideWrapSelector: '#slider01', isAutoPlay: true, isLoop: true});
	var shopSlider02 = new Slider({speed: 400,step: 1,visible:1,slideWrapSelector: '#slider02', isLoop: true});
	var shopSlider03 = new Slider({speed: 400,step: 3,visible:4,slideWrapSelector: '#slider03'});
});