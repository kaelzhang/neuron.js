/*! Neuron core:loader v4.1.1 * All rights reserved * author i@kael.me */

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
var	_mods = {},			// map: identifier -> module
	_script_map = {},	// map: url -> status
	_config = {},
	_last_anonymous_mod = NULL,
	_pending_script = NULL,
	_define_buffer_on = false,
	
	_allow_undefined_mod = true,
	
	// fix onload event on script in ie6-9
	use_interactive = K.UA.ie < 10,
	interactive_script = NULL,
	
	warning,
	
/**
 * @const
 */
	REGEX_FILE_TYPE = /\.(\w+)$/i,
	REGEX_NO_NEED_EXTENSION = /\.(?:js|css)$|#|\?/i,
	REGEX_IS_CSS = /\.css(?:$|#|\?)/i,
	// REGEX_FACTORY_DEPS_PARSER =  /\brequire\b\s*\(\s*['"]([^'"]*)/g,
	REGEX_DIR_MATCHER = /.*(?=\/.*$)/,
	
	NOOP = function(){}, // no operation
	
	WIN = K.__HOST,
	DOC = WIN.document,
	HEAD = DOC.getElementsByTagName('head')[0],
	LOC = K.getLocation(),
	
	/**
	 * module status
	 * @enum {number}
	 * @const
	 */	
	STATUS = {
		// the module's uri has been specified, 
		DEFINING	: 1,
	
		// the module's source uri is downloading or executing
		LOADING		: 2,
		
		// the module has been explicitly defined. 
		DEFINED 	: 3,
		
		// being analynizing and requiring the module's dependencies 
		REQUIRING 	: 4,
		
		// the module's factory function are ready to be executed
		// the module's denpendencies are set as STATUS.READY
		READY 		: 5 //,
		
		// the module already has exports
		// the module has been initialized, i.e. the module's factory function has been executed
		// ATTACHED  	: 6
	},
	
/**
 * static resource loader
 * meta functions for assets
 * --------------------------------------------------------------------------------------------------- */
	
	asset = {
		css: function(uri, callback){
			var node = DOC.createElement('link');
			
			node.href = uri;
			node.rel = 'stylesheet';
			
			callback && assetOnload.css(node, callback);
			
			// insert new CSS in the end of <head> to maintain priority
			HEAD.appendChild(node);
			
			return node;
		},
		
		js: function(uri, callback){
			var node = DOC.createElement('script');
			
			node.src = uri;
			node.async = true;
			
			callback && assetOnload.js(node, callback);
			
			_pending_script = uri;
			HEAD.insertBefore(node, HEAD.firstChild);
			_pending_script = NULL;
			
			return node;
		},
		
		img: function(uri, callback){
			var node = DOC.createElement('img'),
				delay = setTimeout;

			callback && ['load', 'abort', 'error'].forEach(function(name){
			
				node['on' + name] = function(){
					node = node.onload = node.onabort = node.onerror = NULL;
					
					setTimeout(function(){
						callback.call(node, name);
					}, 0);
				};
			});
	
			node.src = uri;
			
			if (callback && node.complete){
				setTimeout( function(){
					callback.call(node, 'load');
				}, 0);
			}
			
			return node;
		}
	}, // end asset
	
	// @this {element}
	assetOnload = {
		js: ( DOC.createElement('script').readyState ?
				function(node, callback){
			    	node.onreadystatechange = function(){
			        	var rs = node.readyState;
			        	if (rs === 'loaded' || rs === 'complete'){
			            	node.onreadystatechange = NULL;
			            	
			            	callback.call(this);
			        	}
			    	};
				} 
			:
				function(node, callback){
					if(callback){
						node.addEventListener('load', callback, false);
					}
				}
		),
		
		/**
		 * assert.css from Frank Wang [lifesinger@gmail.com]
		 */
		css: ( DOC.createElement('css').attachEvent ?
				function(node, callback){
					node.attachEvent('onload', callback);
				}
			:	
				// ECMAScript 3+
				function CSSPoll(node, callback){
					var is_loaded = false,
						sheet = node['sheet'];
						
					if(sheet){
						if(K.UA.webkit){
							is_loaded = true;
						
						}else{
							try {
								if(sheet.cssRules) {
									is_loaded = true;
								}
							} catch (ex) {
								if (ex.name === 'NS_ERROR_DOM_SECURITY_ERR') {
									is_loaded = true;
								}
							}
						}
					}
				
				    if (is_loaded) {
				    	setTimeout(function(){
				    		callback.call(node);
				    	}, 0);
				    }else {
						setTimeout(function(){
							CSSPoll(node, callback);
						}, 10);
				    }
	  			}
  		)
  	}; // end assetOnload


/**
 * method to load a resource file
 * @param {string} uri uri of resource
 * @param {function()} callback callback function
 * @param {string=} type the explicitily assigned type of the resource, 
 	can be 'js', 'css', or 'img'. default to 'img'. (optional) 
 */
function loadSrc(uri, callback, type){
	var extension = type || uri.match(REGEX_FILE_TYPE)[1];
	
	return extension ?
		( asset[ extension.toLowerCase() ] || asset.img )(uri, callback)
		: NULL;
};

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
	var version, info, uri, identifier,
		last = arguments.length - 1,
		EMPTY = '',
		_def = _define;
	
	if(arguments[last] === true){			// -> define(uri1, uri2, uri3, true);
		foreach(arguments, function(arg, i, U){
			i < last && _def(EMPTY, U, U, U, absolutizeURI(arg));
		});
		return;
	}

	// overload and tidy arguments >>>
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
	
	// @convention:
	// 1. in this case, KM.define must not be called in a module file
	// 2. in this case, if you define([name, ] dependencies, uri), dependencies will be no use
	if(K.isString(factory)){				// -> define(alias, uri);
		factory = absolutizeURI(factory);
	}
	
	// split name and version
	if(name){
		name = name.split('|');
		version = name[1] || EMPTY;
		name = name[0];
	
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
	
	_def(name, identifier, version, dependencies, factory, uri);
};


/**
 * method for inner use
 * @private
 * @param {string|undefined} name
 		{string}
 			=== '': in the case that only defining module uri
 			!== '': module identifier 
 		{undefined} anonymous module definition - the module has no explicit identifier
 
 * @param {string=} identifier (optional)
 * @param {number=} version version of the custom module. (optional)
 * @param {(Array.<string>)=} dependencies
 * @param {(function(...[number])|Object|string)=} factory
 		{string} absolute! uri
 * @param {string=} uri
 */
function _define(name, identifier, version, dependencies, factory, uri){
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
	var mod = {},
		name_with_ver, ver, path_info,
		existed, existed_ver,
		active_script_uri,
		
		// @type {boolean} whether override the existed module
		override = true;
	
	/**
	 * get module object 
	 */
	if(name){
		// mod.name = name;
		// pkg = _last_anonymous_mod;
		
		// modules defined in packages will be treated as explicit-defined modules
		// if(pkg){
		//	isImplicit = true;
		// }
		
		name.indexOf('/') !== -1 && !_define_buffer_on && warning('def a path may cause further problems:' + name);
		
		if(version){
			name_with_ver = name + '|' + version;
			mod.version = version;
		}
	
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
				// if no interactive script, fallback to _pending_script
				// if the script is in the cache, there is actually no interactive scripts when it's executing
				|| {};
				
			active_script_uri = active_script_uri.src
				
				// > In IE, if the script is in the cache, it actually executes *during* 
				// > the DOM insertion of the script tag, so you can keep track of which 
				// > script is being requested in case define() is called during the DOM 
				// > insertion.			
				|| _pending_script;
	    }
	    
	    if(!active_script_uri){
	    	// if fetching interactive script failed, so fall back to normal ways
	    	_last_anonymous_mod = mod;
	    }else{
	    	mod = getMod( generateModuleURI_Identifier(active_script_uri).i );
	    }
	}
	
	switch(K._type(factory)){
		
		// convention:
		// in this case, this module must not be defined in a module file
		// # and the uri must be an absolute uri
		case 'string':
			mod.status = STATUS.DEFINING;
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
				mod.status = STATUS.DEFINED;
				
				// only if defined with factory function, can a module has dependencies
				// TODO:
				// enable dependencies for other types of definitions ?
				mod.dependencies = dependencies;
			}else{
				mod.status = STATUS.READY;
			}
			
			break;
			
		case 'object':
			mod.exports = factory;
			
			// tidy module data, when fetching interactive script succeeded
			active_script_uri && tidyModuleData(mod);
			uri = NULL;
			break;
			
		default:
			new loaderError('Unexpected factory type for '
				+ ( name ? 'module "' + name + '"' : 'anonymous module' ) 
				+ ': ' + K._type(factory)
			);
	}
	
	/**
	 * version comparison only occurs when defining a custom module
	 * if you directly provide a library module, it will always be the latest version
	 * but someday, you wanna use a module and its relevant old tagged version simultaniously in ONE page,
	 * you could do something like this:
	 
	 <code>
	 	KM.define('validator|1.0', 'http://kael.me/lib/form/validator.js');
	 	KM.define('validator|2.0', 'http://kael.me/lib/2.0/form/validator.js');
	 	
	 	KM.provide(['form/validator', 'validator', 'validator|1.0', 'validator|2.0'], function(K, fv, v, v1, v2){
	 		v === v2; // true
	 		v === v1; // false
	 		
	 		// true, this is important, 'form/validator'(never defined) will point to a lib module. 
	 		// for a lib module, only the uri that it concerns
	 		fv === v1;
	 		
	 		v1; // validator 1.0
	 		v2;	// validator 2.0 
	 	});
	 </code>
	 */
	if(name){
		name_with_ver && memoizeMod(name_with_ver, mod);
	
		override = 
			// module doesn't exists
			!(existed = getMod(name)) ||

			// the existed module has no version
			!(existed_ver = existed.version) ||
			
			// current module is newer than the existed one
			version && versionCompare(version, existed_ver);
	}
	
	if(uri){
		mod.uri = uri;
	}
	
	if(override){
		name && memoizeMod(name, mod);
		
		if(identifier){
			existed = getMod(identifier);
			existed ? ( mod = K.mix(existed, mod) ) : memoizeMod(identifier, mod);
		}
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
 	}
 * @param {boolean=} noCallbackArgs whether callback method need arguments, for inner use
 */
