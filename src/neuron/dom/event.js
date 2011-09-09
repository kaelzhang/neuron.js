/**
 * module  DOM/event
 */

;(function(K){


function addEvent(el, type, fn){
	if(el.addEventListener){
		el.addEventListener(type, fn, false)
	}else{
		el.attachEvent('on' + type, fn);
	}
};


var DOM = K.DOM,

SELECTOR = K.__SELECTOR,

storage = DOM.__storage,

event_storage = (storage.events = {});



DOM.extend({
	on: function(type, fn){
		var el = this,
			id = SELECTOR.uid(el);
			
		addEvent(el, fn);
		
	},
	
	detach: function(type, fn){
		
	}


}, 'iterator');

})(KM);