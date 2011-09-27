/*! 
 * @preserve
 * Neuron Framwork & Library * author i@kael.me 
 */

"use strict";

 
/**
 * corek
 * seed.js -> lang/ -> ua/ -> loader/ -> class/ -> selector/ -> core/ -> dom/
 */

/**
 * module seed
 */

/**
 * @param {undefined=} undef
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
 
 * NEVER use KM._type to test for a certain type in your javascript for business, 
 * since the returned string may be subject to change in a future version 
 
 * ALWAYS use KM.isXXX instead, because:
  	- typeof is unreliable and imprecise
  	- the best method to detect whether the passed object matches a specified type is ever changing
  	
   in the future, KM.isXXX method may support Object.is(obj, type) of ECMA6		
 * ------------------------------------------------------------------------------------ */
K._type = function(){
	
	function _type(obj){
		
		/** 
		 * if include in type_map, return the type
		 * for undefined/null, use obj === undefined / obj === null instead
		 * for host objects, always return 'object'
		 */
		return type_map[ toString.call(obj) ] || obj && 'object';
	};

	var toString = Object.prototype.toString,
		_K = K,
		type_list = 'Boolean Number String Function Array Date RegExp Object'.split(' '),
		i = type_list.length,
		
		type_map = {},
		name,
		name_lower;
		

	while( i -- ){
		name = type_list[i];
		name_lower = name.toLowerCase();
		
		type_map[ '[object ' + name + ']' ] = name_lower;
		
		_K['is' + name] = function(nl){
			return function(o){
				return _type(o) === nl;
			}
		}(name_lower);
	}
	
	/**
	 * whether an object is created by '{}', new Object, or new myClass()
	 * to put the first priority on performance, just make a simple method to detect plainObject.
	 * so it's imprecise in many aspects, which will fail with:
	 * 	- DOMElement
	 *	- location
	 * 	- window
	 *	- other obtrusive changes of global objects which is forbidden
	 */
	_K.isPlainObject = function(obj){
		return obj && _K.isObject(obj) && 'isPrototypeOf' in obj;
	};
	
	/**
	 * never use isNaN function, use KM.isNaN instead.  NaN === NaN // false
	 * @return {boolean} 
	 	true, if Number(obj) is NaN
	 	
	 * ref:
	 * http://es5.github.com/#x15.1.2.4
	 * https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/isNaN
	 */
	// _K.isNaN = function(obj){
	//	return obj == null || !/\d/.test( obj ) || isNaN( obj );
	// };

	return _type;
}();


/**
 * build time will be replaced when packaging and compressing
 */
K.build = '%buildtime%';

K._Cfg = {};

})( 
	typeof exports !== 'undefined' ? 
		  exports  // NodeJS
		: this,    // other environment, usually on browsers
		
	'KM'
);



/**
 
 milestone 2.0 ------------------------------------
 
 2011-09-04  Kael:
 - add global support for CommonJS(NodeJS)
 
 Global TODO:
 A. make Slick Selector Engine slim
 B. remove setAttribute opponent from Slick
 C. move inline script for header searching back after the header
 
 2011-09-02  Kael:
 - rename core.js as seed.js
 - remove everything unnecessary out of seed.js
 - seed.js will only manage the KM namespace and provide support for type detection
 
 milestone 1.0 ------------------------------------

 2010-08-27  Kael:
 - add global configuration: KM.__PARSER as DOM selector and parser

 2010-08-16  Kael:
 TODO:
 √ GLOBAL: remove all native implements of non-ECMAScript5 standards


 2011-03-19  Kael: move KM.type to lang.js
 2011-03-01  Kael Zhang: add adapter for typeOf of mootools
 2010-12-13  Kael Zhang: fix the getter of KM.data
 2010-10-09  Kael Zhang: 创建文件
 
 */