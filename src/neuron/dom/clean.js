/**
 * clean unexpected public members
 * after this, they could only be fetched by Neuron Loader
 */

;(function(K){

var DOM = K.DOM;

// store selector on DOM for further improvement
DOM.SELECTOR = K.__SELECTOR;


// remove public members
delete K.DOM;
delete K.__SELECTOR;
delete DOM.methods;
delete DOM.feature;


K.define.on();

// fake package module
K.define('dom', function(){ return DOM; });
K.define.off();

})(KM);


/**
 change log:
 
 2011-09-08  Kael:
 - renaming the module name as dom, making it a fake package module
 
 */