function _provide(dependencies, callback, env, noCallbackArgs){
	var counter = dependencies.length,
		args = [K],
		arg_counter = 0,
		cb;
		
	if(K.isFunction(callback)){
		cb = noCallbackArgs ?
			callback
		: 
			function(){
				var real_arg = []
				callback.apply(NULL, args);
			};
	}
		
	if(counter === 0){
		cb && cb();
	}else{
		foreach(dependencies, function(dep, i, undef){
			var mod = getOrDefine(dep, env.r),
				arg_index = mod.isCSS ? 0 : ++ arg_counter;
			
			if(isCyclic(env, mod.uri)){
				warning('cyclic dependency detected!');
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
			}, {r: mod.uri, p: env});
		});
	}
};

/**
 * @private
 * @param {string} name
 * @param {string=} referenceURI
 * @param {boolean=} noWarn
 * @param {undefined=} undef
 */
function getOrDefine(name, referenceURI, noWarn){
	var mod, uri, warn, identifier, parent;
		
	if(!referenceURI){
		// check for explicitly defined module
		mod = getMod(name);
		warn = !noWarn && !_allow_undefined_mod && !mod;
	}
	
	if(!mod){
		uri = moduleNameToURI(name, referenceURI);
		identifier = generateModuleURI_Identifier(uri).i
		mod = getMod(identifier);
		warn = warn && !mod;
	}
	
	if(!mod){
		// always define the module url when providing
		mod = _define('', undef, undef, undef, uri);
	}
	
	warn && warning('module ' + name + ' has not explicitly defined!');
	
	return mod;
};

