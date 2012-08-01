/** 
 * @preserve core:loader v5.0.1(passive mode)
 */
 
/**
 
 Passive Mode - a very simple version of loader, which
 
 1. No longer parse module identifier
 2. When user provide a module with its identifier, loader of passive mode only register callback function which relavant to the identifier into the pending queue. Once the module and its dependencies is defined, the callback function will execute immediately
 
 
 Functionalities:
 
 X? 1. provide a module according to a { id -> url } map
 2. emit module-load event after module defining
 
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
_apps_map = {},

/**
 * configurations:
 *     - CDNHasher
     - santitizer
     - allowUndefinedMod
 */
_config = {},

// @type {function()}
warning,
error,

Loader,
    
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
REGEX_IS_CSS = /\.css(?:$|#|\?)/i,

/**
 * abc/def        -> abc
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
    DI    : 1,

    // the module's source uri is downloading or executing
    // LD -> LOADING
    // LD    : 2,
    
    // the module has been explicitly defined. 
    // DD -> DEFINED
    DD     : 3,
    
    // being analynizing and requiring the module's dependencies
    // RQ -> REQUIRING
    RQ     : 4,
    
    // the module's factory function are ready to be executed
    // the module's denpendencies are set as STATUS.RD
    // RD -> READY
    RD     : 5 //,
    
    // the module already has exports
    // the module has been initialized, i.e. the module's factory function has been executed
    // ATTACHED      : 6
};


/**

 module definition in passive mode will be simple
 
 define('io/ajax', ['util/jsonp'], function(){});
 define('io/ajax', function(){});
 define('io/ajax', {});
 define('io/ajax', ['util/jsonp'], {}); --> forbidden!

 */


/**
 * module define
 * --------------------------------------------------------------------------------------------------- */

/**
 * method to define a module
 * @public
 * @param {string} identifier module identifier
 * @param {(Array.<string>|string)=} dependencies array of module names
 * @param {(string|function()|Object)=} factory
 *         {string}     the uri of a (packaged) module(s)
 *      {function}     the factory of a module
 *      {object}     module exports
 */
function define(identifier, dependencies, factory){
    // overload and tidy arguments
    // >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    
    // in passive mode, name must be the module identifier
    if(!K.isString(identifier)){
        return;
    }
    
    if(!K.isArray(dependencies)){             // -> define(factory);
        if(dependencies){
            factory = dependencies;
        }
        dependencies = undef;
    }
    
    _define(identifier, dependencies, factory);
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
function _define(identifier, dependencies, factory){
    /**    
     * @type {Object}
     * restore mod data {
             version:    {String=}    version
             status:        {Number}    module status
             uri:        {String}    source uri of module
             isCSS:        {Boolean=}    whether is css module
             
             // either of two
             factory:    {function}    factory function
             exports:    {Object}    module exports
         }
     */
    var mod = getMod(identifier);
    
    switch(K._type(factory)){
        case 'function':
            mod.f = factory;
            
            // if dependencies is explicitly defined, loader will never parse them from the factory function
            // so, to define a standalone module, you can set dependencies as []
            // if(!dependencies){
            //    dependencies = parseDependencies(factory);
            // }
            
            if(dependencies && dependencies.length){
                mod.s = STATUS.DD;
                
                // only if defined with factory function, can a module has dependencies
                mod.deps = tidyDependencies(mod, dependencies);
                
            }else{
                mod.s = STATUS.RD;
            }
            
            break;
            
        // define('io/ajax', {}); -> has no dependencies
        case 'object':
            mod.exports = factory;
            
            break;
            
        default:
            // fail silently
            return;
    }
    
    // if the module already has exports, tidy module datas
    if(mod.exports){
        tidyModuleData(mod);
       
    // if there's callback functions in pending queue, try to provide the current module
    }else if(mod.p.length){
        provideOne(mod);
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
        for_each(dependencies, function(dep, i){
            var mod = getMod(dep),
                arg_index = mod.isCSS ? 0 : ++ arg_counter;
            
            // if(isCyclic(env, mod.uri)){
            //     warning(120);
            // }
            
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
            });
        });
    }
};


/**
 * provideOne(for inner use)
 * method to provide a module, push its status to at least STATUS.ready
 * @param {Object} mod
 * @param {(function())=} callback
 */
function provideOne(mod, callback){ 
    var
    
    status = mod.s,
    _STATUS = STATUS;
    
    // Ready -> 5
    
    // if mod is ready, it will initialize its factory function
    if(mod.exports || (status === _STATUS.RD && generateExports(mod)) ){
        callback && callback();
      
    // Defined -> 3  
    }else if(status === _STATUS.DD){
        mod.s = _STATUS.RQ;
        callback && mod.p.push(callback);
        
        // recursively loading dependencies
        _provide(mod.deps, function(){
            mod.s = _STATUS.RD;
            generateExports(mod);
            
        }, mod, true);
        
    }else{
        callback && mod.p.push(callback);
    }
};


