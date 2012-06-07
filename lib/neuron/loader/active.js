/*! 
 * Neuron core:loader v5.0.1(active mode)
 * author i@kael.me 
 */
 
/**
 
 which is ifferent from loader in passive mode, 
 active loader will automatically parse dependencies and load them into the current page.
 
 */

; // fix layout of UglifyJS

/**
 * include
 * - static resource loader
 * - a commonjs module loader
 * - interface for business configuration
 
 * implements
 * - CommonJS::Modules/Wrappings						>> http://kael.me/-cmw
 * - CommonJS::Modules/Wrappings-Explicit-Dependencies	>> http://kael.me/-cmwed
 
 * Google closure compiler advanced mode strict
 */

/**
 * @param {undefined=} undef
 */
;(function(K, NULL, undef){

/**
 * stack, config or flag for modules
 */
var	

/**
 * map -> identifier: module
 */
_mods = {},			

/**
 * map -> url: status
 */
_script_map = {},

/**
 * map -> namespace: config
 */
// _apps_map = {},

/**
 * configurations:
 * 	- CDNHasher
 	- santitizer
 	- allowUndefinedMod
 */
_config = {},

_last_anonymous_mod = NULL,
_define_buffer_on = false,

// fix onload event on script node in ie6-9
use_interactive = K.UA.ie < 10,
interactive_script = NULL,

// @type {function()}
warning,
error,

Loader,
	
/**
 * @const
 */
// ex: `~myModule`
// USER_MODULE_PREFIX = '~',
APP_HOME_PREFIX = '~/',

// ex: Checkin::index
APP_NAMESPACE_SPLITTER = '::',

// REGEX_FILE_TYPE = /\.(\w+)$/i,

/**
 * abc 			-> js: abc.js		
 * abc.js 		-> js: abc.js
 * abc.css		-> css: abc.css
 * abc#			-> js: abc
 * abc?123		-> js: abc?123
 * abc?123.js	-> js: abc?123.js
 * abc?123.css	-> css: abc?123.css
 */
REGEX_NO_NEED_EXTENSION = /\.(?:js|css)$|#|\?/i,
REGEX_IS_CSS = /\.css(?:$|#|\?)/i,

/**
 * abc/def		-> abc
 */
REGEX_DIR_MATCHER = /.*(?=\/.*$)/,

// no operation
NOOP = function(){},

HOST = K.__HOST,
DOC = HOST.document,
HEAD = DOC.getElementsByTagName('head')[0],

getLocation = K.getLocation,

/**
 * module status
 * @enum {number}
 * @const
 */	
STATUS = {
	// the module's uri has been specified, 
	// DI -> DEFINING
	DI	: 1,

	// the module's source uri is downloading or executing
	// LD -> LOADING
	LD	: 2,
	
	// the module has been explicitly defined. 
	// DD -> DEFINED
	DD 	: 3,
	
	// being analynizing and requiring the module's dependencies
	// RQ -> REQUIRING
	RQ 	: 4,
	
	// the module's factory function are ready to be executed
	// the module's denpendencies are set as STATUS.RD
	// RD -> READY
	RD 	: 5 //,
	
	// the module already has exports
	// the module has been initialized, i.e. the module's factory function has been executed
	// ATTACHED  	: 6
},

asset = K.load;


/**
 * module define
 * --------------------------------------------------------------------------------------------------- */

/**
 * method to define a module
 * @public
 * @param {string} name module name
 * @param {(Array.<string>|string)=} dependencies array of module names
 * @param {(string|function()|Object)=} factory
 * 		{string} 	the uri of a (packaged) module(s)
 *  	{function} 	the factory of a module
 *  	{object} 	module exports
 */
function define(name, dependencies, factory){
	var 
	
	version, info, uri, identifier,
	arg = arguments,
	last = arg.length - 1,
	EMPTY = '',
	_def = _define;
	
	if(arg[last] === true){					// -> define(uri1, uri2, uri3, true);
		arg.forEach(function(path, i){
            var UNDEF;
		
			i < last && _def(EMPTY, UNDEF, UNDEF, absolutizeURI(path));
		});
		return;
	}

	// overload and tidy arguments 
	// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
	if(!K.isString(name)){  				// -> define(dependencies, factory);
		factory = dependencies;
		dependencies = name;
		name = undef;
	}
	
	if(!K.isArray(dependencies)){ 			// -> define(factory);
		if(dependencies){
			factory = dependencies;
		}
		dependencies = undef;
	}
		
	// split name and version
	if(name){
		if(arguments.length === 1){			// -> define(uri);
			factory = absolutizeURI(name);
			name = EMPTY;
		}
	}
	
	// TODO bug
	if(_define_buffer_on){					// -> after define.on();
		info = generateModuleURI_Identifier( moduleNameToURI(name) );
		uri = info.u;
		identifier = info.i;
		name = EMPTY;
	}
	
	_def(name, identifier, dependencies, factory, uri);
};


/**
 * method for inner use
 * @private
 * @param {string|undefined} name
 		{string}
 			=== '': in the case that only defining module uri
 			!== '': module identifier 
 		{undefined} anonymous module definition - the module has no explicit identifier
 
 * @param {string=} identifier (optional) module identifier
 * @param {(Array.<string>)=} dependencies
 * @param {(function(...[number])|Object|string)=} factory
 		{string} absolute! uri
 * @param {string=} uri module uri, the extra info. for define buffer
 */
function _define(name, identifier, dependencies, factory, uri){
	/**	
	 * @type {Object}
	 * restore mod data {
		 	version:	{String=}	version
		 	status:		{Number}	module status
		 	uri:		{String}	source uri of module
		 	isCSS:		{Boolean=}	whether is css module
		 	
		 	// either of two
		 	factory:	{function}	factory function
		 	exports:	{Object}	module exports
		 }
	 */
	var 
	
	mod = {},
	path_info,
	existed,
	active_script_uri;
	
	/**
	 * get module object 
	 */
	if(name){
		
		name.indexOf('/') !== -1 && !_define_buffer_on && warning(100, name);
	
	// anonymous module define
	// define a module in a module file
	}else if(name !== ''){
		
		// via Kris Zyp
		// Ref: http://kael.me/-iikz
		if (use_interactive) {
			
			// Kael: 
			// In IE(tested on IE6-9), the onload event may NOT be fired 
			// immediately after the script is downloaded and executed
			// - it occurs much late usually, and especially if the script is in the cache, 
			// So, the anonymous module can't be associated with its javascript file by onload event
			// But, always, onload is never fired before the script is completed executed
			
			// demo: http://kael.me/TEMP/test-script-onload.php
			
			// > In IE, if the script is not in the cache, when define() is called you 
			// > can iterate through the script tags and the currently executing one will 
			// > have a script.readyState == "interactive" 
			active_script_uri = getInteractiveScript()
			
				// Kael:
				// if no interactive script, fallback to asset.__pending
				// if the script is in the cache, there is actually no interactive scripts when it's executing
				|| {};
				
			active_script_uri = active_script_uri.src
				
				// > In IE, if the script is in the cache, it actually executes *during* 
				// > the DOM insertion of the script tag, so you can keep track of which 
				// > script is being requested in case define() is called during the DOM 
				// > insertion.			
				|| asset.__pending;
	    }
	    
	    if(!active_script_uri){
	    	// if fetching interactive script failed, fall back to normal ways
	    	_last_anonymous_mod = mod;
	    }else{
	    	mod = getModuleByIdentifier( generateModuleURI_Identifier(active_script_uri).i );
	    }
	}
	
	switch(K._type(factory)){
		
		// convention:
		// in this case, this module must not be defined in a module file
		case 'string':
			mod.status = STATUS.DI;
			path_info = generateModuleURI_Identifier(factory);
			uri = path_info.u;
			identifier = path_info.i;
			
			if(REGEX_IS_CSS.test(factory)){
				mod.isCSS = true;
			}
					
			// need package checking
			// only those who defined with module uri that need package checking
			mod.npc = true;
			mod.i = identifier;
			
			break;
			
		case 'function':
			mod.factory = factory;
			
			// if dependencies is explicitly defined, loader will never parse them from the factory function
			// so, to define a standalone module, you can set dependencies as []
			// if(!dependencies){
			//	dependencies = parseDependencies(factory);
			// }
			
			if(dependencies && dependencies.length){
				mod.status = STATUS.DD;
				
				// only if defined with factory function, can a module has dependencies
				mod.deps = dependencies;
			}else{
				mod.status = STATUS.RD;
			}
			
			break;
			
		case 'object':
			mod.exports = factory;
			
			// tidy module data, when fetching interactive script succeeded
			active_script_uri && tidyModuleData(mod);
			uri = NULL;
			break;
			
		default:
			// fail silently
			return;
	}
	
	// define buffer or string type factory
	if(uri){
		mod.uri = uri;
	}
	
	// give user module a special prefix
	// so that user could never override the library module by defining with:
	// <code:pseudo>
	// 		KM.define('http://myurl', function(){…});
	// </code>
	// it will be saved as `~http://myurl`;
	// name && memoizeMod(USER_MODULE_PREFIX + name, mod);
	
	if(identifier){
		existed = getModuleByIdentifier(identifier);
		existed ? ( mod = K.mix(existed, mod) ) : memoizeMod(identifier, mod);
	}
	
	// internal use
	return mod;
};


/**
 * module load
 * --------------------------------------------------------------------------------------------------- */
 
/**
 * method to load a module
 * @public
 * @param {Array.<String>} dependencies
 * @param {(function(...[number]))=} callback (optional)
 */
function provide(dependencies, callback){
	dependencies = K.makeArray(dependencies);
	
	_provide(dependencies, callback, {});
}; 


/**
 * @private
 * @param {Object} env environment for cyclic detecting and generating the uri of child modules
 	{
 		r: {string} the uri that its child dependent modules referring to
 		p: {string} the uri of the parent dependent module
 		n: {string} namespace of the current module
 	}
 * @param {boolean=} noCallbackArgs whether callback method need arguments, for inner use
 */
function _provide(dependencies, callback, env, noCallbackArgs){
    var 

    counter = dependencies.length,
    args = [K],
    arg_counter = 0,
    cb;
		
	if(K.isFunction(callback)){
		cb = noCallbackArgs ?
			callback
		: 
			function(){
				callback.apply(NULL, args);
			};
	}
		
	if(counter === 0){
		cb && cb();
	}else{
		dependencies.forEach(function(dep, i){
			var mod = getOrDefine(dep, env),
				arg_index = mod.isCSS ? 0 : ++ arg_counter;
			
			if(isCyclic(env, mod.uri)){
				warning(120);
			}
			
			provideOne(mod, function(){
				if(cb){
					-- counter;
				
					if(!noCallbackArgs && arg_index){
						args[arg_index] = createRequire(env)(dep);
					}
					
					if(counter === 0){
						cb();
					}
				}
			}, {r: mod.uri, p: env, n: mod.ns});
		});
	}
};


/**
 * @private
 * @param {string} name
 * @param {object=} env
 * @param {boolean=} noWarn
 * @param {undefined=} undef
 */
function getOrDefine(name, env, noWarn){
	var 
	
	referenceURI = env.r, 
	   
	// module data
	mod,
		
	// app data  					
	namespace,	
	namesplit,
	app_home,
	is_app_home_module;
	
	namesplit = name.split(APP_NAMESPACE_SPLITTER);
	if(namesplit[1]){
		name = namesplit[1];
		namespace = namesplit[0].toLowerCase();
		app_home = _config.appBase + namespace + '/';
	}
	
	/**
	 * referenceURI === switch.js
	 * 'dom'		-> base top, no user mod
	 * 'NC::dom'	-> app top, no user mod
	 * '~/dom'		-> current app top, no user mod
	 * '/dom'		-> absolute
	 * './dom'		-> relative
	 * '../dom'		-> relative
	
	 * referenceURI === undefined
	 * 'dom'		-> top, user mod or lib mod
	 * 'NC::dom'	-> top, no user mod
	 */
	if(!mod){
	
		var 
		
		uri, identifier, app, 
		home_prefix = APP_HOME_PREFIX;
	
		// in [Checkin::index].js
		// ex: '~/dom' 
		//     -> name: 'dom', namespace: 'Checkin'
		if(is_app_home_module = name.indexOf(home_prefix) === 0){
			name = name.substr(home_prefix.length);
		}
		
		// these below are treated as modules within the same namespace
		// '~/dom'
		// './dom'
		// '../dom'
		if(is_app_home_module || isRelativeURI(name)){
			namespace = env.n;
		}
	
		uri = moduleNameToURI(name, referenceURI, app_home);
		identifier = generateModuleURI_Identifier(uri).i
		mod = getModuleByIdentifier(identifier);
		// warn = warn && !mod;
	}
	
	if(!mod){
		// always define the module url when providing
		mod = _define('', undef, undef, uri);
	}
	
	mod.ns = namespace;

	// warn && warning(110, name);
	
	return mod;
};


/**
 * provideOne(for inner use)
 * method to provide a module, push its status to at least STATUS.ready
 * @param {Object} mod
 * @param {function()} callback
 * @param {!Object} env sandbox of environment {
 		r: {string} relative uri,
 		p: {Object} environment of the parent module(caller module which depends on the current 'mod' ),
 		n: {string} namespace of the caller module
   }
 */
function provideOne(mod, callback, env){
	var status = mod.status, 
		parent, cb,
		_STATUS = STATUS;
	
	// Ready -> 5
	// provideOne method won't initialize the module or execute the factory function
	if(mod.exports || status === _STATUS.RD){
		callback();
	
	}else if(status >= _STATUS.DD){
		cb = function(){
			var ready = _STATUS.RD;
			
			// function cb may be executed more than once,
			// because a single module might be being required by many other modules simultainously.
			// after a certain intermediate process, maybe the module has been initialized and attached(has 'exports') 
			// and its status has been deleted.
			// so, mod.status must be checked before we set it as 'ready'
			
			// undefined < ready => false
			if(mod.status < ready){
				mod.status = ready;
			}
			
			callback();
		};
	
		// Defined -> 3
		if(status === _STATUS.DD){
			mod.status = _STATUS.RQ;
			mod.pending = [cb];
			
			// recursively loading dependencies
			_provide(mod.deps, function(){
				var m = mod;
				m.pending.forEach(function(c){
					c();
				});
				
				m.pending.length = 0;
				delete m.pending;
			}, env, true);
			
		// Requiring -> 4
		}else{
			mod.pending.push(cb);
		}
	
	// package definition may occurs much later than module, so we check the existence when providing a module
	// if a package exists, and module file has not been loaded.
	// example:
	// before we load module 'fx/tween', we would check if package 'fx' had been defined
	// if had, loader will request fx.js first
	}else if(
		mod.npc && 
		(parent = getModuleByIdentifier( getParentModuleIdentifier(mod.i) )) && 
		
		// prevent fake packages from being defined again
		parent.status < _STATUS.DD
	){
		loadModuleSrc(parent, function(){
			provideOne(mod, callback, env);
			callback = null;
		});
	
	}else if(status < _STATUS.DD){
		loadModuleSrc(mod, function(){
			var last = _last_anonymous_mod;
			
			// CSS dependency
			if(mod.isCSS){
				mod.status = _STATUS.RD;
				delete mod.uri;
			
			// Loading -> 2
			// handle with anonymous module define
			}else if(last && mod.status === _STATUS.LD){
				
				if(last.status < _STATUS.DD){
					error(510);
				}
				
				K.mix(mod, last);
				_last_anonymous_mod = NULL;
				
				// when after loading a library module, 
				// and IE didn't fire onload event during the insertion of the script node
				tidyModuleData(mod);
			}
			
			provideOne(mod, callback, env);
		});
	}
};


/**
 * specify the environment for every id that required in the current module
 * including
 * - reference uri which will be set as the current module's uri 
 
 * @param {Object} envMod mod
 */
function createRequire(envMod){
	return function(id){
		var mod = getOrDefine(id, {
			r: envMod.uri,
			n: envMod.ns
		}, true);
		
		return mod.exports || generateExports(mod);
	};
};


/**
 * generate the exports if the module status is 'ready'
 */
function generateExports(mod){
	var exports = {},
		factory,
		ret;
		
	if(mod.status === STATUS.RD && K.isFunction(factory = mod.factory) ){
	
		// to keep the object mod away from the executing context of factory,
		// use factory instead mod.factory,
		// preventing user from fetching runtime data by 'this'
		ret = factory(K, createRequire(mod), exports);
		
		// exports:
		// TWO ways to define the exports of a module
		// 1. 
		// exports.method1 = method1;
		// exports.method2 = method2;
		
		// 2.
		// return {
		//		method1: method1,
		//		method2: method2
		// }
		
		// {2} has higher priority
		if(ret){
			exports = ret;
		}
		
		mod.exports = exports;
		tidyModuleData(mod);
	}
		
	return exports;
};


function tidyModuleData(mod){
	if(mod.exports){
		// free
		// however, to keep the code clean, 
		// tidy the data of a module at the final stage instead of at each intermediate process
		if(mod.deps){
			mod.deps.length = 0;
			delete mod.deps;
		}
		
		delete mod.factory;
		delete mod.uri;
		delete mod.status;
		delete mod.ns;		
		delete mod.npc;
		delete mod.i;
	}
	
	return mod;
};


/**
 * load a script and remove script node after loaded
 * @param {string} uri
 * @param {function()} callback
 * @param {!string.<'css', 'js'>} type the type of the source to load
 */
function loadScript(uri, callback, type){
	var node,
		cb = type === 'css' ? callback : function(){
		
			// execute the callback before tidy the script node
			callback.call(node);
	
			if(!isDebugMode()){
				try {
					if(node.clearAttributes) {
						node.clearAttributes();
					}else{
						for(var p in node){
							delete node[p];
						}
					}
				} catch (e) {}
				
				HEAD.removeChild(node);
			}
			node = NULL;
		};
	
	node = asset[ type ](uri, cb);
};


/**
 * load the module's resource file
 * always load a script file no more than once
 */
function loadModuleSrc(mod, callback){
	var uri = mod.uri,
		script = _script_map[uri],
		LOADED = 1;
        
    if (!script) {
        script = _script_map[uri] = [callback];
        mod.status = STATUS.LD;
        
        loadScript(uri, function(){
        	var m = mod;
        		
        	script.forEach(function(s){
        		s.call(m);
        	});
        	
        	// TODO:
        	// test
        	// _script_map[uri] = LOADED;
        	
        	// the logic of loader ensures that, once a uri completes loading, it will never be requested 
        	// delete _script_map[uri];
        }, mod.isCSS ? 'css' : 'js');
        
    } else {
        script.push(callback);
    }	
};


/**
 * module tools
 * --------------------------------------------------------------------------------------------------- */

/**
 * @param {string} name
 * @param {string} referenceURI
 * @param {string} base
 */
function moduleNameToURI(name, referenceURI, base){
	var no_need_extension = REGEX_NO_NEED_EXTENSION.test(name);
	return absolutizeURI(name + (no_need_extension ? '' : '.js'), referenceURI, base);
};


/**
 * generate the path of a module, the path will be the identifier to determine whether a module is loaded or defined
 * @param {string} uri the absolute uri of a module. no error detection
 */
var generateModuleURI_Identifier = K._memoize( function(uri){
	var path_for_uri = uri,
		path_for_identifier = uri,
		EMPTY = '',
		cfg = _config,
		path;

	// if(cfg.enableCDN){
	path = isAbsoluteURI(uri) ? getLocation(uri).pathname : uri;
		
	path_for_uri = cfg.CDNHasher(path) + path;
	path_for_identifier = path;
	// }

	return {
		// uri
		u: path_for_uri,
		
		// identifier
		i: cfg.santitizer(path_for_identifier)
	};
});


function getParentModuleIdentifier(identifier){
	var m = identifier.match(REGEX_DIR_MATCHER);
	
	return m ? m[0] + '.js' : false;
};


/**
 * get a module by id
 * @param {string=} version
 */
function getModuleByIdentifier(id, version){
	return _mods[id + (version ? '|' + version : '' )];
};


function memoizeMod(id, mod){
	_mods[id] = mod;
};


function isCyclic(env, uri) {
	return uri && ( env.r === uri || env.p && isCyclic(env.p, uri) );
};


function getInteractiveScript() {
	var INTERACTIVE = 'interactive';

	if (interactive_script && interactive_script.readyState === INTERACTIVE) {
		return interactive_script;
	}
	
	// KM loader only insert scripts into head
	var scripts = HEAD.getElementsByTagName('script'),
		script,
		i = 0,
		len = scripts.length;
	
	for (; i < len; i++) {
		script = scripts[i];
			if (script.readyState === INTERACTIVE) {
			return interactive_script = script;
		}
	}
	
	return NULL;
};


function isDebugMode(){
	return K._env.debug;
};


/**
 * data santitizer
 * --------------------------------------------------------------------------------------------------- */

/**
 * the reference uri for a certain module is the module's uri
 * @param {string=} referenceURI
 * @param {string=} base
 */
function absolutizeURI(uri, referenceURI, base){
	var ret;
	
	base || (base = _config.libBase);
	referenceURI || (referenceURI = base);
	
	// absolute uri
    if (isAbsoluteURI(uri)) {
    	ret = uri;
    	
    // relative uri
    }else if (isRelativeURI(uri)) {
		ret = realpath(getDir(referenceURI) + uri);
    
    // root uri
    // never use it
    // }else if (uri.indexOf('/') === 0) {
    	// for inner use, referenceURI is always a absolute uri
    	// so we can get its host
    	// ret = getHost(referenceURI) + uri;
    	
    /**
     * Neuron Loader will never apply the root base of current location.href to current modules
     * module base must be configured
     */
    }else {
    	ret = base + uri.replace(/^\/+/, '');
    }
	
	return ret;
};


function isAbsoluteURI(uri){
	return uri && uri.indexOf('://') !== -1;
};


function isRelativeURI(uri){
	return uri.indexOf('./') === 0 || uri.indexOf('../') === 0;
};


/**
 * Canonicalize path.
 
 * realpath('a/b/c') ==> 'a/b/c'
 * realpath('a/b/../c') ==> 'a/c'
 * realpath('a/b/./c') ==> '/a/b/c'
 * realpath('a/b/c/') ==> 'a/b/c/'
 * #X realpath('a//b/c') ==> 'a/b/c' ?
 * realpath('a//b/c') ==> 'a//b/c'   - for 'a//b/c' is a valid uri
 * by Frank Wang [lifesinger@gmail.com] 
     -> http://jsperf.com/memoize
 */
function realpath(path) {
	var old = path.split('/'),
		ret = [];
		
	old.forEach(function(part, i){
		if (part === '..') {
			if (ret.length === 0) {
			  	error(530);
			}
			ret.pop();
			
		} else if (part !== '.') {
			ret.push(part);
		}
	});
	
	return ret.join('/');
};


/**
 * get the current directory from the location
 *
 * http://jsperf.com/regex-vs-split/2
 * vs: http://jsperf.com/regex-vs-split
 */
function getDir(uri){
	var m = uri.match(REGEX_DIR_MATCHER); // greedy match
    return (m ? m[0] : '.') + '/';
};


/**
 * @public
 * ---------------------------------------------------------------------------------- */

K.mix(define, {
	'on': function(){
		_define_buffer_on = true;
	},
	
	'off': function(){
		_define_buffer_on = false;
	},
	
	'__mods': _mods
});


/**
 * Configure the prefix of modules
 * @param {string} name
 * @param {object} config {
 		base: {string} if not empty, it should include a left slash and exclude the right slash
 			
 			'/lib';  // RIGHT!
 			
 			'/lib/'; // WRONG!
 			'lib/';	 // WRONG!
   }
 */
/*
function prefix(name, config){
	var map = _apps_map;

	if(!map[name]){
		map[name] = config;
		config.base = _config.base + config.base;
	}
};
*/


// use extend method to add public methods, 
// so that google closure will NOT minify Object properties

// define a module
K['define'] = define;

// attach a module
K['provide'] = provide;

// semi-private
// will be destroyed after configuration
K.__loader = Loader = {

	// no fault tolerance
	'config': function(cfg){
    	cfg.libBase = '/' + cfg.libBase;
    	cfg.appBase = '/' + cfg.appBase;
	
		_config = cfg;
		
		warning = cfg.warning;
		error = cfg.error;
		
		Loader['config'] = NOOP;
	}
};


})(KM, null);


/**
 change log:
 
 import ./ChangeLog.md;
 
 */