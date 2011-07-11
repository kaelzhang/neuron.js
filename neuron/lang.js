/**
 * @module  lang
 
 * - language enhancement for javascript
 * - adapter for mootools
 */

;(function(K){
	
// bind the this pointer of a function	
function bind_method(fn, bind){
	return function(){
		return fn.apply(bind, arguments);
	}
};

/**
 * transform functions that have the signature fn(key, value)
 * to 
 * functions that could accept object arguments
 * @adapter
 */
function batch_setter(fn){
	return fn.overloadSetter();
};


/**
 * memoize static result of a complicated method to save time
 */
function memoizeMethod(fn){
	var stack = {};
	
	return function(){
		var arg = array_join.call(arguments, '~^_^~');
	
		return (arg in stack) ? stack[arg] : (stack[arg] = fn.apply(null, arguments));
	}
};


/**
 * transform constructor functions to functions that could change a method of a instance or singleton 
 */
function overload_for_instance_method(fn){
	var self = this;

	return function(methodname, instance){
		var arg = arguments;
	
		return K.isFunction(methodname) ?
			fn.apply(self, arg)
		:	instance[methodname] = fn.call(instance, instance[methodname], instance);
	};
};


function toQueryString(obj, splitter){
	var key, ret = [];
	
	for(key in obj){
		ret.push(key + '=' + obj[key]);
	}
	
	return ret.join(splitter || '&');
};



var	array_join = Array.prototype.join,

	/**
	 * a simple and faster typeOf method, and an adapter for mootools
	 * @adapter
	 */
	type = function(){
	
		/**
		 * @param useOrigin {Boolean} use origin method (of mootools)
		 */
		function _type(obj, useOrigin){
			return !useOrigin && type_map[ toString.call(obj) ] || adapter(obj);
		};
	
		var type_map = {},
			_K = K,
		
			// adapter for mootools 1.3
			adapter = typeOf,
			toString = Object.prototype.toString;
	
		'Boolean Number String Function Array Date RegExp Object'.split(' ').each(function(name){
			var nl = name.toLowerCase();
		
			type_map[ '[object ' + name + ']' ] = nl;
			
			_K['is' + name] = function(o){
				return _type(o) === nl;
			}
		});
	
		return _type;
	}();
 

K.mix(K, {
		  
	/**
	 * @adapter 
	 * ----------------------------------------------------------------------------------------------- /
	 * encapsulation for mootools.core
	 */
			
	/**
	 * Never use KM._type to test for a certain type in your javascript for business, 
	 * since the returned string may be subject to change in a future version
	 
	 * use KM.isXXX instead
	 */
	_type: type,
	
	isPlainObject: function(obj){
		return obj && K.isObject(obj) && 'isPrototypeOf' in obj;
	},
	 
	merge: Object.merge, // Object.merge
	
	random: Number.random, // Number.random
	
	now: function(){
		return + new Date;
	},
	
	
	lambda: Function.from,
	
	
	/**
	 * language enhancement 
	 * --------------------------------------------------------------------------------------------- */
	 
	
	/**
	 * bind 'this' pointer for a function
	 * or bind a method for a constructor
	 * @usage:
	 * <code>
	   1. KM.bind(myFunction, {a:1});
	   2. KM.bind('method', {a:1, method: function(){ alert(this.a) }});
	 
	 * </code>
	 * 
	 */
	bind: function(fn, bind){
		return K.isFunction(fn) ?
			bind_method(fn, bind)
		:
			(bind[fn] = bind_method(bind[fn], bind));
	},
	
	/**
	 * method to encapsulate the delayed function
	 */
	delay: function(fn, delay, isInterval){
		var timer;
	
		return {
			start: function(){
				this.cancel();
				return timer = isInterval ? setInterval(fn, delay) : setTimeout(fn, delay);
			},
			cancel: function(){
				isInterval ? clearInterval(timer) : clearTimeout(timer);
				return this;
			}
		}
	},
	
	/**
	 * 
	 */
	each: function(obj, fn, stop){
		
	},
	
	makeArray: function(obj){
		return K.isArray(obj) ? obj : [obj];
	},
	
	toQueryString: function(obj, splitter){
		return K.isObject(obj) ? toQueryString(obj, splitter) : obj;
	},
	
	
	/**
	 * OOP Enhancement 
	 * --------------------------------------------------------------------------------------------- */
	 
	 
	/**
	 * overload a setter function or a setter method of a instance
	 */
	_overloadSetter: overload_for_instance_method( batch_setter ),
	
	/**
	 * 
	 */
	_overloadInstanceMethod: overload_for_instance_method,
	
	/**
	 * lazy execute the initialization method before the real method called
	 *
	 * @example
	 * if KM.Overlay::show is the public api to show the overlay
	 * but it has a initialization method, which we want to be called just before the overlay shows, not the very moment when the instance of KM.Overlay created,
	 * so,
	 * we apply:
	 * initialization method 	-> KM.Overlay::show
	 * real show method 		-> KM.Overlay::_show
	 * and then:
	 *
	 * @usage
		 <code>
		 	KM._lazyInit('show', '_show', KM.Overlay.prototype);
		 </code>
	 */
	_lazyInit: function(init_method_name, real_method_name, belong){
		var init = belong[init_method_name],
			real = belong[real_method_name];
			
		belong[init_method_name] = function(){
			init.call(this);
			real.apply(this, arguments);
			
			belong[init_method_name] = real;
		};
		
		delete belong[real_method_name];
	},
	
	/**
	 @usage
		 <code>
			funcion myMethod(string){....}
			var memoizedMyMethod = KM._memoize(myMethod);
		 </code>
	 */
	_memoize: overload_for_instance_method( memoizeMethod )

});


})(KM);

/**
 * TODO:


 * change log:
 * 2011-06-09  Kael:
 * - 增加 KM.each 
 * 2011-04-19  Kael:
 * - 增加 lazyInit 方法，修正 overloadInstanceMethod 的一个bug
 * - 增加 类型判断方法，将 KM._type 从主要api中移除
 * 2011-04-15  Kael:
 * - 增加 overloadSetter的adapter, 为普通函数与instance的方法，重构 overload 和 bind 的实现
 * 2011-04-1   Kael Zhang: 去除lang中的domready方法，增加KM.bind
 * 2010-12-31  Kael Zhang:
 * - 迁移domready方法由mt.js到lang.js，修改部分实现。
 * - 迁移data和delay方法至此
 */