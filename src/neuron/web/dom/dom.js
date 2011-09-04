;(function(K, WIN, NULL){

// save the current $ in window, for the future we need to return it back
var _$ = WIN.$,
	_$$ = WIN.$$,
	
	SELECTOR = K.__SELECTOR,
	
	DOC = WIN.document;
	
// create element
function DOM(selector, attributes){
	var self = this;

	if(self === WIN){
		var element;
	
		if(typeof selector === 'string'){
			element = DOC.createElement(selector);
			
			attributes = attributes || {};
			
			K.mix(element, attributes);
		}
		
		return new DOM(element || selector);
		
	}else{
		self.context = K.makeArray(selector).filter(function(el){
			return el && el.nodeType;
		});
	}
};

DOM.one = function(selector){
	return new DOM( SELECTOR.find(selector, NULL, true) );
};

DOM.all = function(selector){
	return new DOM( SELECTOR.find(selector) );
};

// mutator 
// accessor 
// iterator
DOM.extend = function(){
};


DOM.prototype = {
	one: function(selector){
		var self = this;
		
		self.context = SELECTOR.find(selector, self.context, true);
		
		return self;
	},
	
	all: function(selector){
		var self = this;
		
		self.context = SELECTOR.find(selector, self.context);
		
		return self;
	}
}


WIN.$ = DOM;


/*
K.define.on();

K.define('DOM', function(){
	return DOM;
});

K.define.off();
*/

})(KM, window, null);