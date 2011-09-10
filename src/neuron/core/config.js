/**
 * @module  config
 * global configurations:
 * - loader config
 		- cdn
 		- santitizer
 		- module base
 		- warning config
 * - evironment config
 		- debug mode
 		X - global dom parser
 */
 



;(function(K){

var REGEX_PATH_CLEANER_MIN = /\.min/i,
	REGEX_PATH_CLEANER_VERSION = /\.v(?:\d+\.)*\d+/i;


function CDNHasher(evidence){
	function hashToNumber(s){
		return (s || '').length % 3 + 1;
	};
	
	return 'http://i' + hashToNumber(evidence) + '.dpfile.com';
};


function santitizer(identifier){
	return identifier.replace(REGEX_PATH_CLEANER_MIN, '').replace(REGEX_PATH_CLEANER_VERSION, '')
};


K._loaderConfig(K.mix({
	// root path of module files
	base: 		'/lib/',
	
	enableCDN:	false,
	// @return: the domain of either cdn server
	CDNHasher:	CDNHasher,
	
	santitizer: santitizer,
	
	allowUndefinedMod: 	true
}, window.__loaderConfig));


// you can set current href as http://abc.com/#!/debug/on to switch debug-mode on
var href = K.getLocation().href,
	index_marker = href.indexOf('#!/');
	
index_marker !== -1 && href.indexOf('debug/on') > index_marker && K._debugOn();


})(KM);

var DP = KM;