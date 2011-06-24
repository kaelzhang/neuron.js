/**
 * @module  web
 * methods for browsers and business requirement
 
 * - domready
 * - data storage
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

	// @const
var WIN = K.__HOST,
	DOC = WIN.document,
	EMPTY = '',
	_Browser = Browser,
	ua = navigator.userAgent,
	REGEX_WEBKIT = /webkit[ \/]([\w.]+)/i,
	
	// @type {Object}
	stored_data = {},

    is_domready = false,
	is_domready_binded = false,
    is_loaded = false,
	
    readyList = [],
    
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
	 * @module  data
	
	 * @setter
	 * @getter
	
	 * @usage:
	 * 1. KM.data()                     returns the shadow copy of the current data stack
	 * 2. KM.data('abc')                returns the data named 'abc'
	 * 3. KM.data('abc', 123)           set the value of 'abc' as 123
	 * 4. KM.data({abc: 123, edf:456})  batch setter
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
	 * @param fn {Function} the function to be executed when dom is ready
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
	 * @param href {String}
	 * @returns
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

 @type KM.UA.<browser> {Number} major version of current browser, default to undefined
 - KM.UA.ie
 - KM.UA.firefox
 - KM.UA.opera
 - KM.UA.webkit
 
 @type KM.UA.version {String} full string version, example: 534.30 // webkit, maybe chrome 12 dev

 */
['ie', 'firefox', 'opera'].each(function(name){
	var B = _Browser;

	K.UA[name]  = B[name] ? B.version : undef;
});


(function(UA){
	var m = ua.match(REGEX_WEBKIT);
	
	if(m){
		UA.webkit = parseInt( m[1] );
		UA.fullversion = m[1];
	}else{
		UA.fullversion = String(_Browser.version);
	}
})(K.UA);



/**
 * load event
 */
WIN.addEvent('load', function(){
	is_loaded = true;
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
		eventType = doScroll ? 'onreadystatechange' : 'DOMContentLoaded';
		
	is_domready_binded = true;
	
	// Catch cases where ready() is called after the
	// browser event has already occurred.
	if(doc.readyState === COMPLETE) return domready();
	
	function ready(){
		doc.removeListener(eventType, ready).removeListener('load', ready)
		domready();
	}
	
	doc.addListener(eventType, ready);
	
	// A fallback to load
	// and make sure that domready event fires before load event registered by user
	doc.addListener('load', ready);
	
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
 * TODO:

 * change log:
 * 2011-06-12  Kael:
 * - fix a bug about the regular expression of location pattern that more than one question mark should be allowed in search query
 
 * 2011-04-26  Kael:
 * - 封装 mootools.Browser
 * - 移除 ua.chrome, ua.safari, 增加 ua.webkit
 * - 修改 ua[browser] 的值
 * 2011-04-12  Kael Zhang:
 * - 修正domready一个不触发的bug
 * - 增加获取location的方法，为了兼容IE6可能出现的bug（当设置了document.domain）
 * 2010-12-31  Kael Zhang:
 * - 迁移domready方法由mt.js到lang.js，修改部分实现。
 * - 迁移data和delay方法至此
 */