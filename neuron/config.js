/**
 * @module  config
 * global configurations:
 * - loader config
 * - evironment config
 */
 



;(function(K){


function CDNHasher(evidence){
	function hashToNumber(s){
		return (s || '').length % 3 + 1;
	};
	
	return 'http://i' + hashToNumber(evidence) + '.dpfile.com';
};
	

K._loaderConfig(K.mix({
	// root path of module files
	base: 				'/lib/',
	
	enableCDN:			false,
	// @return: the domain of either cdn server
	CDNHasher:			CDNHasher,
	
	allowUndefinedMod: 	true
}, window.__loaderConfig));


// you can set current href as http://abc.com/#!/debug/on to switch debug-mode on
var href = K.getLocation().href,
	index_marker = href.indexOf('#!/');
	
index_marker !== -1 && href.indexOf('debug/on') > index_marker && K._debugOn();


})(KM);

var DP = KM;