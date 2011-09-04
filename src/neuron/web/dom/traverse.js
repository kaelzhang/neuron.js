/**
 * module  DOM/traverse
 */
 
;(function(K){

// __SELECTOR makes sure that element is a DOMElement/DOMDocument
function getDocument(element){
	return 'setInterval' in element ? 
		  element.document 
		: 'getElementById' in element ? 
			  element 
			: element;
};


// TEMP!
function createSelectorObject(expression, combinator){
	if (!expression) return combinator;

	expression = Slick.parse(expression);

	var expressions = expression.expressions;
	for (var i = expressions.length; i--;)
		expressions[i][0].combinator = combinator;

	return expression;
};


var DOM = K.DOM,

SELECTOR = K.__SELECTOR,

TRAVERSING_CONFIG = {

	/**
	 * @type {string} op selector operator
	 * @type {boolean=} first whether only get the first
	 */
	prev: {
		op: '!~',
		first: true
	},
	
	prevAll: {
		op: '!~'
	},
	
	next: {
		op: '~',
		first: true
	},
	
	nextAll: {
		op: '~'
	},
	
	// different with .all, return the direct offsprings
	children: {
		op: '>'	
	},
	
	parent: {
		op: '!',
		first: true
	},
	
	parents: {
		op: '!'
	}
},

ACCESSOR = 'accessor';

K.each(TRAVERSING_CONFIG, function(cfg, key){
	this[key] = function(selector){
		return new DOM(
			SELECTOR.find(
				createSelectorObject(selector, cfg.op), 
				
				// these accessors only traverse the first element of current matches
				this.context.slice(0, 1), 
				cfg.first
			) 
		);
	}
});


/**
 * the traversing methods below will create a completely new Object
 * suppose this situation:
 
 <code>
 var container = $.one('#container'),
 	 parent = container.parent();
 
 // container and parent must be different
 
 </code>
 
 */
DOM.extend(TRAVERSING_CONFIG, ACCESSOR).extend({

	// @return {Object} the new DOM instance with the first element of the current matches
	first: function(){
		return new DOM( this.context.slice(0, 1) );
	},
	
	// @return {Object} the new DOM instance with the last element of the current matches
	last: function(){
		return new DOM( this.context.slice(-1) );
	}
	
}, ACCESSOR);


})(KM);