/**
 @adapter DOM Selector, providing basic functionalities of Selector Engine
 
 allowed methods: (currently)
 
 1. __SELECTOR.find(selector, context = document, first)
 finds a set of matching elements, always return an array
 
 return {Array.<DOMElement>}
 
 2. __SELECTOR.contains(context, selector)
 return {boolean}
 
 3. __SELECTOR.match(element, selector)
 return {boolean}
 
 4. __SELECTOR.uid(element)
 return {number} the uid of the element
 
 
 arguments:
	 context {DOMElement|DOMDocument|Array.<DOMElement>}
	 first {boolean} only get the first match of the selector
	 selector {string}
	 element {DOMElement|DOMDocument}
	 
 within the Neuron Framework, using methods of KM.__SELECTOR besides the above is forbidden
 
 */
 
// adapter for Slick
KM.__SELECTOR = {
	find		: function(selector, context, first){
		context = context || document;
	
		return first ? Slick.find(context, selector) : Slick.search(context, selector);
	},
	contains	: Slick.contains,
	match		: Slick.match
};


/**

// adapter for Sizzle







*/