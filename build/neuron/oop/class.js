/**
 * module  oop/class
 * author  Kael Zhang
 
 * unlike mootools
	- new KM.Class will return a pure javascript constructor
	- new KM.Class could inherit from a pure javascript constructor
 */


;(function(K){

/**
 relevant javascript reserved words:

 extends
 implements

 */


/**
 Implements: 
 	- classes implemented, constructor and destructor will not be inherited
 	- destructor methods will be ignored
 	- implementing A will not make A instantiated
 
 Extends: 
	X - destructor methods will be collected

var Class = KM.Class,

	myClass = Class( baseClass, {
		Implements: [ Interface1, Interface2, 'options' ],
		// Implements: 'options events',
		
		initialize: function(){},
		
		__destruct: function(){},
		
		method: function(){}
	}),

	instance = new myClass();


Class.destroy(instance);
*/


/**
 * @return {Object}
 */
function getPrototype(obj){
	var ret, type = K._type(obj);
	
	if(type === 'function'){
		ret = obj.prototype;
	}else if(type === 'object'){
		ret = obj;
	}else if(type === 'string'){
		ret = getPrototype(EXTS[obj.toLowerCase()]);
	}
	
	return ret;
};


/**
 * @param {function()|Object} KM.Class instance or prototype of KM.Class instance
 * @param {Object} alien new prototype methods to be mixed in
 * @param {boolean} override whether new methods/props should override old methods/props
 */
function implementOne(host, alien, override){
	// prototype Object for mixin 
	var proto = getPrototype(alien);

	proto && K.mix(
		host, 
		K.clone(proto),
		// K.clone(proto, function(value, key){
		//	return PRIVATE_MEMBERS.indexOf(key) === -1;
		// }),
		
		// methods of an interface have second lowest priority
		override
	);
};


/**
 * implement a class with interfaces
 */
function implement(proto, extensions, override){
	if(typeof extensions === 'string'){
		extensions = extensions.trim().split(/\s+/);
	}

	K.makeArray(extensions).forEach(function(alien){
		implementOne(this, alien, override);
	}, proto);
};


function isPublicMember(key){
	return PRIVATE_MEMBERS.indexOf(key) === -1;
};


/**
 * method to set new attributes and inherit from super class simultaniously
 */
function setAttrs(class_, attr){
	var attrs = [], parent_attr, cls = class_;

	while(cls = cls.prototype[__SUPER_CLASS]){
		if(parent_attr = cls.ATTRS){
			break;
		}
	}
	
	class_.ATTRS = K.mix(attr || {}, K.clone(parent_attr));
};


/**
 * unlink the reference to the prototype and maintain prototype chain
 */
function resetPrototypeChain(instance){
	var value, key, type, reset;
	
	for(key in instance){
		value = instance[key];
		
		if(K.isPlainObject(value)){
			var F = function(){};
			F.prototype = value;
			reset = resetPrototypeChain(new F);
		}else{
			reset = K.clone(value);
		}
		
		instance[key] = reset;
	}
	
	return instance;
};


var INITIALIZE 		= 'initialize',
	// __DESTRUCT 		= '__destruct',
	__SUPER_CLASS 	= 'superclass',
	EXTS			= {};


// @public
function Class(base, proto){
	var EXTENDS = 'Extends';

	if(!K.isObject(proto)){
		if(K.isObject(base)){				// -> Class({ key: 123 })
			proto = base;
			base = proto[EXTENDS];
			
		}else{								// -> Class(myClass)
			return K.isFunction(base) ? base : function(){};
		}
	}	
	
	delete proto[EXTENDS];
	
	return _Class(base, proto);
};


/**
 * @private
 * @param {function()|Class}
 * @param {Object} proto must be an object
 */
function _Class(base, proto){
	function newClass(){
		var self = this,
			init = initialize;
		
		/**
		 * clean and unlink the reference relationship of the first depth between the instance and its prototype
		 * and maintain prototype chain
		 */
		resetPrototypeChain(self);
	
		if(init){
			return init.apply(self, arguments);
		}
	};
	
	var IMPLEMENTS = 'Implements',
		F,
		newProto,
		
		// so, KM.Class could make a new class inherit from a pure javascript constructor
		// inherit constructor from superclass
		initialize = proto[INITIALIZE] || base,
		exts = proto[IMPLEMENTS];
		
	delete proto[INITIALIZE];
	delete proto[IMPLEMENTS];
	
	// apply super prototypes
	if(base){
		F = function(){};
		
		// discard the parent constructor
		F.prototype = base.prototype;
		newProto = new F;
		
		// priority high to low
		// user prototype > ext > super class prototype
		exts && implement(newProto, exts, true);
		
		newProto[__SUPER_CLASS] = base;
		K.mix(newProto, proto);
		
	}else{
	
		// no super class, directly assign user prototype for performance
		newProto = proto;
		exts && implement(newProto, exts, false);
	}
	
	newClass.prototype = newProto;
	
	// fix constructor
	newProto.constructor = newClass;
	
	return newClass;
};


/**
 * @public members
 * ----------------------------------------------------------------------- */


// @deprecated
// use KM.Class instead
// for backwards compact
// K.__HOST.Class =

// KM.Class
K.Class = Class;

Class.EXTS = EXTS;
// Class.PRIVATE_MEMBERS = PRIVATE_MEMBERS;

/**
 * method to destroy a instance
 */
// Class.destroy = function(instance){
//	var destructor = instance[__DESTRUCT];
//	destructor && destructor.call(instance);
// };

Class.setAttrs = setAttrs;
Class.implement = implement;

})(KM);


/**
 change log:
 
 2012-01-30  Kael:
 - remove Class.destroy
 
 2011-11-16  Kael:
 - remove Class from the host(window)
 
 2011-10-19  Kael:
 - adjust the priority of inheritance chain as: user prototype > ext > super class prototype
 
 2011-09-19  Kael:
 - fix a bug the instance fail to clear the reference off its prototype
 
 2011-09-16  Kael:
 - remove a reserved word for possible future use
 - complete class extends
 
 2011-09-13  Kael:
 - refractor the whole implementation about Class
 
 2011-09-12  Kael:
 TODO:
 - A. add destructor support
 - B. make Class faster if there's no Extends
 - C. no merge, use KM.clone instead
 
 */