;(function(K){

var DOM = K.DOM,
	DOC = document,

	feature = DOM.feature,
	
	generateFragment = feature.fragment;


DOM.create = function(fragment, attributes){
	if (attributes && attributes.checked != null){
		attributes.defaultChecked = attributes.checked;
	}
	
	fragment = generateFragment(fragment);
	
	return new DOM(DOC.createElement(fragment)).attr(attributes);
};


})(KM);