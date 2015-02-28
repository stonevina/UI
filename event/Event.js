/**
 * 事件模块，支持链式调用
 * @example 
	Event.on('test', function () {
		console.info('test');
	}).on('hello test', function () {
		console.info('hello test');
	}).off('test').emit('test').emit('hello test');
 * ref: Sea.js 2.2.0 | seajs.org/LICENSE.md
 */
define(function (require, exports, module) {
	var events = {}, Event = {};
	
	//绑定事件
	Event.on = function (name, callback) {
		var list = events[name] || (events[name] = []);
		list.push(callback);
		
		return this;
	}
	
	//解除事件
	Event.off = function (name, callback) {
		if (!(name || callback)) {
			events = {};
			return this;
		}
		
		var list = events[name];
		if (list) {
			if (callback) {
				for (var i = list.length - 1; i >=0; i--) {
					if (list[i] === callback) {
						list.splice(i, 1);
					}
				}
			} else {
				delete events[name];
			}
		}
		
		return this;
	}
	
	//fire事件
	Event.emit = function (name, data) {
		var list = events[name], fn;
		
		if (list) {
			list = list.slice();
		
			while(fn = list.shift()) {
				fn(data);
			}
		}
		
		return this;
	}
	
	return Event;
});