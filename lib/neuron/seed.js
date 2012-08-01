/**
 * @preserve Neuron JavaScript Framework & Library
 *   author i@kael.me
 *   include:
 */

// "use strict";
 
/**
 * corek
 * seed.js -> lang/ -> ua/ -> loader/ -> oop/ -> selector/ -> dom/ -> biz/
 */

/**
 * module seed
 */

/**
 * @param {undefined=} undef
 *
 * REMEMBER: NEVER use undefined, because writing 'undefined = true;' will bring mass catastrophe
 */ 
;(function(host, K, undef){

// exactly, K must be an object, or override it
K = host[K] = host && host[K] || {};


/**
 * host of global runtime environment
 
 * @type {Object}
 	exports, if NodeJS
	DOMWindow, if browsers 	
 */
K.__HOST = host = K.__HOST || host;


/**
 * isXXX method - basic javascript type detecting
 
 * NEVER use NR._type to test for a certain type in your javascript for business, 
 * since the returned string may be subject to change in a future version 
 
 * ALWAYS use NR.isXXX instead, because:
  	- typeof is unreliable and imprecise
  	- the best method to detect whether the passed object matches a specified type is ever changing
  	
   in the future, NR.isXXX method may support Object.is(obj, type) of ECMAScript6		
 * ------------------------------------------------------------------------------------ */
K._type = function(){
	
	/**
	 * @param {all} obj
	 * @param {boolean=} strict, 
	 	if true, method _type will only return a certain type from the type_list
	 
	 * NEVER use K._type(undefined)
	 * for undefined/null, use obj === undefined / obj === null instead
	 
	 * for host objects, always return 'object'
	 */
	function _type(obj, strict){
		return type_map[ toString.call(obj) ] || !strict && obj && 'object' || undef;
	};

	var toString = Object.prototype.toString,
		_K = K,
		
		// basic javascript types
		// never include any host types or new types of javascript variables for compatibility
		type_list = 'Boolean Number String Function Array Date RegExp Object'.split(' '),
		i = type_list.length,
		
		type_map = {},
		name,
		name_lower, 
		isObject;
		
	while( i -- ){
		name = type_list[i];
		name_lower = name.toLowerCase();
		
		type_map[ '[object ' + name + ']' ] = name_lower;
		
		_K['is' + name] = name === 'Object' ?
		
			// Object.prototype.toString in IE:
			// undefined 	-> [object Object]
			// null 		-> [object Object]
			isObject = function(nl){
				return function(o){
					return !!o && _type(o) === nl;
				}
			}(name_lower)
		:
			function(nl){
				return function(o){
					return _type(o) === nl;
				}
			}(name_lower);
	}
	
	
	/**
	 * whether an object is created by '{}', new Object(), or new myClass() [1]
	 * to put the first priority on performance, just make a simple method to detect plainObject.
	 * so it's imprecise in many aspects, which might fail with:
	 *	- location
	 *	- other obtrusive changes of global objects which is forbidden
	 */
	_K.isPlainObject = function(obj){
	
		// undefined 	-> false
		// null			-> false
		return !!obj && toString.call(obj) === '[object Object]' && 'isPrototypeOf' in obj;
	};
	
	
	/**
	 * simple method to detect DOMWindow in a clean world that has not been destroyed
	 */
	_K.isWindow = function(obj){
	
		// toString.call(window):
		// [object Object]	-> IE
		// [object global]	-> Chrome
		// [object Window]	-> Firefox
		
		// isObject(window)	-> 'object'
		return isObject(obj) && 'setInterval' in obj; 
	};
	
	
	/**
	 * never use isNaN function, use NR.isNaN instead.  NaN === NaN // false
	 * @return {boolean} 
	 	true, if Number(obj) is NaN
	 	
	 * ref:
	 * http://es5.github.com/#x15.1.2.4
	 * https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/isNaN
	 */
	// TODO
	// _K.isNaN = function(obj){
	//	return obj == null || !/\d/.test( obj ) || isNaN( obj );
	// };

	return _type;
}();


/**
 * build time will be replaced when packaging and compressing
 */
K.build = '%buildtime%';


/**
 * atom to identify the Neuron Object
 * @temp
 * @const
 */
K._ = {};

K._env = {};

K.log = function(){};


// switch debug-mode on, and load 'log' module
K._debugOn = function(){
    // K.provide('log', function(K){ K.log('debug module attached') });
    K._env.debug = true;
};


})( 
	typeof exports !== 'undefined' ? 
		  exports  // NodeJS
		: this,    // other environment, usually on browsers
		
	'NR'
);


/**
 
 --------------------------------------------------
 [1] NR.isPlainObject will accept instances created by new myClass, but some libs don't, such as jQuery of whose strategy is dangerous, I thought.
 for example:
 suppose somebody, a newbie, wrote something like this:
 <code>
 	Object.prototype.destroyTheWorld = true;
 	NR.isPlainObject({}); // true
 </code>
 
 if use jQuery: (at least up to 1.6.4)
 <code>
 	jQuery.isPlainObject({}); // false
 </code>
 
 
 milestone 2.0 ------------------------------------
 
 2011-10-11  Kael:
 - add NR.isWindow method
 - add an atom to identify the Neuron Object
 
 2011-10-04  Kael:
 - fix a but that NR.isObject(undefined/null) -> true in IE
 
 2011-09-04  Kael:
 - add global support for CommonJS(NodeJS)
 
 Global TODO:
 A. make Slick Selector Engine slim
 B. remove setAttribute opponent from Slick
 C. [business] move inline script for header searching after the HTML structure of header
 
 2011-09-02  Kael:
 - rename core.js as seed.js
 - remove everything unnecessary out of seed.js
 - seed.js will only manage the NR namespace and provide support for type detection
 
 milestone 1.0 ------------------------------------

 2010-08-27  Kael:
 - add global configuration: NR.__PARSER as DOM selector and parser

 2010-08-16  Kael:
 TODO:
 √ GLOBAL: remove all native implements of non-ECMAScript5 standards


 2011-03-19  Kael: move NR.type to lang.js
 2011-03-01  Kael Zhang: add adapter for typeOf of mootools
 2010-12-13  Kael Zhang: fix the getter of NR.data
 2010-10-09  Kael Zhang: create file
 
 */