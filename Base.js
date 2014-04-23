var Class = function(parent) {
	var klass = function() {
		this.init.apply(this, arguments);
	}

	//改变klass的原型
	if(parent) {
		var subClass = function() {};
		subClass.prototype = parent.prototype;
		klass.prototype = new subClass;
	}

	klass.prototype.init = function() {};

	//定义prototype的别名
	klass.fn = klass.prototype;

	//添加一个proxy函数
	klass.proxy = function(func) {
		var self = this;
		return(function() {
			return func.apply(self, arguments);
		});
	};

	//定义类的别名
	klass.fn.parent = klass;
	klass._super = klass.__proto__;

	//给类添加属性
	klass.extend = function(obj) {
		var extended = obj.extended;
		for(var i in obj) {
			klass[i] = obj[i];
		}
		//回调
		if(extended) extended(klass);
	};

	//给实例添加属性
	klass.include = function(obj) {
		var included = obj.included;
		for(var i in obj) {
			klass.fn[i] = obj[i];
		}
		//回调
		if(included) included(klass);
	}

	//在实例中添加代理
	klass.fn.proxy = klass.proxy;

	return klass;
}

var Person = new Class;

Person.extend({
	find: function(id) {console.info('Person的静态方法 find:' + id)},
	exists: function(id) {console.info('Person的静态方法  exists:' + id)},
	extended: function(klass) {
		console.info(klass, ' was extended!');
	}
});

Person.include({
	save: function(id) {console.info('Person的实例方法 save:' + id)},
	destory: function(id) {console.info('Person的实例方法 destory:' + id)},
	included: function(klass) {
		console.info(klass, ' was included!');
	}
});



Person.find(1);
Person.exists(2);

var person = new Person();

person.save(3);
person.destory(4);

var Animal = new Class;

Animal.include({
	breath: function() {
		console.info('breath');
	}
});

var Cat = new Class(Animal);

//继承方式
var tommy = new Cat;
tommy.breath();

//代理方式
var proxy = function(func, thisObj) {
	return(function() {
		return	func.apply(thisObj, arguments);
	});
};

var	clicky = {
	wasClicked: function() {
		console.info('oko');
	},
	addListeners: function() {
		var self = this;
		$('.clicky').click(proxy(this.wasClicked, this));
	},
	addJqueryListeners: function() {
		$('.clicky').click($.proxy(function() {
			console.info('jdfkjfkd');
		}, this));
	}
};

// clicky.addListeners();
// clicky.addJqueryListeners();

var App = {
	log: function() {
		if(typeof console == void(0)) return;

		var args = $.makeArray(arguments);

		args.unshift('app');

		console.info.apply(console, args);
	}
};

App.log('[1,23,4]')

var Button = new Class;

// Button.include({
// 	init: function(element) {
// 		this.element = $(element);

// 		this.element.click(this.proxy(this.click));
// 	},
// 	click: function() {
// 		console.info('button was clicked!!!')
// 	}
// });

// var button = new Button;
// button.init('.clicky');

//bind方式和proxy方式效果一样
Button.include({
	init: function(element) {
		this.element = $(element);

		this.element.click(this.click.bind(this));
	},
	click: function() {
		console.info('bind button was clicked!!!');
	}
});

var button = new Button;
button.init('.clicky'); 

//兼容低版本浏览器，支持bind方法
if(!Function.prototype.bind) {
	Function.prototype.bind = function(obj) {
		var slice = [].slice,
			args = slice.call(arguments, 1),
			self = this,
			nop = function() {},
			bound = function() {
				return self.apply(this instanceof nop ? this : (obj || {}), args.concat(slice.call(arguments)));
			};

		nop.prototype = self.prototype;

		bound.prototype = new nop();

		return bound;
	};
};

//利用匿名函数模拟私有作用域
var Person = function() {};

(function() {
	var findById = function() {};

	Person.find = function(id) {
		if(typeof id == 'integer') {
			return findById(id);
		}
	};
})();


var button = document.getElementById('test');
var listener = function() {console.info('click')};

//type, listener, useCapture(true 捕捉, false 冒泡)
button.addEventListener('click', listener, false);
button.removeEventListener('click', listener, false);

//netscape 事件采用capturing，事件捕捉，从外到内
//IE 事件采用bubbling, 事件冒泡，从内到外
//原生e.stopPropagation阻止事件冒泡，e.preventDefault阻止默认行为，或者在回调中return false
//DOMContentLoaded

//事件委托
list.addEventListener('click', function(e) {
	if(e.currentTarget.tagName == 'li') {
		reurn false;
	}
}, false);

$('ul').delegate('li', 'click', function() {

});

//自定义事件，自定义事件一般使用点号分隔
$('.clicky').bind('refresh.widget', function(e, data) {
	console.info(data);
});

//触发自定义事件
$('.clicky').trigger('refresh.widget', 34);

//jquery插件
$.fn.tabs = function(control) {
	var element = $(this);
	control = $(control);

	element.delegate('li', 'click', function() {
		var tabName = $(this).attr('data-tab');

		element.trigger('change.tabs', tabName);
	});

	element.bind('change.tabs', function(e, tabName) {
		element.find('li').removeClass('active');
		element.find('>[data-tab=' + tabName + ']').addClass('active');
	});

	element.bind('change.tabs', function(e, tabName) {
		control.find('>[data-tab]').removeClass('active');
		control.find('>[data-tab=' + tabName + ']').addClass('active');
	});

	var firstName = element.find('li:first').attr('data-tab');
	element.trigger('change.tabs', firstName);

	return this;
};
