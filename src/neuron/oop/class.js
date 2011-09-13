;(function(K){

function extend(host, methods){
	for(name in methods){
		if(!host[name]){
			host[name] = methods[name];
		}
	}
};

/*
function implement(host, methods){
	extend(host.prototype, methods);
};
*/

/**
 * @private
 * reset an object
 * unlink the reference relationship 
 */
function reset(object){
	var key, value, F;

	for (key in object){
		value = object[key];
		
		switch (K._type(value)){
			case 'object':
				F = function(){};
				F.prototype = value;
				object[key] = reset(new F);
				break;
				
			case 'array':
				object[key] = K.clone(value);
				break;
		}
	}
	
	return object;
};


// @private
function parent(){
	var self = this;

	if (!this.$caller) throw new Error('The method "parent" cannot be called.');
	var name = this.$caller.$name,
		parent = this.$caller.$owner.parent,
		previous = (parent) ? parent.prototype[name] : null;
	if (!previous) throw new Error('The method "' + name + '" has no parent.');
	return previous.apply(this, arguments);
};


function getInstance(klass){
	klass.$prototyping = true;
	var proto = new klass;
	delete klass.$prototyping;
	return proto;
};


function Class(params){
	function newClass(){
		var self = this, ret;
	
		reset(self);
		ret = self.initialize ? self.initialize.call(self, arguments) : self;
		
		return ret;
	};
	
	newClass.prototype = K.mix({
			constructor: Class
			parent: parent
		}, 
		K.isFunction(params) ? {initialize: params} : params
	);
	
	return newClass;
};


// @deprecated
// use KM.Class instead
// for backwards compact
// this.Class

K.Class = this.Class = Class;


var wrap = function(self, key, method){
	if (method.$origin) method = method.$origin;
	var wrapper = function(){
		if (method.$protected && this.$caller == null) throw new Error('The method "' + key + '" cannot be called.');
		var caller = this.caller, current = this.$caller;
		this.caller = current; this.$caller = wrapper;
		var result = method.apply(this, arguments);
		this.$caller = current; this.caller = caller;
		return result;
	}.extend({$owner: self, $origin: method, $name: key});
	return wrapper;
};

var implement = function(key, value, retain){
	if (Class.Mutators.hasOwnProperty(key)){
		value = Class.Mutators[key].call(this, value);
		if (value == null) return this;
	}

	if (typeOf(value) == 'function'){
		if (value.$hidden) return this;
		this.prototype[key] = (retain) ? value : wrap(this, key, value);
	} else {
		Object.merge(this.prototype, key, value);
	}

	return this;
};

var getInstance = function(klass){
	klass.$prototyping = true;
	var proto = new klass;
	delete klass.$prototyping;
	return proto;
};

Class.implement('implement', implement.overloadSetter());

Class.Mutators = {

	Extends: function(parent){
		this.parent = parent;
		this.prototype = getInstance(parent);
	},

	Implements: function(items){
		Array.from(items).each(function(item){
			var instance = new item;
			for (var key in instance) implement.call(this, key, instance[key], true);
		}, this);
	}
};


})(KM);

/**
 change log:
 
 2011-09-12  Kael:
 TODO:
 - A. add destructor support
 - B. make Class faster if there's no Extends
 - C. no merge, clone instead1
 
 */