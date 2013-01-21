/**
 * @module  web
 * methods for browsers and business requirement
 
 * - domready
 * - data storage
 * - getLocation
 * - UA
 */

;(function(K, undef){

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
    var E = nullOrEmpty, port, search;

    H = H.match(REGEX_URL);
    
    port = H[3];
    search = E(H[5]);
    
    return {
        href:         H[0],
        protocol:    H[1],
        host:        H[2] + (port ? ':' + port : EMPTY),
        hostname:    H[2],
        port:        E( port ),
        pathname:    E( H[4] ),
        
        // attension!
        search:        search === '?' ? '' : search,
        hash:        E( H[6] )
    };
};


function nullOrEmpty(str){
    return str || EMPTY;
};


var

// @const
WIN = K.__HOST,
DOC = WIN.document,
EMPTY = '',

/* 
REGEX_URL = /^
    ([\w\+\.\-]+:)        // protocol
    \/\/
    ([^\/?#:]+)            // domain
(?::
    (\d+)                // port
)?
    (/[^?#]*)?            // pathname
    (\?[^?#]*)?            // search
    (#.*)?                // hash
$/
*/

REGEX_URL = /^([\w\+\.\-]+:)\/\/([^\/?#:]+)(?::(\d+))?(\/[^?#]*)?(\?[^#]*)?(#.*)?$/;


/**
 * @param {string} href
 * @return {Object}
 *    - if href undefined, returns the current location
 *    - if href is a string, returns the parsed loaction
 */
K.getLocation = function(href){
    return href ?
        parseLocation(href)
    :    getCurrentLocation();
};


})(NR);

/**
 TODO:
 - add constructor for NR.data 
 - syntax checking for uri

 change log:
 2012-09-14  Kael:
 - fix NR.getLocation(href).search that if search query is `'?'`, location.search should be an empty string
 
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
 - add NR.getLocation method, 
     1. to fix the bug of ie6, which will cause an exception when fetching the value of window.location if document.domain is already specified
     2. which can split an specified uri into different parts
     
 2010-12-31  Kael Zhang:
 - migrate domready event out from mootools to here, and change some way 
 - migrate .data and .delay methods from core/lang to here
 
 */