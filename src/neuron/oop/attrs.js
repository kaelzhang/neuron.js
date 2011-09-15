;(function(K){


/**
 * setter for class attributes
 * @private
 * @param {boolean} ghost inner use
 	if true, setValue will ignore all flags or validators and force to writing the new value
 */
function setValue(host, attr, value, mix, ghost){
	var pass = true,
		setter,
		validator,
		v;

	// if ghost setting, ignore checking
	if(!ghost){
		if(attr[READ_ONLY]){
			pass = false;
			
		}else{
			validator = getMethod(host, attr, validator);
			
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
			mix && K.isObject(v = attr.value) ? K.mix(v, value) : (attr.value = value);
		}
	}
};


/**
 * getter for class attributes
 */
function getValue(host, attr, undef){
	var getter = getMethod(host, attr, GETTER);
	
	return getter ?
	
		  // getter could based on the value of the current value
		  getter.call(host, attr.value)
		: 'value' in attr ? attr.value : undef;
};


function getMethod(host, attr, name){
	var method = attr[name];
	
	return typeof method === 'string' ? host[method] : method;
};


/**
 * @private
 */
function createGetterSetter(host, attrs, undef){
	host.set = function(key, value, mix){
		var attr = attrs[key];
		
		attr && setValue(this, attr, value, mix);
	};
	
	host.get = function(key){
		var attr = attrs[key];
		
		return attr ? getValue(this, attr) : undef;
	};
};


var TRUE = true,
	GETTER = 'getter',
	SETTER = 'setter',
	VALIDATOR = 'validator',
	READ_ONLY = 'readOnly',
	WRITE_ONCE = 'writeOnce';


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
	
K.Class.IMPLEMENETS.attrs = {
	setAttrs: function(options){
		var self = this,
		
			// private members
			attrs = K.clone(self.constructor.ATTRS);
		
		// .set and .get methods won't be available util .setOptions method excuted
		createGetterSetter(self, attrs);
	}
};


})(KM);


/**
 2011-09-15  Kael:
 - privatize 
 - create .get and .set method


 */