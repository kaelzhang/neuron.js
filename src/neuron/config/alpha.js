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
	REGEX_PATH_CLEANER_VERSION = /\.v(?:\d+\.)*\d+/i,
	
	LOADER = '__Loader',
	NOOP = function(){},
	
	Loader = K[LOADER],
	
	prefix = Loader.prefix,
	
	host = K.__HOST,
	
	__config = window.__loaderConfig;


function CDNHasher(evidence){
	function hashToNumber(s){
		return (s || '').length % 3 + 1;
	};
	
	return 'http://i' + hashToNumber(evidence) + '.dpfile.com';
};


function santitizer(identifier){
	return identifier.replace(REGEX_PATH_CLEANER_MIN, '').replace(REGEX_PATH_CLEANER_VERSION, '')
};


/**
 * @param {Object=} conf {
	 	base: 				{string} root "path" of module library
	 	allowUndefinedMod: 	{boolean}
	 	enableCDN:			{boolean}
	 	CDNHasher: 			{function}
	 }
 */
Loader.config(K.mix({
	// root path of module files
	base: 		'/src/',
	
	enableCDN:	false,
	
	// @return: the domain of either cdn server
	CDNHasher:	CDNHasher,
	
	santitizer: santitizer,
	
	warning: host.console && console.warn ?
		function(msg){
			console.warn('KM Loader: ' + msg);
		}
		: NOOP,
	
	/**
	 * custom error type
	 * @constructor
	 */
	error: function loaderError(message){
		throw {
			message:	message,
			toString:	function(){
				return 'KM Loader: ' + message;
			}
		};
	},
	
	allowUndefinedMod: 	true
	
}, __config));



/** 
 * create a new loader application
 * and also create a new namespace for modules under this application
 * will be very useful for business requirement

 <code env="inline">
 	KM.app('Checkin', {
 		base: '/q/mods/'
 	});
 	
 	KM.define('http://i1.dpfile.com/q/mods/page/index.js');
 	
 	// provide a module within a specified app
 	// use double colon to distinguish with uri ports
 	// 'Checkin' -> namespace
 	KM.provide('Checkin::page/index', function(K, index){
 		index.init();
 	});
 	
 	// provide a module of the kernel
 	KM.provide('io/ajax', function(K, Ajax){
 		new Ajax( ... )
 	});
 	
 </code>
 
 <code env="index.js">
 	// '~/' -> the home dir for the current application
 	KM.define(['~/timeline', 'dom'], function(K, require){
 		var timeline = require('~/timeline');
 	});
 </code>
 
 @param {Object} config
 	base:
 	baseRequire
 */
K.app = function(name, config){
	prefix(name, config);
};


prefix('~', {
	base: '/src/'
});



// part of the initialization
;(function(){

return;
	
/*
 debug module is not ready yet
 */
 
// you can set current href as http://abc.com/#!/debug/on to switch debug-mode on
var href = K.getLocation().href,
	index_marker = href.indexOf('#!/');
	
if(index_marker !== -1 && href.indexOf('debug/on') > index_marker){
	base_require.push('debug');
	K._debugOn();
}


})();


})(KM);

var DP = KM;