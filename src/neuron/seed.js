/*!
 * @license  Neuron Framwork
 * author    i@kael.me
 */
 
 
/**
 * corek
 * seed.js -> enhance/ -> loader.js -> selector/ -> core/ -> dom/
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
 * isXXX method - basic javascript method detecting
 
 * NEVER use KM._type to test for a certain type in your javascript for business, 
 * since the returned string may be subject to change in a future version 
 * use KM.isXXX instead
 * ------------------------------------------------------------------------------------ */
K._type = function(){
	
	function _type(obj){
		return type_map[ toString.call(obj) ];
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
				_type(o) === nl;
			}
		}(name_lower);
	}
	
	
	_K.isPlainObject = function(obj){
		return obj && _K.isObject(obj) && 'isPrototypeOf' in obj;
	};

	return _type;
}();


K.__HOST = K.__HOST || host;

K.build = '%buildtime%';


})(this, 'KM');



/**
 
 milestone 2.0 ------------------------------------
 
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


 * change log:
 * 2011-04-19  Kael: move KM.type to lang.js
 * 2011-04-01  Kael Zhang: add adapter for typeOf of mootools
 * 2010-12-13  Kael Zhang: fix the getter of KM.data
 * 2010-10-09  Kael Zhang: 创建文件
 */