/**
 * provideOne(for inner use)
 * method to provide a module, push its status to at least STATUS.ready
 */
function provideOne(mod, callback, env){
	var status = mod.status, parent;
	
	function cb(){
		var ready = STATUS.READY;
		if(mod.status < ready){
			mod.status = ready;
		}
		
		callback();
	};
	
	// provideOne method won't initialize the module or execute the factory function
	if(mod.exports || status === STATUS.READY){
		return callback();
		
	}else if(status === STATUS.REQUIRING){
		mod.pending.push(cb);
	
	}else if(status === STATUS.DEFINED){
		mod.status = STATUS.REQUIRING;
		mod.pending = [cb];
		
		_provide(mod.dependencies, function(){
			var m = mod;
			foreach(m.pending, function(c){
				c();
			});
			
			m.pending.length = 0;
			delete m.pending;
		}, env, true);
	
	// package definition may occurs much later than module, so we check the existence when providing a module
	// if a package exists, and module file has not been loaded.
	}else if(mod.npc && (parent = getMod(getParentModuleIdentifier(mod.i))) ){
		return loadModuleSrc(parent, function(){
			delete mod.npc;
			delete mod.i;
			
			provideOne(mod, callback, env);
		});
		
	}else if(status < STATUS.DEFINED){
		loadModuleSrc(mod, function(){
			var last = _last_anonymous_mod;
			
			// CSS dependency
			if(mod.isCSS){
				mod.status = STATUS.READY;
				delete mod.uri;
			
			// handle with anonymous module define
			}else if(last && mod.status === STATUS.LOADING){
				
				if(last.status < STATUS.DEFINED){
					new loaderError('mod with no factory detected in a module file');
				}
				
				K.mix(mod, last);
				_last_anonymous_mod = NULL;
				
				// when after loading a library module, 
				// and IE didn't fire onload event during the insertion of the script node
				tidyModuleData(mod);
			}
			
			provideOne(mod, cb, env);
		});
	}
};

