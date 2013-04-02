/** 
 * @preserve core:loader v6.0.0 (promise)
 */
 
// Passive Mode - a very simple version of loader, which
 
// 1. event supported
// 2. No longer concern module loading or business configurations. All things could be done outside of loader.
// 3. No longer parse module identifier
// 4. When user provide a module with its identifier, 
//  loader of passive mode only register callback function which relavant to the identifier into the pending queue. 
//  Once the module and its dependencies is defined, the callback function will execute immediately 
 
// Functionalities:

// 1. emit module-load event after module defining
// 2. provide event interface for each key sub-process


; // fix layout of UglifyJS


// CommonJS::Modules/Wrappings-Explicit-Dependencies    >> http://kael.me/-cmwed
// Google closure compiler advanced mode strict


;(function(NR){

// stack, config or flag for modules
var loader = makeSureObject(NR._env, 'loader');

// map -> identifier: module
var _mods = makeSureObject(loader, 'mods');

// @const
var APP_HOME_PREFIX = '~/';
// var DEFAULT_NAMESPACE = '~';

// ex: Checkin::index
var APP_NAMESPACE_SPLITTER = '::';

// abc/def        -> abc
var REGEX_DIR_MATCHER = /.*(?=\/.*$)/;


// module define
// ---------------------------------------------------------------------------------------------------

// method to define a module
function define(identifier, dependencies, factory){
    if(typeof identifier === 'string' && NR.isArray(dependencies) && NR.isFunction(factory) ){
        _define(identifier, dependencies, factory);
    }
};


// method to define a module, `define` has no fault tolerance in neuron 2.0
// @private
 
// @param {string} identifier (optional) module identifier
// @param {Array.<string>} dependencies
// @param {function(...[number])} factory
 
// @returns {undefined=}s
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
    
    loader.fire('define', mod);
};


// generate the exports if the module status is 'ready'
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
    
    loader.fire('load', mod);
    // _events.load(mod);
    
    // exports will never be falsy
    return exports;
};


// module load
// ---------------------------------------------------------------------------------------------------
 

// method to load a module
// @public
// @param {Array.<String>} dependencies
// @param {(function(...[number]))=} callback (optional)
function provide(dependencies, callback){
    dependencies = NR.makeArray(dependencies);
    
    _provide(dependencies, callback, {});
};


// @private
// @param {Object} env environment for cyclic detecting and generating the uri of child modules
//     {
//         r: {string} the uri that its child dependent modules referring to
//         n: {string} namespace of the current module
//     }
// @param {boolean=} noCallbackArgs whether callback method need arguments, for inner use

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
                callback.apply(null, args);
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


// provide 
// method to provide a module
// @private
// @param {Object} mod
// @param {function()} callback
function registerModLoad(mod, callback){
    
    // if mod is ready, it will initialize its factory function
    mod.exports ?
        callback()
      : mod.p.push(callback);
        
    loader.fire('provide', mod);
};


// specify the environment for every id that required in the current module
// including
// - reference uri which will be set as the current module's uri 
 
// @param {Object} envMod mod
function createRequire(env){
    return function(id){
        var mod = getModById(id, env);
        
        return mod.exports;
    };
};


// get a module by id. if not exists, it will be created 
// @param {string} id
// @param {Object} env the environment module
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


// @param {string} id
// @returns {string=}
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


// module tools
// ---------------------------------------------------------------------------------------------------

// function isCyclic(env, uri) {
//    return uri && ( env.r === uri || env.p && isCyclic(env.p, uri) );
// };


// data santitizer
// ---------------------------------------------------------------------------------------------------


function makeSureObject(host, key){
    return host[key] || (host[key] = {});
};


// get the current directory from the location
//
// http://jsperf.com/regex-vs-split/2
// vs: http://jsperf.com/regex-vs-split
function dirname(uri){
    var m = uri.match(REGEX_DIR_MATCHER); // greedy match
    return (m ? m[0] : '.') + '/';
};


// Canonicalize path
 
// realpath('a/b/c') ==> 'a/b/c'
// realpath('a/b/../c') ==> 'a/c'
// realpath('a/b/./c') ==> '/a/b/c'
// realpath('a/b/c/') ==> 'a/b/c/'
// realpath('a//b/c') ==> 'a//b/c'   - for 'a//b/c' is a valid uri

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


// @public
// ----------------------------------------------------------------------------------

// event support
NR.mix(loader, NR.Class.EXTS.events);

// use extend method to add public methods, 
// so that google closure will NOT minify Object properties

// define a module
NR['define'] = define;

// attach a module
NR['provide'] = provide;


})(NR);


/**
 change log:
 
 import ./ChangeLog.md;
 
 */