;(function(K){


/**
 * setter for class attributes
 * @private
 * @param {boolean} ghost inner use
 	if true, setValue will ignore all flags or validators and force to writing the new value
 	
 * @return {boolean} whether the new value has been successfully set
 */
function setValue(host, attr, value, override, ghost){
	var pass = true,
		setter,
		validator,
		v;

	// if ghost setting, ignore checking
	if(!ghost){
		if(attr[READ_ONLY]){
			pass = false;
			
		}else{
			validator = getMethod(host, attr, VALIDATOR);
			
			pass = !validator || validator.call(host, value);
		}
		
		if(pass && attr[WRITE_ONCE]){
			delete attr[WRITE_ONCE];
			attr[READ_ONLY] = TRUE;
		}
	}
	
	if(pass){
		setter = getMethod(host, attr, SETTER);
		
		if(setter){
			setter.call(host, value); 
		}else{
		
			// mix object values
			!override && isPlainObject(value) && isPlainObject(v = attr.value) ? K.mix(v, value) : (attr.value = value);
		}
	}
	
	return pass;
};


/**
 * getter for class attributes
 */
function getValue(host, attr, undef){
	var getter = getMethod(host, attr, GETTER),
		v = attr.value;
	
	return getter ?
	
		  // getter could based on the value of the current value
		  getter.call(host, v)
		: v;
};


function getMethod(host, attr, name){
	var method = attr[name];
	
	return typeof method === 'string' ? host[method] : method;
};


/**
 * @private
 */
function createGetterSetter(host, sandbox, undef){
	host.set = function(key, value, override){
		var attr = sandbox[key];
		
		return attr ? setValue(this, attr, value, override) : false;
	};
	
	host.get = function(key){
		var attr = sandbox[key];
		
		return attr ? getValue(this, attr) : undef;
	};
};

var TRUE = true,
	GETTER = 'getter',
	SETTER = 'setter',
	VALIDATOR = 'validator',
	READ_ONLY = 'readOnly',
	WRITE_ONCE = 'writeOnce',
	
	__SUPER_CLASS = '__super',
	
	isPlainObject = K.isPlainObject;


/**

 ATTRS = {
 	attr: {
 		value: 100
 	},
 	
 	attrWithSetter: {
 		setter: function(){}
 	},
 	
 	attrWithProxySetter: {
 		setter: '_setTimeout'
 	},
 	
 	attrWithValidator: {
 		value: 100,
 		validator: function(v){
 			return v <= 100;
 		}
 	}
 };

 */
	
K.Class.EXTS.attrs = {
	setAttrs: function(options, force){
		var self = this,
		
			// private members
			sandbox = K.clone(self.constructor.ATTRS);
		
		// .set and .get methods won't be available util .setOptions method excuted
		createGetterSetter(self, sandbox);
		
		K.each(options, function(v, k){
			var attr = sandbox[k];
			
			attr && setValue(this, attr, v, false, force);
		}, self);
	}
};


})(KM);


/**
 2011-09-20  Kael:
 - attr setter will return true or false to tell whether the new value has been successfully set

 2011-09-17  Kael:
 - TODO[09-15].A

 2011-09-15  Kael:
 - privatize attributes
 - create .get and .set method
 
 TODO:
 - √ A. ATTRs inheritance

 */