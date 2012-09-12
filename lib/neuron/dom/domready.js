/**
 * module  web/domready
 * author  Kael Zhang
 */
 

// TODO!!!!!  complete event
 

;(function(K, undef){


/**
 * Custom domready event
 * @private
 * ----------------------------------------------------------------------------------------------------------- */

function domready(){

	// fire domready only once
	if(!is_domready){
		is_domready = true;
		fire_domready();
	}
}

function fire_domready(){
	var self = this,
		r = readyList, fn;
		
	if(r){	
		for(var i = 0, len = r.length; i < len; i ++){
			fn = r[i]
			fn && fn.call(WIN, K);
		}

		r.length = 0;
		readyList = null;
	}
};


function bind_domready(){
	// is_domready_binded = true;

	var doc = WIN.document;
	
	// Catch cases where ready() is called after the
	// browser event has already occurred.
	if(doc.readyState === 'complete'){
		return setTimeout(domready, 0);
	}
	
	var doScroll = doc.documentElement.doScroll,
		eventType = doScroll ? 'readystatechange' : 'DOMContentLoaded',
		_doc = DOM(doc),
		_win = DOM(WIN),
		
		// define _ready function by variable assignment,
		// so _ready will never be declared if not necessary
		_ready = function(){
			_doc.off(eventType, _ready);
			_win.off('load', _ready);
			_doc = _win = null;
			domready();
		};
	
	_doc.on(eventType, _ready);
	
	// A fallback to load, binding load event to window,
	// and make sure that domready event fires before load event registered by user
	_win.on('load', _ready);
	
	if(doScroll){
		var not_framed = false;
		
		try {
			not_framed = win.frameElement == null;
		} catch(e) {}
		
		// if not a frame
		if(not_framed){
			var poll_scroll = function(){
				try {
					// [doScroll technique](http://javascript.nwbox.com/IEContentLoaded/) 
					// by Diego Perini 
					doScroll('left');
					_ready();
					poll_scroll = null;
					
				} catch(ex) {
					setTimeout(poll_scroll, 10);
				}
			};
		}
	}
};


var is_domready = false,
	// is_domready_binded = false,
    
    DOM = K.DOM,
	
    readyList = [],

	// @const
	WIN = K.__HOST;
    

K.isDomReady = function(){
	return is_domready;
};
	
/**
 * the entire entry for domready event
 * window.addEvent('domready', fn) has been carried here, and has no more support
 * @param {function()} fn the function to be executed when dom is ready
 */
K.ready = function(fn){
	// delay the initialization of binding domready, making page render faster
	// is_domready_binded || bind_domready();
	
	if(is_domready){
		fn.call(WIN, this);
	}else{
		readyList.push(fn);
	}
};


bind_domready();


})(NR);

/**
 2012-02-20  Kael:
 - fix a bug that NR.ready could not properly fallback to window.onload event

 2011-09-04  Kael Zhang:
 - split domready alone
 - migrate event handler from mootools to Neuron
 
 2011-04-12  Kael Zhang:
 - fix a bug that domready could not be properly fired
 	
 2010-12-31  Kael Zhang:
 - migrate domready event out from mootools to here, and change some implementations
 
 */