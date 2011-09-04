/**
 * clean unexpected public members
 * after this, they could only be fetched by Neuron Loader
 */
;(function(K){

var DOM = K.DOM,
	SELECTOR = K.__SELECTOR;

// remove public members
delete K.DOM;
delete K.__SELECTOR;


DOM.SELECTOR = SELECTOR;


K.define.on();

K.define('DOM', function(){
	return DOM;
});

K.define.off();

})(KM);