/**
 * specify the environment for every id that required in the current module
 * including
 * - reference uri which will be set as the current module's uri 
 */
function createRequire(envMod){
	function require(id){
		var mod = getOrDefine(id, envMod.uri, true);
		
		// if(!mod || mod.status < STATUS.READY){
		// 	loaderError('Module "' + id + '" is not defined, or has not attached');
		// }
		
		return mod.exports || generateExports(mod);
	};
	
	return require;
};


function generateExports(mod){
	var exports = {},
		factory,
		ret;
		
	if(mod.status === STATUS.READY && K.isFunction(factory = mod.factory) ){
	
		// to keep the object mod away from the executing context of factory,
		// use factory instead mod.factory
		ret = factory(K, createRequire(mod), exports);
		
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
		if(mod.dependencies){
			mod.dependencies.length = 0;
			delete mod.dependencies;
		}
		
		delete mod.factory;
		delete mod.uri;
		delete mod.status;
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
 * load the module’s resource file
 * always load a script file no more than once
 */
function loadModuleSrc(mod, callback){
	var uri = mod.uri,
		script = _script_map[uri],
		LOADED = 1;
        
    if (!script) {
        script = _script_map[uri] = [callback];
        mod.status = STATUS.LOADING;
        
        loadScript(uri, function(){
        	var m = mod;
        		
        	foreach(script, function(s){
        		s.call(m);
        	});
        	
        	// _script_map[uri] = LOADED;
        	
        	// the logic of loader ensures that, once a uri completes loading, it will never be requested 
        	// delete _script_map[uri];
        }, mod.isCSS ? 'css' : 'js');
        
    // } else if (script === LOADED) {
    //    callback.call(mod);  
    } else {
        script.push(callback);
    }	
};


/**
 * module tools
 * --------------------------------------------------------------------------------------------------- */

function moduleNameToURI(name, referenceURI){
	var no_need_extension = REGEX_NO_NEED_EXTENSION.test(name);
	return absolutizeURI(name + (no_need_extension ? '' : '.js'), referenceURI);
};

// memoize the result of analysisModuleName 
// analysisModuleName = K._memoize(analysisModuleName);

/**
 * generate the path of a module, the path will be the identifier to determine whether a module is loaded or defined
 * @param {string} uri the absolute uri of a module. no error detection
 */
function generateModuleURI_Identifier(uri){
	var path_for_uri = uri,
		path_for_identifier = uri,
		EMPTY = '',
		cfg = _config;

	if(cfg.enableCDN){
		var loc = K.getLocation(uri),
			path = loc.pathname + loc.search;
			
		path_for_uri = _config.CDNHasher(path) + path;
		path_for_identifier = loc.pathname;
	}

	return {
		// uri
		u: path_for_uri,
		
		// identifier
		i: cfg.santitizer(path_for_identifier)
	};
};

generateModuleURI_Identifier = K._memoize(generateModuleURI_Identifier);


function getParentModuleIdentifier(identifier){
	var m = identifier.match(REGEX_DIR_MATCHER);
	
	return m ? m[0] + '.js' : false;
};


/**
 * get a module by id
 * @param {string=} version
 */
function getMod(id, version){
	return _mods[id + (version ? '|' + version : '' )];
};


function memoizeMod(id, mod){
	_mods[id] = mod;
};


function isCyclic(env, uri) {
	return uri && ( env.r === uri || env.p && isCyclic(env.p, uri) );
};


/**
 * parse dependencies from a factory function
 */

/*
function parseDependencies(factory){
	return parseAllSubMatches(removeComments(String(factory)), REGEX_FACTORY_DEPS_PARSER);
};
*/

function getInteractiveScript() {
	if (interactive_script && interactive_script.readyState === 'interactive') {
		return interactive_script;
	}
	
	// KM loader only insert scripts into head
	var scripts = HEAD.getElementsByTagName('script'),
		script,
		i = 0,
		len = scripts.length;
	
	for (; i < len; i++) {
		script = scripts[i];
			if (script.readyState === 'interactive') {
			return (interactive_script = script);
		}
	}
	
	return NULL;
};


function isDebugMode(){
	return K._Cfg.debug;
};


/**
 * custom error type
 * @constructor
 */
function loaderError(message){
	throw {
		message:	message,
		toString:	function(){
			return 'KM Loader: ' + message;
		}
	};
};

warning = WIN.console && console.warn ?
	function(msg){
		console.warn('KM Loader: ' + msg);
	}
:	NOOP;


/**
 * data santitizer
 * --------------------------------------------------------------------------------------------------- */

/**
 * parse all sub matches of a string according to a regular expression
 */
 
/*
function parseAllSubMatches(string, regex){
	var ret = [], match;
	
	if(regex.global){
		while(match = regex.exec(string)){
			ret = ret.concat( match.slice(1) );
		}
	}else{
		match = string.match(regex);
		if(match){
			ret = match.slice(1);
		}
	}
	
	return ret;
};
*/

/**
 * simply remove comments from the factory function
 * http://is.gd/qEf8pH
 
function removeComments(code){
	return code
		.replace(/(?:^|\n|\r)\s*\/\*[\s\S]*?\*\/\s*(?:\r|\n|$)/g, '\n')
        .replace(/(?:^|\n|\r)\s*\/\/.*(?:\r|\n|$)/g, '\n');
};
*/
 
/**
 * compare two version, such as a.b.c.d
 * @returns {boolean} whether v1 is newer
 */
function versionCompare(v1, v2){
    v1 = v1.split('.');
    v2 = v2.split('.');
    
    var len = Math.max(v1.length, v2.length) - 1,
    	i = 0,
    	ret = 0;
    	
    do{
    	ret = ( v1[len] || 0 ) - ( v2[len] || 0 );
    
    }while(len -- && ret === 0);
    
    return ret >= 0;
};


/**
 * the reference uri for a certain module is the module's uri
 * @param {string=} referenceURI
 */
function absolutizeURI(uri, referenceURI){
	referenceURI = referenceURI || _config.defaultDir;

	var ret;
	
	// absolute uri
    if (isAbsoluteURI(uri)) {
    	ret = uri;
    }
    // relative uri
    else if (uri.indexOf('./') === 0 || uri.indexOf('../') === 0) {
		ret = realpath(getDir(referenceURI) + uri);
    }
    // root uri
    else if (uri.indexOf('/') === 0) {
    	// for inner use, referenceURI is always a absolute uri
    	// so we can get its host
    	ret = getHost(referenceURI) + uri;
    }
    
    else {
    	ret = _config.defaultDir + uri;
    }
	
	return ret;	
};


function isAbsoluteURI(uri){
	return uri && uri.indexOf('://') !== -1;
};


/**
 * Canonicalize path.
 
 * realpath('a/b/c') ==> 'a/b/c'
 * realpath('a/b/../c') ==> 'a/c'
 * realpath('a/b/./c') ==> '/a/b/c'
 * realpath('a/b/c/') ==> 'a/b/c/'
 * # realpath('a//b/c') ==> 'a/b/c' ?
 * realpath('a//b/c') ==> 'a//b/c'   - for 'a//b/c' is a valid uri
 * by Frank Wang [lifesinger@gmail.com] 
     -> http://jsperf.com/memoize
 */
function realpath(path) {
	var old = path.split('/'),
		ret = [];
		
	foreach(old, function(part, i){
		if (part === '..') {
			if (ret.length === 0) {
			  	new loaderError('Invalid module path: ' + path);
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


function getHost(uri){
	var m = uri.match(/^\w+:\/\/[^/]+/); /* coda highlight error */ 
	return m[0];
};


/**
 * lang
 * ---------------------------------------------------------------------------------- */

function foreach(array, fn){
	var i = 0,
		len = array.length;
		
	for(; i < len; i ++){
		fn(array[i], i);
	}
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
	
	'__mods': _mods //,
	
	// 'alias': function(){}
});

// use extend method to add public methods, 
// so that google closure will NOT minify Object properties
K.mix(K, {
	'load'			: loadSrc,			// load a static source
	'define'		: define,			// define a module
	'provide'		: provide,			// attach a module
	
	// define a package
	// this method will be used by package builder, not developers, except testing cases
	// '_pkg'			: definePackage,
	// '_allMods'		: showAllModules,
	
	/**
	 * @param {Object=} conf {
		 	base: 				{string} root "path" of module library
		 	allowUndefinedMod: 	{boolean}
		 	enableCDN:			{boolean}
		 	CDNHasher: 			{function}
		 }
	 */
	'_loaderConfig' : function(conf){
		var config = K.mix(_config, conf || {}),
			page_root,
			
			// TODO:
			// whether should have a default value
			base = config.base || '/';
		
		// exec only once
		K['_loaderConfig'] = NOOP;
		
		// initialize
		if(!config.enableCDN || !config.CDNHasher){
			page_root = getHost(LOC.href);
			
			config.CDNHasher = function(){
				return page_root;
			};
		}
		
		config.santitizer = config.santitizer || function(s){ return s; };
		
		if(isAbsoluteURI(base)){
			config.defaultDir = base;
			config.base = getDir( K.getLocation(base).pathname );
		}else{
			config.defaultDir = config.CDNHasher() + base;
			config.base = base;
		}
		
		_allow_undefined_mod = config.allowUndefinedMod;
	}
});


})(KM, null);

/**
 * change log:
 
 marks:
 - √ complete
 - # deprecated scheme
 - X discarded scheme
 - * unimportant
 - ! important and of high priority
 
 milestone 4.0 ---------------------------
 
 2011-09-12  Kael:
 TODO:
 - A. split the logic about loader constructor and its instances
 - ! B. refractor dependency model with AOP
 
 
 milestone 3.0 ---------------------------
 
 2011-09-09  Kael:
 TODO:
 - ! A. add loader constructor to create more than one configuration about library base, etc.
 	Scheme: KM.define('http://...fx.js'); var Checkin = KM.app('Checkin'); Checkin.define('http://...timeline.js');
 	KM.provide('Checkin:timeline', function(K, timeline){ … });
 - B. optimize isXXX methods for scope chain
 - C. use native forEach methods for Array
 
 2011-09-07  Kael:
 TODO:
 - A. [issue] if pkg module is directly defined by define.on(), automatically providing called by a child module will fail
 - B. support fake package module definition: define.on(); define('dom', fn); define.off(); define('dom/dimension', fn)
 
 2011-09-02  Kael:
 - remove parseDependencies methods, all reps must be explicitly declared.
 
 TODO:
 - A. support non-browser environment
 - B. distinguish the identifier for anonymous module and non-anonymous module in the module cache. 
 	if define('abc', fn), it will be saved as {'~abc': fn}, 
 	completely prevent user from defining a path as the module identifier to override lib modules
 	
 - C. support the module which could automatically initialize itself when provided
 - D. split the logic of module management and script manipulation, 
 	so that loader could work on non-browser environment, such as NodeJS
 
 2011-09-01  Kael:
 TODO:
 - A. prevent duplicate defining a certain module
 
 2011-08-20  Kael:
 TODO:
 - A. improve stability if user provide a package file
 
 2011-08-03  Kael:
 - TODO[08-01].[A,E]
 
 2011-08-02  Kael:
 - refractor package definition. 
 	if a relevant package is detected, neuron loader will try to fetch the package instead of the module file itself.
 	if the id of module A is the parent dirname of module B, A will be treated as the pkg of B 
 - TODO[06-15].[C,I,J,K]
 
 2011-08-01  Kael:
 - add config.santitizer, remove path_cleaner out from loader
 
 TODO:
 - √ A. failure control, if loading the package fails, fallback to normal way to provide modules
 - B. tidy parameters in _define
 - C. lazily manage package association
 - D*. detect if it fails to load a module file
 - √ E. [issue] if define a package after the definition of a certain module, the package association fails
 
 2011-06-10  Kael:
 - TODO[06-15].[E, A]
 
 milestone 2.0 ---------------------------
 
 2011-06-07  Kael:
 - fix a bug on regular expressions which could not properly remove the decorators(version and min) from uris
 - fix a bug when defining a module with different versions
 - change the way to determine the implicity of a module which will only relevant to the <name> param; remove the isImplicit flag from the '_define' method
 
 2011-05-15  Kael:
 - fix a bug, in ie6 on virtual machine, that the module could not load successfully, 
 	if onload event fired during insertion of the script node(interactive script fetched) 
 	
 TODO:
 - √ A. new API: KM.define(uri1, uri1, uri3, uri4, true) to define several module uris
 - B. add loader constructor to create more instances of loader
 	- 1. association of several instances of loader
 	- 2. comm definition
 - √ C. package detection: 
 	- 1. if the uri of a package is already defined, then its children modules will associated with it even before the source file of the package is fetched
 	# - 2. automatically detect the providing frequency within the modules in one package, in order to automatically use packages
 
 // never add this feature into module loader
 - X # D. [blocked by C] frequency detection for the use of modules within a same lib directory(package), and automatically use package source instead
 - √ E. switcher to turn on define buffer, so we can load module files in traditional ways(directly use <script> to load external files)
 - F. tidy the logic about param factory of string type and param uri in _define method
 - ? G. nested define-provide structure. you can use KM.provide inside the factory function of KM.define to dynamically declare dependencies
 
 // ._allMods removed
 - X # H. complete ._allMods method
 - √ I. abolish KM._pkg
 - √ J. prevent defining a non-anonymous module with a name like pathname
 - √ ? K. explode the cache object of modules
 - L. optimize the calling chain of define and getOrdefine, use less step to get module idenfitier.
 
 2011-05-14  Kael:
 - TODO[05-08].A
 - add more annotations
 
 2011-05-12  Kael:
 - TODO[05-08].B
 
 2011-05-10  Kael:
 - add assetOnload.css
 - add support for css dependencies: TODO[04-17].H
 - add support for resources with search query
 - if module uri has a location.search and location.hash, it wont be fulfilled width the extension of '.js' any more
 
 TODO:
 - A?. default configurations
 - B?. Loader Class support: to create various loader instances with different configurations
 
 2011-05-08  Kael:
 - tidy the status data of modules
 - modules defined in package files will be treated as library modules
 
 TODO:
 - √ A. [issue] when no cdn, package modules don't properly saved in {_mods}: 
 		the module identifier should not be a pathname but absolute uri
 - √ B. tidy the logic about configuration, such as managing default settings, checking.
 
 2011-05-07  Kael:
 - fix a syntax exception when defining anonymous module in ie6-9
 
 2011-05-05  Kael:
 - TODO[04-27].A
 
 2011-04-27  Kael:
 - fix a bug of implicit module definition
 - fix a bug that the callback isn't able to be called when the module is already being providing
 
 TODO:
 - √ A. [issue] implicitly defined module dont properly saved as absolute uri
 
 2011-04-26  Kael:
 - TODO[04-17].C
 
 2011-04-25  Kael: 95%!
 - optimize call chain. create private methods with no type-detecting for arguments
 - module path will include location.search
 - config.enableCDN will affect module path
 - support modules with multiple versions
 - complete cdn auto delivery TODO[04-17].E2
 - remove analysisModuleName method
 - complete all functionalities relevant with package definition TODO[05-17].G
 
 2011-04-24  Kael:
 - require and define methods in inline docs and in module file will be different
 - TODO[04-17]['A', 'D', 'E1', 'B']
 - adjust annotations for advanced mode of closure compiler
 
 TODO:
 - √ optimize and cache dependent modules and module infos
 - test TODO[04-17].B
 
 2011-04-20  Kael:
 - redesign the realization of modules, 
   distinguish the 2 different ways to define a module - on page or in a module file
 - redesign require method
 - add config for CDNHasher
 
 milestone 1.0 ---------------------------
 
 2011-04-19  Kael:
 - # remove lazy quantifier from the regexp to match comments
 	choose lazy match afterwards
 
 2011-04-18  Kael:
 - remove comments before parsing dependencies from factory function
 
 2011-04-17  Kael:
 - memoize the result of analysisModuleName
 - santitize the logic of providing a module, split provideOne off from provide
 - complete basic work flow
 
 TODO:
 - √ B. cyclic dependency detection
 - √ A. reference path for the inside of each module
 - √ C. fix scriptonload on ie6-9
 - √ D. tidy module data, remove no-more unnecessary properties
 - √ E. enable the support to cdn
 		- √ avoid duplicate request
 		- √ cdn frequency adjustion ?
 - # F. detecting potential invocation errors
 		- change 'exports' object
 		- define non-anonymous module in a module file
 - √ H. support css dependencies
 - √ Z. debug-release mode switching
 		- debug: 
 			- √ maintain the script nodes which attached into the document
 			- X print dependency tree
 		- release: 
 			- √ remove script nodes
 			- √ warn, if a module's uri has not been specified
 - √ G. package association
 
 2011-04-10  Kael:
 - create main function of provide
 - add a new api, KM.pkg to define a package
 
 2011-04-05  Kael:
 - create main function of define
 
 2011-04-03  Kael: basic api design
 
 */