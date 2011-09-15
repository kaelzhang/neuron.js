/**
 * module  oop/class
 * author  Kael Zhang
 
 * unlike mootools, new KM.Class will return a pure javascript constructor
 */


;(function(K){


/**
 Implements: 
 	- classes implemented, constructor and destructor will not be inherited
 	- destructor methods will be ignored
 	- implementing A will not make A instantiated
 
 Extends: 
	X - destructor methods will be collected
	- 

var Class = KM.Class,

	myClass = Class( baseClass, {
		Extends: [ Interface1, Interface2, 'options' ],
		// Extends: 'options events',
		
		initialize: function(){},
		
		__destruct: function(){},
		
		method: function(){}
	}),

	instance = new myClass();


Class.destroy(instance);
*/


function getPrototype(obj){
	var ret, type = K._type(obj);
	
	if(type === 'function'){
		ret = obj.prototype;
	}else if(type === 'object'){
		ret = obj;
	}else if(type === 'string'){
		ret = getPrototype(INTERFACES[obj.toLowerCase()]);
	}
	
	return ret;
};


function implementOne(host, alien){
	var proto = getPrototype(alien);

	proto && K.mix(
		host, 
		K.clone(proto, function(value, key){
			return PRIVATE_MEMBERS.indexOf(key) === -1;
		}),
		
		// methods of an interface have lower priorities
		false
	);
};


// implements a class with interfaces
function implements(host, extensions){
	if(typeof extensions === 'string'){
		extensions = extensions.trim().split(/,\s*/);
	}

	K.makeArray(extensions).forEach(function(alien){
		implementOne(this, alien);
	}, host.prototype);
};


function isPublicMember(key){
	return PRIVATE_MEMBERS.indexOf(key) === -1;
};


function createGetterSetter(host, attrs){

	host.get = function(name){
		var attr = attrs[name]
	}
};


var INITIALIZE = 'initialize',
	__DESTRUCT = '__construct',
	PRIVATE_MEMBERS = [INITIALIZE, __DESTRUCT],
	IMPLEMENETS = {};


function Class(base, proto){
	function newClass(){
		var self = this;
		
		// clean and unlink the instance off its prototype
		K.clone(self, isPublicMember, self);
	
		if(initialize){
			return initialize.call(this);
		}
	};
	
	var initialize,
		exts,
		newProto = newClass.prototype;
	
	if(!proto){					// -> Class(proto)
		proto = base;
		base = proto['Extends'];
	}
	
	if(K.isFunction(proto)){	// -> Class(function)
		initialize = proto;
		
	}else{						// -> Class(base, proto)
		initialize = proto[INITIALIZE];
		delete proto[INITIALIZE];
	}

	K.mix(newProto, proto);
	
		// no override
	(exts = proto['Implements']) && implements(self, exts);
	
	if(base){
		newProto.superClass = base;
		
	}	
		
	newProto.constructor = Class;
	
	return newClass;
};


/**
 * @public members
 * ----------------------------------------------------------------------- */


// @deprecated
// use KM.Class instead
// for backwards compact
this.Class =

// KM.Class
K.Class = Class;

Class.IMPLEMENETS = IMPLEMENETS;
Class.PRIVATE_MEMBERS = PRIVATE_MEMBERS;

/**
 * method to destroy a instance
 */
Class.destroy = function(instance){
	var destructor = instance[__DESTRUCT];
	destructor && destructor();
};

Class.implements = implements;
Class.hide = function(){
	
}


})(KM);


/**
 change log:
 
 2011-09-13  Kael:
 - refractor the whole implementation about Class
 
 2011-09-12  Kael:
 TODO:
 - A. add destructor support
 - B. make Class faster if there's no Extends
 - C. no merge, use KM.clone instead
 
 */