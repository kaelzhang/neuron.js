/**
 * module  DOM/core
 * author  Kael Zhang
 */
;(function(K, WIN, NULL){


// create element
function DOM(element, attributes){
	var self = this;

	if(self === WIN){
		return new DOM(DOM.create(element, attributes));
		
	}else{
		self.context = K.makeArray(selector).filter(function(el){
			return el && el.nodeType;
		});
	}
};


/**
 * @param {string} name
 * @param {function()} method
 * @param {string|boolean.<false>} type
	- 'mutator'	:   the method modify the current context({Object} this.context, as the same as below), 
					and return the modified DOM instance(the old one) itself
					
	- 'iterator':	the method replace the current context with a new one, 
					and return the modified DOM instance(the old one) itself
					
	- 'getter'	:	the method will generate something based on the current context,
					and return the value
					
	- false 	:   (not recommended) simply implement the method into the prototype of DOM,
					and the returned value based on the method
 */

// extends is one of the javascript reserved words
function extend(name, method, type){
	var generator = IMPLEMENT_GENERATOR[type] || IMPLEMENT_GENERATOR.def,
		host = DOM.prototype;

	if(K.isPlainObject(name)){
		for(var n in name){
			generator(host, n, name[n]);
		}
	}else{
		generator(host, name, method);
	}
};


// save the current $ in window, for the future we need to return it back
var _$ = WIN.$,
	
SELECTOR = K.__SELECTOR,
	
DOC = WIN.document,

IMPLEMENT_GENERATOR = {
	mutator: function(host, name, method){
		host[name] = function(){
			var self = this;
			method.apply(self, arguments);
			
			return self;
		}
	},
	
	iterator: function(host, name, method){
		host[name] = function(){
			var self = this;
			self.context = method.apply(self, arguments);
			return self;
		}
	},
	
	getter: function(host, name, method){
		host[name] = function(){
			return method.apply(this, arguments);
		}
	},
	
	def: function(host, name, method){
		host[name] = method;
	}
};



DOM.one = function(selector){
	return new DOM( SELECTOR.find(selector, NULL, true) );
};

DOM.all = function(selector){
	return new DOM( SELECTOR.find(selector) );
};

DOM.create = function(fragment, attributes){
	var element;
	
	if(typeof fragment === 'string'){
		element = DOC.createElement(selector);
		
		attributes = attributes || {};
		
		K.mix(element, attributes);
	}
	
	return element;
};


DOM.extend = extend;


extend({
	one: function(selector){
		return SELECTOR.find(selector, this.context, true);
	},
	
	all: function(selector){
		return SELECTOR.find(selector, this.context);
	}
	
}, 'iterator');


WIN.$ = DOM;


/*
K.define.on();

K.define('DOM', function(){
	return DOM;
});

K.define.off();
*/

})(KM, window, null);