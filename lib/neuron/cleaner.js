/**
 * clean unexpected public members, making them private.
 * after this, they could only be fetched by Neuron Loader
 */

// ;(function(K){

// var DOM = K.DOM;

// remove public members
// delete K.DOM;
delete NR.S;
delete NR._;
// delete DOM.methods;
// delete DOM.feature;


// remove Slick from window
// Slick is defined with 'this.Slick'
// so, it's removable and is not [DontDelete]

// IE6 - IE8 don't support delete a property of window, even if it's defined with this.MyNameSpace 
// try{
//	delete window.Slick;
// }catch(e){
	// K.log('del Slick err');
// }
delete NR.Slick;


// })(NR);

/**
 change log:
 
 2011-11-18  Kael:
 - no longer remove static methods of NR.DOM
 
 2011-09-08  Kael:
 - renaming the module name as dom, making it a fake package module
 
 */