function tidyDependencies(mod, dependencies){
    var id = mod.id;
    
    for_each(dependencies, function(dep, i, deps){
        deps[i] = realpath(dep, id, mod.ns);
    });
    
    return dependencies;
};


/**
 * specify the environment for every id that required in the current module
 * including
 * - reference uri which will be set as the current module's uri 
 
 * @param {Object} envMod mod
 */
function createRequire(envMod){
    return function(id){
        var mod = getMod(realpath(id, envMod.id, envMod.ns));
        
        return mod.exports;
    };
};


/**
 * generate the exports if the module status is 'ready'
 */
function generateExports(mod){
    var exports = {},
        factory,
        ret;
        
    if(mod.s === STATUS.RD && K.isFunction(factory = mod.f) ){
    
        // to keep the object mod away from the executing context of factory,
        // use factory instead mod.f,
        // preventing user from fetching runtime data by 'this'
        ret = factory(K, createRequire(mod), exports);
        
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
        
        // {2} has higher priority
        if(ret){
            exports = ret;
        }
        
        mod.exports = exports;
        tidyModuleData(mod);
    }
    
    // exports will never be falsy
    return exports;
};


/**
 * get a module by id
 * @param {string=} version
 */
function getMod(id){
    id = id.toLowerCase();

    return _mods[id] || (_mods[id] = {
        id: id,
        
        // pending callbacks
        p: [],
        deps: [],
        ns: getModNamespaceById(id)
    });
};


function getModNamespaceById(id){
    var idsplit = id.split(APP_NAMESPACE_SPLITTER),
        namespace;
        
    if(idsplit[1]){
        namespace = idsplit[0];
    }
    
    return namespace;
};


function tidyModuleData(mod){
    // free
    // however, to keep the code clean, 
    // tidy the data of a module at the final stage instead of at each intermediate process
    
    for_each(mod.p, function(c){
        c();
    });
    
    clean_object_array(mod, 'p');
    clean_object_array(mod, 'deps');
    
    delete mod.ns;
    delete mod.f;
    delete mod.s;
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
 * Canonicalize path
 
 * realpath('a/b/c') ==> 'a/b/c'
 * realpath('a/b/../c') ==> 'a/c'
 * realpath('a/b/./c') ==> '/a/b/c'
 * realpath('a/b/c/') ==> 'a/b/c/'
 * #X realpath('a//b/c') ==> 'a/b/c' ?
 * realpath('a//b/c') ==> 'a//b/c'   - for 'a//b/c' is a valid uri
 */
function realpath(path, envModID, namespace) {
    if(path.indexOf('./') === 0 || path.indexOf('../') === 0){
        var old = (getDir(envModID) + path).split('/'),
            ret = [];
            
        for_each(old, function(part, i){
            if (part === '..') {
                if (ret.length === 0) {
                      error(530);
                }
                ret.pop();
                
            } else if (part !== '.') {
                ret.push(part);
            }
        });
        
        path = ret.join('/');
        
    }else if(path.indexOf(APP_HOME_PREFIX) === 0){
        path = path.replace(APP_HOME_PREFIX, namespace + APP_NAMESPACE_SPLITTER);
    }
    
    return path;
};


/**
 * @lang
 * ---------------------------------------------------------------------------------- */

/**
 * @param {Array} arr
 * @param {function()} fn 
 */
function for_each(arr, fn){
    var i = 0,
        len = arr.length;
        
    for(; i < len; i ++){
        fn.call(arr, arr[i], i, arr);
    }
};


/**
 * @param {Array} array
 */
function clean_object_array(obj, attr){
    var array = obj[attr];
    
    if(array){
        array.length = 0;
    }
    
    delete obj[attr];
};


/**
 * @public
 * ---------------------------------------------------------------------------------- */

// use extend method to add public methods, 
// so that google closure will NOT minify Object properties

// define a module
K['define'] = define;

K['define']._mods = _mods;

// attach a module
K['provide'] = provide;

// semi-private
// will be destroyed after configuration
K.__loader = Loader = {

    // no fault tolerance
    'config': function(cfg){
        // cfg.libBase = '/' + cfg.libBase;
        // cfg.appBase = '/' + cfg.appBase;
    
        _config = cfg;
        
        warning = cfg.warning;
        error = cfg.error;
        
        Loader['config'] = NOOP;
    }
};


// window._mods = _mods;

})(NR, null);


/**
 change log:
 
 import ./ChangeLog.md;
 
 */