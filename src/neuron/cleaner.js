/**
 * clean unexpected public members, making them private.
 * after this, they could only be fetched by Neuron Loader
 */

;(function(K){

var DOM = K.DOM;

// remove public members
// delete K.DOM;
delete K.__SELECTOR;
delete K.__;
// delete DOM.methods;
// delete DOM.feature;


// remove Slick from window
// Slick is defined with 'this.Slick'
// so, it's removable and is not [DontDelete]

// IE6 - IE8 don't support delete a property of window, even if it's defined with this.MyNameSpace 
try{
	delete window.Slick;
}catch(e){
	K.log('del Slick err');
}


})(KM);

/**
 change log:
 
 2011-09-08  Kael:
 - renaming the module name as dom, making it a fake package module
 
 */