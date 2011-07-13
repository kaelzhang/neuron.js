/**
 * @module  web
 * methods for browsers and business requirement
 
 * - domready
 * - data storage
 * - getLocation
 * - UA
 */

;(function(K, undef){

// --- method for KM.data ----------------------- *\
function setData(data){
	data && K.mix(stored_data, data);
};

function cloneData(){
	return K.merge({}, stored_data);
};

function getData(name){
	return stored_data[name];
};
// --- /method for KM.data ----------------------- *\


/**
 * get the readable location object of current page 
 */
function getCurrentLocation(){
	var L, H;

	// IE may throw an exception when accessing
	// a field from document.location if document.domain has been set
	// ref:
	// stackoverflow.com/questions/1498788/reading-window-location-after-setting-document-domain-in-ie6
	try {
		L = DOC.location;
		H = L.href;
	} catch(e) {
	
		// Use the href attribute of an A element
		// since IE will modify it given document.location
		H = DOC.createElement('a');
		H.href = EMPTY;
		H = H.href;
		
		L = parseLocation(H);
	}
	
	return L;
};

/**
 * parse a link to location object
 * @param {string} H
 * @return {Object} custom location object
 */
function parseLocation(H){
	var E = nullOrEmpty, port;

	H = H.match(REGEX_URL);
	
	port = H[3];
	
	return {
		href: 		H[0],
		protocol:	H[1],
		host:		H[2] + (port ? ':' + port : EMPTY),
		hostname:	H[2],
		port:		E( port ),
		pathname:	E( H[4] ),
		search:		E( H[5] ),
		hash:		E( H[6] )
	};
};


function nullOrEmpty(str){
	return str || EMPTY;
};

	// @type {Object}
var stored_data = {},

    is_domready = false,
	is_domready_binded = false,
    is_loaded = false,
	
    readyList = [],

	// @const
	WIN = K.__HOST,
	DOC = WIN.document,
	EMPTY = '',
	_Browser = Browser,
	ua = navigator.userAgent,
	UA = K.UA,
	REGEX_WEBKIT = /webkit[ \/]([^\s]+)/i,
    
    /* 
    REGEX_URL = /^
    	([\w\+\.\-]+:)		// protocol
    	\/\/
    	([^\/?#:]+)			// domain
    (?::
    	(\d+)				// port
    )?
    	(/[^?#]*)?			// pathname
    	(\?[^?#]*)?			// search
    	(#.*)?				// hash
    $/
    */
    
    REGEX_URL = /^([\w\+\.\-]+:)\/\/([^\/?#:]+)(?::(\d+))?(\/[^?#]*)?(\?[^#]*)?(#.*)?$/;
    

K.mix(K, {
	
	/**
	 * module  data
	
	 * setter
	 * getter
	
	 * usage:
	 * 1. KM.data()                     returns the shadow copy of the current data stack
	 * 2. KM.data('abc')                returns the data named 'abc'
	 * 3. KM.data('abc', 123)           set the value of 'abc' as 123
	 * 4. KM.data({abc: 123, edf:456})  batch setter
	 *
	 * @param {all=} value 
	 */
	data: function(name, value){
		var type = K._type(name),
			empty_obj = {},
			is_getter, ret;
		
		if(name === undef){
			ret = cloneData(); // get: return shadow copy
			is_getter = true;
	
		}else if(type === 'string'){
			if(value === undef){
				ret = getData(name); // get: return the value of name
				is_getter = true;
			}else{
				empty_obj[name] = value;
				setData(empty_obj) // set
			}
	
		}else if(type === 'object'){
			setData(name); // set
		}
	
		return is_getter ? ret : K;
	},
	
	isDomReady: function(){
		return is_domready;
	},
	
	isLoaded: function(){
		return is_loaded;
	},
	
	/**
	 * the entire entry for domready event
	 * window.addEvent('domready', fn) has been carried here, and has no more support
	 * @param {function()} fn the function to be executed when dom is ready
	 */
	ready: function(fn){
		// delay the initialization of binding domready, making page render faster
		is_domready_binded || bind_domready();
		
		if(is_domready){
			fn.call(WIN, this);
		}else{
			readyList.push(fn);
		}
	},
	
	/**
	 * @param {string} href
	 * @return {Object}
	 *	- if href undefined, returns the current location
	 *	- if href is a string, returns the parsed loaction
	 */
	getLocation: function(href){
		return href ?
			parseLocation(href)
		:	getCurrentLocation();
	}

});


/**
 * user agent

 type {number} KM.UA.<browser> major version of current browser, default to undefined
 - KM.UA.ie
 - KM.UA.firefox
 - KM.UA.opera
 - KM.UA.chrome
 - KM.UA.webkit
 
 usage:
 <code>
 	if(KM.UA.ie < 8){...}
 
 	// always instead of using this:
 	if(Browser.ie && Browser.version < 8){...}
 </code>
 */
['ie', 'firefox', 'opera', 'chrome'].each(function(name){
	var B = _Browser;
	
	B[name] && (UA[name] = B.version);
});

K.mix(UA, _Browser.Platform, true, ['mac', 'win', 'linux', 'ios', 'android', 'webos', 'other']);
UA.platform = _Browser.Platform.name;


// UA.fullversion = String(_Browser.version);

(function(UA){
	var m = ua.match(REGEX_WEBKIT);
	
	if(m){
		UA.webkit = parseInt( m[1] );
	}
})(K.UA);



/**
 * load event
 */
WIN.addEvent('load', function(){
	is_loaded = true;
});



/**
 * fix bugs of mootools
 * ----------------------------------------------------------------------------------------------------------- */
 
// in mootools 1.3.2, on ie < 8, document.body and html must be 'dollar'ed before the using of most of the methods, esp in Element.dimension
readyList.push(function(){
	$(document.body);
	$(document.documentElement);
});



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
	var COMPLETE = 'complete', doc = DOC,
		doScroll = doc.documentElement.doScroll,
		eventType = doScroll ? 'readystatechange' : 'DOMContentLoaded';
		
	is_domready_binded = true;
	
	// Catch cases where ready() is called after the
	// browser event has already occurred.
	if(doc.readyState === COMPLETE) return domready();
	
	function _ready(){
		doc.removeListener(eventType, _ready).removeListener('load', _ready);
		domready();
	}
	
	doc.addListener(eventType, _ready);
	
	// A fallback to load
	// and make sure that domready event fires before load event registered by user
	doc.addListener('load', _ready);
	
	if(doScroll){
		var not_framed = false;
		
		try {
			not_framed = win.frameElement == null;
		} catch(e) {}
		
		if(not_framed){
			
			// use conditional function declaration, poll_scroll will not be declared in firefox, that it will save memory
			function poll_scroll(){
				try {
					// doScroll technique by Diego Perini http://javascript.nwbox.com/IEContentLoaded/
					doScroll('left');
					ready();
				} catch(ex) {
					setTimeout(poll_scroll, 10);
				}
			}
			poll_scroll();
		}
	}
}

})(KM);

/**
 TODO:
 - add more user-agent datas. 

 change log:
 2011-07-05  Kael:
 - remove UA.fullversion
 - add adapter for Browser.Platform
 
 2011-06-12  Kael:
 - fix a bug about the regular expression of location pattern that more than one question mark should be allowed in search query
 - add UA.chrome. 
 
 2011-04-26  Kael:
 - adapt mootools.Browser
 - remove ua.chrome, ua.safari, add ua.webkit
 
 2011-04-12  Kael Zhang:
 - fix a bug that domready could not be properly fired
 - add KM.getLocation method, 
 	1. to fix the bug of ie6, which will cause an exception when fetching the value of window.location if document.domain is already specified
 	2. which can split an specified uri into different parts
 	
 2010-12-31  Kael Zhang:
 - migrate domready event out from mootools to here, and change some way 
 - migrate .data and .delay methods from core/lang to here
 
 */