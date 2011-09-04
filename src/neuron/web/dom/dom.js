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
	
	return DOM;
};


// save the current $ in window, for the future we need to return it back
var _$ = WIN.$,
	
SELECTOR = K.__SELECTOR,
	
DOC = WIN.document,

/**
 'mutator'	:   the method modify the current context({Object} this.context, as the same as below), 
				and return the modified DOM instance(the old one) itself
					
 'iterator'	:	the method iterate the current context, may modify the context, maybe not 
				and return the modified DOM instance(the old one) itself
					
 'accessor'	:	the method will not modify the context, and generate something based on the current context,
				and return the new value
					
 'def' 		:   (not recommended) simply implement the method into the prototype of DOM,
				and the returned value based on the method
 */
IMPLEMENT_GENERATOR = {
	mutator: function(host, name, method){
		host[name] = function(){
			var self = this;
			method.apply(self, arguments);
			
			return self;
		}
	},
	
	// todo
	iterator: function(host, name, method){
		host[name] = function(){
			var self = this,
				context = self.context, 
				i = 0, len = context.length;
				
			for(; i < len; i ++){
				method.apply(context[i], arguments);
			}
			
			return self;
		}
	},
	
	accessor: function(host, name, method){
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


// temporary method for dom creation
// will be override in module DOM/create
DOM.create = function(fragment, attributes){
	var element;
	
	if(typeof fragment === 'string'){
		element = DOC.createElement(selector);
		
		// attributes = attributes || {};
		
		// K.mix(element, attributes);
	}
	
	return element;
};


DOM.extend = extend;


extend({
	one: function(selector){
		return new DOM( SELECTOR.find(selector, this.context, true) );
	},
	
	all: function(selector){
		return new DOM( SELECTOR.find(selector, this.context) ); 
	},
	
	el: function(index){
		var context = this.context;
	
		return K.isNumber(index) ? context[index] : context;
	},
	
	isEmpty: function(){
		return !!this.context.length;
	}
	
}, 'accessor');


WIN.$ = K.DOM = DOM;


/*
K.define.on();

K.define('DOM', function(){
	return DOM;
});

K.define.off();
*/

})(KM, window, null);