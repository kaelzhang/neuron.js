;(function(K){

var DOM = K.DOM,
	DOC = document;


DOM.create = function(fragment, attributes){
	if (attributes){
		if(attributes.checked != null){
			attributes.defaultChecked = attributes.checked;
		}
	}else{
		attributes = {};
	}
	
	fragment = DOM.feature.fragment(fragment, attributes);
	
	return fragment ? DOM(DOC.createElement(fragment)).attr(attributes) : DOM();
};


})(KM);