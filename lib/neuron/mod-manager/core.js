/** 
 * @preserve core:loader v6.0.0(promise)
 */
 
/**
 
 Passive Mode - a very simple version of loader, which
 
 1. AOP supported
 2. No longer concern module loading or business configurations. All things could be done outside of loader.
 3. No longer parse module identifier
 4. When user provide a module with its identifier, loader of passive mode only register callback function which relavant to the identifier into the pending queue. Once the module and its dependencies is defined, the callback function will execute immediately 
 
 Functionalities:
 
 1. emit module-load event after module defining
 2. provide event interface for each key sub-process
 
 */

; // fix layout of UglifyJS

/**
 * include
 * - static resource loader
 * - a commonjs module loader
 * - interface for business configuration
 
 * implements
 * - CommonJS::Modules/Wrappings                        >> http://kael.me/-cmw
 * - CommonJS::Modules/Wrappings-Explicit-Dependencies    >> http://kael.me/-cmwed
 
 * Google closure compiler advanced mode strict
 */

/**
 * @param {undefined=} undef
 */
;(function(NR, NULL, undef){

/**
 * stack, config or flag for modules
 */
var    

loader = makeSureObject(NR._env, 'loader'),

/**
 * map -> identifier: module
 */
_mods = makeSureObject(loader, 'mods'),

_events = makeSureObject(loader, 'events'),
    
/**
 * @const
 */
APP_HOME_PREFIX = '~/',
DEFAULT_NAMESPACE = '~',

// ex: Checkin::index
APP_NAMESPACE_SPLITTER = '::',

/**
 * abc             -> js: abc.js        
 * abc.js         -> js: abc.js
 * abc.css        -> css: abc.css
 * abc#            -> js: abc
 * abc?123        -> js: abc?123
 * abc?123.js    -> js: abc?123.js
 * abc?123.css    -> css: abc?123.css
 */
REGEX_NO_NEED_EXTENSION = /\.(?:js|css)$|#|\?/i,
// REGEX_IS_CSS = /\.css(?:$|#|\?)/i,

/**
 * abc/def        -> abc
 */
REGEX_DIR_MATCHER = /.*(?=\/.*$)/,

// no operation
NOOP = function(){},

DOC = document,
HEAD = DOC.getElementsByTagName('head')[0],

getLocation = NR.getLocation;


/**
 * module define
 * --------------------------------------------------------------------------------------------------- */

/**
 function overloading:
 
 define('io/ajax', ['util/jsonp'], function(){});
 define('io/ajax', function(){});
 define('io/ajax', {});                 --> removed     -> define('io/ajax', function(){module.exports = {}});
 define('io/ajax', ['util/jsonp'], {}); --> forbidden!  -> fail silently

 */
/**
 * method to define a module
 * @public
 * @param {string} identifier module identifier
 * @param {(Array.<string>|function())=} dependencies array of module names
 * @param {(string|function()|Object)=} factory
 
 * @returns {undefined=}
 */
function define(identifier, dependencies, factory){
    // overload and tidy arguments
    // >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    
    // in passive mode, name must be the module identifier
    if(typeof identifier !== 'string'){
        return;
    }
    
    if(!NR.isArray(dependencies)){             // -> define(id, factory);
        factory = dependencies;
        dependencies = [];
    }
    
    if(!NR.isFunction(factory)){
        return;
    }
    
    _define(identifier, dependencies, factory);
};


/**
 * method for inner use, _define has no fault tolerance
 * @private
 
 * @param {string} identifier (optional) module identifier
 * @param {Array.<string>} dependencies
 * @param {function(...[number])} factory
 
 */
function _define(identifier, dependencies, factory){
    var mod = getModById(identifier);
    
    // a single module might be defined more than once.
    // use this trick to prevent module redefining, avoiding the subsequent side effect
    if(mod._){
        delete mod._;
        
        mod.f = factory;
        
        dependencies.length ? 
            _provide(
                dependencies,
                function(){
                    generateExports(mod);
                }, mod, true
            )
            
          : generateExports(mod);
    }
          
    _events.define(mod);
};


/**
 * generate the exports if the module status is 'ready'
 */
function generateExports(mod){
    var exports = {},
        module = {},
        factory = mod.f,
        
        // to keep the object mod away from the executing context of factory,
        // use factory instead mod.f,
        // preventing user from fetching runtime data by 'this'
        ret = factory(createRequire(mod), exports, module);
        
    // exports:
    // TWO ways to define the exports of a module
    // 1. 
    // exports.method1 = method1;
    // exports.method2 = method2;

    // 2.
    // return {
    //        method1: method1,
    //        method2: method2
    // }

    // 3.
    // module.exports = {
    //        method1: method1,
    //        method2: method2
    // }

    // priority: 3 > 2 > 1
    mod.exports = exports = module.exports || ret || exports;
    tidyModuleData(mod);
    
    _events.load(mod);
    
    // exports will never be falsy
    return exports;
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
    dependencies = NR.makeArray(dependencies);
    
    _provide(dependencies, callback, {});
};


/**
 * @private
 * @param {Object} env environment for cyclic detecting and generating the uri of child modules
     {
         r: {string} the uri that its child dependent modules referring to
         n: {string} namespace of the current module
     }
 * @param {boolean=} noCallbackArgs whether callback method need arguments, for inner use
 */
function _provide(dependencies, callback, env, noCallbackArgs){
    var
    
    counter = dependencies.length,
    args = [NR],
    cb;

    if(NR.isFunction(callback)){
        cb = noCallbackArgs ?
            callback
        : 
            function(){
                callback.apply(NULL, args);
            };
    }

    dependencies.forEach(function(dep, i){
        var mod = getModById(dep, env);
        
        // if(isCyclic(env, mod.uri)){
        //     warning(120);
        // }
        
        registerModLoad(mod, function(){
            if(cb){
                -- counter;
            
                if(!noCallbackArgs){
                    args[i + 1] = createRequire(env)(dep);
                }
                
                if(counter === 0){
                    cb();
                }
            }
        });
    });
};


/**
 * provide 
 * method to provide a module
 * @private
 * @param {Object} mod
 * @param {function()} callback
 */
function registerModLoad(mod, callback){
    
    // if mod is ready, it will initialize its factory function
    mod.exports ?
        callback()
      : mod.p.push(callback);
        
    _events.provide(mod);
};


/**
 * specify the environment for every id that required in the current module
 * including
 * - reference uri which will be set as the current module's uri 
 
 * @param {Object} envMod mod
 */
function createRequire(env){
    return function(id){
        var mod = getModById(id, env);
        
        return mod.exports;
    };
};


/**
 * get a module by id. if not exists, it will be created 
 * @param {string} id
 * @param {Object} env the environment module
 */
function getModById(id, env){
    id = id.toLowerCase();
    
    if(env){
        // 'promo::index'   -> 'promo::index'
        // '~/index'        -> '<namespace>::index'
        // 'io/ajax'        -> 'io/ajax'
        id = realpath(id, env.id, env.ns);
    }
    
    return _mods[id] || (_mods[id] = {
        // @type {string} standard module identifier, must be something like:
        // 1. 'path/to/module'
        // 2. 'namespace::app/path/to/module'
        id  : id,
        
        // @type {Array.<function()>} pending callbacks
        p   : [],
        
        // @type {string=} namespace
        ns  : getModuleNamespaceById(id),
        
        // @type {boolean} true if the module is newly created, and has not been defined by `NR.define`
        _   : true
    });
};


/**
 * @param {string} id
 * @returns {string=}
 */
function getModuleNamespaceById(id){
    var idsplit = id.split(APP_NAMESPACE_SPLITTER);
    
    // 'promo::index' -> 'promo'
    // 'io/ajax' -> undefined
    return idsplit[1] && idsplit[0];
};


// free
// however, to keep the code clean, 
// tidy the data of a module at the final stage instead of each intermediate process    
function tidyModuleData(mod){
    mod.p.forEach(function(c){
        c();
    });
    
    mod.p.length = 0;
    
    delete mod.p;
    delete mod.ns;
    delete mod.f;
};


/**
 * module tools
 * --------------------------------------------------------------------------------------------------- */

// function isCyclic(env, uri) {
//    return uri && ( env.r === uri || env.p && isCyclic(env.p, uri) );
// };


/**
 * data santitizer
 * --------------------------------------------------------------------------------------------------- */


function makeSureObject(host, key){
    return host[key] || (host[key] = {});
};


/**
 * get the current directory from the location
 *
 * http://jsperf.com/regex-vs-split/2
 * vs: http://jsperf.com/regex-vs-split
 */
function dirname(uri){
    var m = uri.match(REGEX_DIR_MATCHER); // greedy match
    return (m ? m[0] : '.') + '/';
};


/**
 * Canonicalize path
 
 * realpath('a/b/c') ==> 'a/b/c'
 * realpath('a/b/../c') ==> 'a/c'
 * realpath('a/b/./c') ==> '/a/b/c'
 * realpath('a/b/c/') ==> 'a/b/c/'
 * realpath('a//b/c') ==> 'a//b/c'   - for 'a//b/c' is a valid uri
 */
function realpath(path, envModID, namespace) {

    // relative
    if(path.indexOf('./') === 0 || path.indexOf('../') === 0){
        var old = (dirname(envModID) + path).split('/'),
            ret = [];
            
        old.forEach(function(part, i){
            if (part === '..') {
                // if (ret.length === 0) {
                //      error(530);
                // }
                ret.pop();
                
            } else if (part !== '.') {
                ret.push(part);
            }
        });
        
        path = ret.join('/');
    
    // '~/index' -> '<namespace>::index'
    }else if(path.indexOf(APP_HOME_PREFIX) === 0){
        path = path.replace(APP_HOME_PREFIX, namespace + APP_NAMESPACE_SPLITTER);
    }
    
    // else, path will not be altered
    
    return path;
};


/**
 * @public
 * ---------------------------------------------------------------------------------- */

// use extend method to add public methods, 
// so that google closure will NOT minify Object properties

// define a module
NR['define'] = define;

// attach a module
NR['provide'] = provide;


})(NR, null);


/**
 change log:
 
 import ./ChangeLog.md;
 
 */