/**
 * @module  lang
 
 * - language enhancement for javascript
 * - adapter for mootools
 */

;(function(K){
	
/**
 * copy all properties in the supplier to the receiver
 * @param r {Object} receiver
 * @param s {Object} supplier
 * @param or {boolean=} whether override the existing property in the receiver
 * @param cl {(Array.<string>)=} copy list, an array of selected properties
 */
function mix(r, s, or, cl) {
	if (!s || !r) return r;
	var i = 0, c, len;
	or = or || or === undef;

	if (cl && (len = cl.length)) {
		for (; i < len; i++) {
			c = cl[i];
			if ( (c in s) && (or || !(c in r) ) ) {
				r[c] = s[c];
			}
		}
	} else {
		for (c in s) {
			if (or || !(c in r)) {
				r[c] = s[c];
			}
		}
	}
	return r;
};
	
	
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
	var key, value, ret = [], encode = encodeURIComponent;
	
	for(key in obj){
		!K.isObject(value = obj[key]) && !K.isArray(value) && ret.push(key + '=' + encode(value));
	}
	
	return ret.join(splitter || '&');
};



var	NOOP = function(){},
	array_join = Array.prototype.join,

	_guid = 1;
 

K.mix(K, {
		  
/**
 * language enhancement 
 
 * for non-ECMAScript5 implementations, we'll add them into the KM namespace
 * and ECMAScript5 standard methods will be included in native.js
 * --------------------------------------------------------------------------------------------- */
			
	/**
	 * Never use KM._type to test for a certain type in your javascript for business, 
	 * since the returned string may be subject to change in a future version
	 
	 * use KM.isXXX instead
	 */
	_type: type,
	
	guid: function(){
		return _guid ++;
	},
	 
	merge: Object.merge, // Object.merge
	
	// random: Number.random, // Number.random
	
	now: function(){
		return + new Date;
	},
	
	
	lambda: Function.from,
	
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
		var ret = {
			start: function(){
				ret.cancel();
				return ret.id = isInterval ? setInterval(fn, delay) : setTimeout(fn, delay);
			},
			cancel: function(){
				var timer = ret.id;
				
				ret.id = isInterval ? clearInterval(timer) : clearTimeout(timer);
				return ret;
			}
		};
		
		return ret;
	},
	
	makeArray: function(obj){
		return Array.from(obj); // K.isArray(obj) ? obj : [obj];
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
	 * run a method once and only ONCE before the real method executed
	 * usefull for lazy initialization
	 *
	 * @example
	 * if Overlay::show is the public api to show the overlay
	 * but it has a initialization method, which we want to be called just before the overlay shows, not the very moment when the instance of Overlay created,
	 * so,
	 * we apply:
	 * initialization method 	-> Overlay::_showInit
	 * real show method 		-> Overlay::show
	 * and then:
	 *
	 * @usage
		 <code>
		 	// before 'show', '_showInit' will be executed only once
		 	KM._onceBefore('show', '_showInit', Overlay.prototype);
		 </code>
	 */
	_onceBefore: function(real_method_name, init_method_name, belong){
		var init = belong[init_method_name],
			real = belong[real_method_name];
			
		belong[real_method_name] = function(){
			init.call(this);
			real.apply(this, arguments);
			
			belong[real_method_name] = real;
		};
		
		// delete belong[init_method_name];
		// 
		belong[init_method_name] = NOOP;
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


 change log:
 2011-04-19  Kael:
 - add method lazyInit，fix a bug of overloadInstanceMethod
 - add method to detect the type of an object. set KM._type as semi-private method
 2011-04-15  Kael:
 - add adapter for overloadSetter, 
 - add method overloadInstanceMethod
 2011-04-1   Kael Zhang: move KM.ready to web.js
 2010-12-31  Kael Zhang:
 - add KM.data and KM.delay
 - remove domready from mootools
 */