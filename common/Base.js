define(function() {
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

	return Class;
});