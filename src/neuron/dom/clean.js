/**
 * clean unexpected public members
 * after this, they could only be fetched by Neuron Loader
 */

;(function(K){

// remove public members
delete K.DOM;
delete K.__SELECTOR;
delete K.__;
delete DOM.methods;
delete DOM.feature;

})(KM);

/**
 change log:
 
 2011-09-08  Kael:
 - renaming the module name as dom, making it a fake package module
 
 */