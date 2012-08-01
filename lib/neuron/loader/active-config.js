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


function CDNHasher(evidence, isLibMod){
    var s = isLibMod ? server : appServer;

	return 'http://' + K.sub(s, {n: evidence.length % 3 + 1});
};


function santitizer(identifier){
	return identifier.replace(REGEX_PATH_CLEANER_MIN, '').replace(REGEX_PATH_CLEANER_VERSION, '');
};


function getConfig(key, config){
    var ret = config[key];
    delete config[key];
    
    return ret;
};

function loaderError(message){
	throw {
		message:	message,
		toString:	function(){
			return 'NR Loader: ' + message;
		}
	};
};


var

REGEX_PATH_CLEANER_MIN      = /\.min/i,
REGEX_PATH_CLEANER_VERSION  = /\.v(?:\d+\.)*\d+/i,

STR_LOADER  = '__loader',
STR_PROVIDE = 'provide',

NOOP        = function(){},

Loader      = K[STR_LOADER],
provide     = K[STR_PROVIDE],

// prefix = Loader.prefix,

pendingQueue    = [],

host            = K.__HOST,

__config        = host.__loaderConfig || {},

server          = getConfig('server', __config),
appServer       = getConfig('appServer', __config) || server,

serverRoot      = /*branch-base*/'',

config          = K.mix({
	// root path of module files
	libBase: 'lib/',
	appBase: 'app/',
	
	// @return: the domain of either cdn server
	CDNHasher:	CDNHasher,
	santitizer: santitizer,
	
	warning: host.console && console.warn ?
		function(msg){
			console.warn('NR Loader: ' + msg);
		}
		: NOOP,
	
	/**
	 * custom error type
	 * @constructor
	 */
	error: loaderError
	
}, __config);


if(config.libBase === config.appBase){
    loaderError('libBase same as appBase, which is forbidden');
}


Loader.config(config);


/**
 * before module-version.js is downloaded and executed,
 * NR.provide temporarily does nothing but push the action into a pending queue
 */
K.provide = function(){
	pendingQueue.push(arguments);
};

/**
 * Loader.init will be called at the end of module-version.js
 */
Loader.init = function(){
	var _provide = provide;

	K[STR_PROVIDE] = _provide;
	
	pendingQueue.forEach(function(args){
		_provide.apply(null, args);
	});
	
	delete K[STR_LOADER];
};


})(NR);