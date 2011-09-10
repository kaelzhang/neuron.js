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

	// @const
	WIN = K.__HOST,
	DOC = WIN.document,
	EMPTY = '',
    
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
K.data = function(name, value){
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
};

/**
 * @param {string} href
 * @return {Object}
 *	- if href undefined, returns the current location
 *	- if href is a string, returns the parsed loaction
 */
K.getLocation = function(href){
	return href ?
		parseLocation(href)
	:	getCurrentLocation();
};


})(KM);

/**
 TODO:
 - add more user-agent datas.
 - add constructor for DP.data 

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