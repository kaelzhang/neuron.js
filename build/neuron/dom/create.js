;(function(K){

var DOM = K.DOM,
	DOC = document,

	feature = DOM.feature,
	
	generateFragment = feature.fragment;


DOM.create = function(fragment, attributes){
	if (attributes){
		if(attributes.checked != null){
			attributes.defaultChecked = attributes.checked;
		}
	}else{
		attributes = {};
	}
	
	fragment = generateFragment(fragment, attributes);
	
	return new DOM(DOC.createElement(fragment)).attr(attributes);
};


})(KM);