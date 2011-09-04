;(function(K){


function getDocument


function getComputedStyle(element, property){
	if (element.currentStyle){
		return element.currentStyle[property.camelCase()];
	}
	
	var defaultView = Element.getDocument(this).defaultView,
		computed = defaultView ? defaultView.getComputedStyle(this, null) : null;
	return (computed) ? computed.getPropertyValue((property == floatName) ? 'float' : property.hyphenate()) : null;
};

var DOM = K.DOM;









})(KM);