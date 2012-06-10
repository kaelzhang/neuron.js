/**
 * basic DOM parsing
 * module  DOM/core
 * author  Kael Zhang
 */
;(function(K){


/**
 nodeType: 
 ref: https://developer.mozilla.org/en/nodeType
 
	Node.ELEMENT_NODE == 1
		- document.documentElement
		- document.body
		- <head>
		
	Node.ATTRIBUTE_NODE == 2
	Node.TEXT_NODE == 3
	Node.CDATA_SECTION_NODE == 4
	Node.ENTITY_REFERENCE_NODE == 5
	Node.ENTITY_NODE == 6
	Node.PROCESSING_INSTRUCTION_NODE == 7
	Node.COMMENT_NODE == 8
	Node.DOCUMENT_NODE == 9
		- document
		
	Node.DOCUMENT_TYPE_NODE == 10
	Node.DOCUMENT_FRAGMENT_NODE == 11
	Node.NOTATION_NODE == 12
 */
 
 
/**
 *
 */
function isDOMSubject(el){
	var type;
	return K.isWindow(el) || el && (type = el.nodeType) && (type === 1 || type === 9);
};


function getContext(el){
	// window 		-> window
	// body 		-> body
	// [null]		-> [null]
	// $(window)	-> window
	return !el || isDOMSubject(el) ? el : el._ === atom && el.context; 
};


/**
 * @param {string|DOMElement} element
 * @param {(DOM|NodeList|DOMElement)=} context
 */
function DOM(element, context){

	// use ECMAScript strict
	var self = this;
	
	
	// re-dollar
	// $( $('body') );
	if(element instanceof DOM){
		return element;
	
	// with 'new' keyword
	// new $(document.body)
	// new 	
	}else if(self instanceof DOM){
	
		// @type {Array.<DOMElement>}
		// @private
		self.context = K.makeArray(element).filter(isDOMSubject);
		
	}else{
	
		return one(element, context);
	}
};


/**
 * @param {string} name
 * @param {function()} method
 * @param {string|boolean.<false>} type
 */

// extends is one of the javascript reserved words
function extend(name, method, type){
	var generator,
		host = DOM.prototype;

	if(K.isPlainObject(name)){
		generator = IMPLEMENT_GENERATOR[method] || IMPLEMENT_GENERATOR.def;
		
		for(var n in name){
			generator(host, n, name[n]);
		}
	}else{
		generator = IMPLEMENT_GENERATOR[type] || IMPLEMENT_GENERATOR.def;
		generator(host, name, method);
	}
	
	return DOM;
};


// save the current $ in window, for the future we need to return it back
var WIN = K.__HOST,

// store the original value of $
_$ = WIN.$,
	
SELECTOR = K.__SELECTOR,
	
DOC = WIN.document,

atom = K.__,


/**
 'mutator'	:   the method modify the current context({Object} this.context, as the same as below), 
				and return the modified DOM instance(the old one) itself
					
 'iterator'	:	the method iterate the current context, may modify the context, maybe not 
				and return the modified DOM instance(the old one) itself
					
 X 'accessor'	:	the method will not modify the context, and generate something based on the current context,
				and return the new value
				(removed!)have been merged with 'def'
					
 'def' 		:   simply implement the method into the prototype of DOM,
				and the returned value determined by the method
 */
IMPLEMENT_GENERATOR = {
	
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

	def: function(host, name, method){
		host[name] = method;
	}
},


one = DOM.one = function(selector, context){
	var el;
	
	// $(undefined) ->
	// 	- [null]
	
	// $(el) ->
	//  - window
	//  - document
	//  - DOMElement
	if(!K.isString(selector)){
		el = selector;
	
	// $('body')
	// $('body', document)
	// $('.container', document.body)
	}else{
		el = SELECTOR.find(selector, getContext(context), true);
	}
	
	return new DOM( el );
};


DOM.all = function(selector, context){
	return K.isString(selector) ?
		
		  // $.all('body', document)
		  // $.all('li', container)
		  new DOM( SELECTOR.find(selector, getContext(context)) )
		  
		  // $.all(el, document)
		  // $.all(el)
		: one(selector);
};


// identifier to mark Neuron DOM
DOM.prototype._ = atom;


extend({
	one: function(selector){
		return new DOM( SELECTOR.find(selector, this.context, true) );
	},
	
	all: function(selector){
		return new DOM( SELECTOR.find(selector, this.context.slice(0, 1)) );
	},
	
	/**
	 * @param {number=} index
	 *		if index is a number, returns the element of the specified index
	 *		if index is undefined, returns the array of all matched elements
	 */
	el: function(index){
		var context = this.context;
	
		return K.isNumber(index) ? context[index] : K.clone(context);
	},

	get: function(index){
		var el = this.context[index];
		
		return new DOM( el );
	},
	
	count: function(){
		return this.context.length;
	},
	
	/**
	 all extensive modules should not rely on the private uid property of a certain element   
	 
	id: function(index){
		var context = this.context,
			el = context[index || 0];
	
		return el ? SELECTOR.uid(el) : null;
	},
	
	 */
	
	/**
	 * iterator
	 */
	forEach: function(fn){
		this.context.forEach(fn);
		return this;
	},
	
	/**
	 * add a 
	 * @param {string|KM.DOM|DOMElement} subject the subject to be included into the current KM.DOM instance. 
	 	subject could be string of css selectors, instance of KM.DOM, or native DOMElement
	 */
	add: function(subject){
		this.context.concat(DOM(subject).context);
		return this;
	}
});


WIN.$ = K.DOM = DOM;


// traits
// @private
DOM.methods = {};


// @public
// create basic methods and hooks
DOM.__storage = {};

// method for extension
DOM.extend = extend;

// adaptor of selector engine
DOM.SELECTOR = SELECTOR;

// returns the $ object back to its original value
DOM.noConflict = function(){
	WIN.$ = _$;
	return DOM;
};


})(KM, null);


/**
 change log:
 
 2012-01-30  Kael:
 - add a new api DOM::add to include a subject or group of subjects into the current instance of KM.DOM
 
 TODO:
 X A. improve $ to accept more types of subjects -- came up by yao.zhou
 
 2011-10-20  Kael:
 - fix a bug that if we dollar a dollared object(KM.DOM Object), we will loose matched elements
 - new DOM.forEach() now will return this
 
 2011-10-13  Kael:
 - add $.noConflict() method
 
 2011-10-11  Kael:
 - define fake package here
 - improve stability for DOM and DOM.all when fetching elements
 - fix $(window), $(document), $(el, context)
 - DOM no longer create elements. please use DOM.create instead
 - DOM and DOM.all could accept an instance of DOM as the context parameter
 - add an atom to identify Neuron DOM instance
 
 2011-09-09  Kael:
 - add .forEach method
 
 TODO
 A. add method to return $ back to window


 */