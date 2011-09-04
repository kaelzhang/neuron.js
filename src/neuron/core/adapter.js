/**
 @adapter DOM Selector, providing basic functionalities of Selector Engine
 
 allowed methods: (currently)
 
 1. __SELECTOR.find(selector, context = document, first)
 finds a set of matching elements, always return an array
 
 return {Array.<DOMElement>} !important !!!!!!!!!!!!!!
 
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
 
;(function(K){
 
// adapter for Slick
KM.__SELECTOR = {
	find		: function(selector, context, first){
		context = K.makeArray( context || document );
		
		var ret = [],
			len = context.length,
			i = 0,
			found,
			c,
			slick = Slick;
			
		for(; i < len; i ++){
			c = context[i];
			
			if(first){
				found = slick.find(c, selector);
				
				// if found stop searching
				if(found){
					ret[0] = found;
					break;
				}
				
			}else{
				found = slick.search(c, selector);
				if(found.length){
				
					// find all matches
					ret = ret.concat(found);
				}
			}
		}
		
		// always return an array
		return ret;
	},
	
	contains	: Slick.contains,
	match		: Slick.match
};

})(KM);


/**

// adapter for Sizzle







*/