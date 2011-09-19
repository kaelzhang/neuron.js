/**
 * language and OOP enhancement for non-ECMAScript5 standards
 */

;(function(K, undef){
	
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
function overloadSetter(fn){

	// @return {undefined} setter method will always return this, 
	// for the sake of potential chain-style invocations
	return function(key, value){
	
		// this must
		var self = this;
	
		// set(0, 123); -> { '0': 123 }
		if (key || key === 0){
			if (K.isString(key)){
				fn.call(self, key, value);
			
			}else if (K.isObject(key)){	
				K.each(key, function(v, k){
					fn.call(self, k, v);
				});
			}
		}
		
		return self;
	};
};


/**
 * memoize static result of a complicated method to save time
 */
function memoizeMethod(fn){
	var stack = {};
	
	return function(){
		var arg = array_join.call(arguments, MEMOIZE_JOINER);
	
		return (arg in stack) ? stack[arg] : (stack[arg] = fn.apply(null, arguments));
	}
};


/**
 * transform constructor functions to functions that could change a method of a instance or singleton 
 */
/*
function overload_for_instance_method(fn){
	var self = this;

	return function(methodname, instance){
		var arg = arguments;
	
		return K.isFunction(methodname) ?
			fn.apply(self, arg)
		:	instance[methodname] = fn.call(instance, instance[methodname], instance);
	};
};
*/


function toQueryString(obj, splitter){
	var key, value, ret = [], encode = encodeURIComponent;
	
	for(key in obj){
		!K.isObject(value = obj[key]) && !K.isArray(value) && ret.push(key + '=' + encode(value));
	}
	
	return ret.join(splitter || '&');
};


/**
 * @private
 * @param {mixed} o
 * @param {Object} marked stack for marked objects
 * @param {function=} filter
 * @param {Object=} host, for both inner and external use
 * @param {Object=} cached stack for cached objects which are the clones of marked objects
 * @param {number=} depth, for inner use
 */
function clone(o, marked, filter, host, cached, depth){
	var cloned = {}, m, id, key, value;
	
	// internal use
	cached || (cached = {});
	depth || (depth = 1);
	
	switch(K._type(o)){
		case 'date':
			return new Date(o);
			
		case 'array':
			cloned = [];
			
		// object, plainObject, instance
		case 'object':
			m = CLONE_MARKER;
			host || (host = cloned);
		
			if(o[m]){
				return cached[o[m]];
			}
			
			id = _guid ++;
			
			// mark copied object to prevent duplicately cloning
			o[m] = id;
			marked[id] = o;
			cached[id] = cloned;
			
			for(key in o){
				value = o[key];

				if(
					// !CLONE_MARKER
					key !== m &&
					
					// pass the filter
					(!filter || filter(value, key, depth))
				){
					host[key] = clone(value, marked, filter, null, cached, depth + 1);
				}
			}
			
			// free
			marked = cached = null;
		
			return host;
			
		// number, boolean, element(DOMElement, HTMLWindow, HTMLDocument, HTMLhtmlElement), collections
		// arguments?
		default:
			return o;
	}
};


var	NOOP 			= function(){},
	array_join 		= Array.prototype.join,
	CLONE_MARKER 	= '>_>~cloned',
	MEMOIZE_JOINER 	= '~^_^~',

	_guid = 1;

		  
/**
 * language enhancement 
 
 * for non-ECMAScript5 implementations, we'll add them into the KM namespace
 * and ECMAScript5 standard methods will be included in native.js
 * --------------------------------------------------------------------------------------------- */
	
K.mix = mix;
	
K.guid = function(){
	return _guid ++;
};

/**
 * forEach method for Object
 */
K.each = function(obj, fn, context){
	if(K.isFunction(fn)){
	
		context = context || obj;

		if(K.isObject(obj)){
			var keys = Object.keys(obj), i = 0, len = keys.length, key;
			
			for(; i < len; i ++){
				key = keys[i];
				obj.hasOwnProperty(key) && fn.call(context, obj[key], key);
			}
			
		}else if(K.isArray(obj)){
			obj.forEach(fn, context);
			
		}
	}
};
 

/**
 * deep clone an object, excluding properties on prototype chain.
 * is able to deal with recursive object, unlike the poor Object.clone of mootools
 
 * @param {Object|Array} o
 * @param {?function()} filter filter function(value, key, depth)
 * @param {Object=} receiver
 * @return {Object} the cloned object
 
 usage:
 <code>
	 var a = {}, b = {}, c; a.a = a; 
	 KM.clone(a, false, b);	// clone a to b
	 c = KM.clone(a); 		// clone a to c
 </code>
 */
K.clone = function(o, filter, receiver) {
	var marked = {},
		m = CLONE_MARKER,
		cloned = clone(o, marked, filter, receiver);
	
	// remove CLONE_MARKER
	K.each(marked, function(v){
		try{
			delete v[m];
		}catch(e){
			K.log('del CLONE_MARKER err', e);
			v[m] = undefined;
		}
	});
	
	marked = null;
	
	return cloned;
};

// random: Number.random, // Number.random

// K.now = function(){
//	return + new Date;
// };

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
K.bind = function(fn, bind){
	return K.isFunction(fn) ?
		bind_method(fn, bind)
	:
		(bind[fn] = bind_method(bind[fn], bind));
};

/**
 * method to encapsulate the delayed function
 */
K.delay = function(fn, delay, isInterval){
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
};

// TODO:
// improve stability
K.makeArray = function(obj){
	return K.isArray(obj) ? obj : [obj];
};

K.toQueryString = function(obj, splitter){
	return K.isObject(obj) ? toQueryString(obj, splitter) : obj;
};


/**
 * OOP Enhancement 
 * --------------------------------------------------------------------------------------------- */
 
 
/**
 * overload a setter function or a setter method of a instance
 */
K._overloadSetter = overloadSetter; // overload_for_instance_method( batch_setter ),

/**
 * 
 */
// _overloadInstanceMethod: overload_for_instance_method,

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
K._onceBefore = function(real_method_name, init_method_name, belong){
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
};

/**
 @usage
	 <code>
		funcion myMethod(string){....}
		var memoizedMyMethod = KM._memoize(myMethod);
	 </code>
 */
K._memoize = memoizeMethod; // overload_for_instance_method( memoizeMethod )


})(KM);


/**
 change log:
 
 2011-09-17  Kael:
 - add receiver to KM.clone to clone the list of methods into a specified object
 - fix a bug about KM.clone that unexpectedly convert Array to Object
 - to implement KM.clone use for-in instead of KM.each, so that we can unlink the prototype chain
 
 2011-09-10  Kael:
 - add KM.clone to clone an object instead of Object.clone
 	fix the bug that mootools will exceed maximum call stack size when cloning a recursive object
 	
 TODO:
 A. test memleak about cached parameter in function clone on ie

 2011-09-04  Kael:
 TODO:
 A. improve stability for KM.makeArray

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