/** 
 * @preserve core:loader v6.0.0 (promise)
 */
 
// Passive Mode - a very simple version of loader, which
 
// - event supported
// - No longer concern module loading or business configurations. All things could be done outside of loader.
// - No longer parse module identifier
// - No longer support anonymous module definition
// - No longer support directly define an object as module.exports
// - When user provide a module with its identifier, 
//     - loader of passive mode only register callback function which relavant to the identifier into the pending queue. 
//     - Once the module and its dependencies is defined, the callback function will execute immediately 
 
// Functionalities:

// 1. emit module-load event after module defining
// 2. provide event interface for each key sub-process

// CommonJS::Modules/Wrappings-Explicit-Dependencies    >> http://kael.me/-cmwed
// Google closure compiler advanced mode strict


// stack, config or flag for modules
var loader = makeSureObject(NR, 'Loader');

// map -> identifier: module
var __mods = makeSureObject(loader, 'mods');

// abc/def        -> abc
var REGEX_DIR_MATCHER = /.*(?=\/.*$)/;

// 'ajax@0.0.1'
var STR_VERSION_SPLITTER = '@';


// module define
// ---------------------------------------------------------------------------------------------------

// method to define a module, `define` has no fault tolerance in neuron 2.0
// @private
 
// @param {string} identifier (optional) module identifier
// @param {Array.<string>} dependencies
// @param {function(...[number])} factory
 
// @returns {undefined=}
function define(identifier, dependencies, factory){
    if(typeof identifier === 'string' && isArray(dependencies) && isFunction(factory) ){
        var mod = getModById(identifier);
    
        // a single module might be defined more than once.
        // use this trick to prevent module redefining, avoiding the subsequent side effect
        if(mod._){
            delete mod._;
            
            mod.f = factory;
            
            if ( dependencies.length ) {
                _provide(
                    dependencies,
                    function(){
                        generateExports(mod);
                    }, mod, true
                );

                generateModuleVersionMap(dependencies, mod.v);

            }else{
                generateExports(mod);
            }
        }
        
    }
}


// @private
// @param {Array.<string>} modules no type detecting
function generateModuleVersionMap(modules, host){
    modules.forEach(function(mod) {
        var name = mod.split(STR_VERSION_SPLITTER)[0];
        host[name] = mod;
    });
}


// generate the exports if the module status is 'ready'
// @param {Object} mod
function generateExports(mod){
    var exports = {};
    var module = {
            exports: exports
        };

    var factory = mod.f;
        
    // to keep the object mod away from the executing context of factory,
    // use `factory` instead `mod.f`,
    // preventing user from fetching runtime data by 'this'
    factory(createRequire(mod), exports, module);
        
    // exports:
    // TWO ways to define the exports of a module
    // 1. 
    // exports.method1 = method1;
    // exports.method2 = method2;

    // 2.
    // module.exports = {
    //        method1: method1,
    //        method2: method2
    // }

    // priority: 2 > 1
    mod.exports = module.exports;
    tidyModuleData(mod);
    
    loader.fire('load', mod);
}


// module load
// ---------------------------------------------------------------------------------------------------
 

// method to load a module
// @public
// @param {Array.<String>} dependencies
// @param {(function(...[number]))=} callback (optional)
function provide(dependencies, callback){
    dependencies = makeArray(dependencies);
    
    _provide(dependencies, callback, {});
}


// @private
// @param {Array.<String>} dependencies
// @param {(function(...[number]))=} callback (optional)
// @param {Object} env environment for cyclic detecting and generating the uri of child modules
//     {
//         r: {string} the uri that its child dependent modules referring to
//         n: {string} namespace of the current module
//     }
// @param {boolean=} noCallbackArgs whether callback method need arguments, for inner use
function _provide(dependencies, callback, env, noCallbackArgs){
    var counter = dependencies.length;
    var args = [NR];
    var cb;

    if(isFunction(callback)){
        cb = noCallbackArgs ?
            callback
        : 
            function(){
                callback.apply(null, args);
            };
    }

    dependencies.forEach(function(dep, i){
        if (dep) {
            var mod = getModById(dep, env);
        
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
        }
    });
}


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
}


// specify the environment for every id that required in the current module
// including
// - reference uri which will be set as the current module's uri 
 
// @param {Object} envMod mod
function createRequire(env){
    return function(id){
        var mod = getModById(env.v[id] || id, env);
        
        return mod.exports;
    };
}


// get a module by id. if not exists, it will be created 
// @param {string} id
// @param {Object} env the environment module
function getModById(id, env){
    id = id.toLowerCase();
    
    if(env){

        // 'promo::index'   -> 'promo::index'
        // 'io/ajax'        -> 'io/ajax'
        id = realpath(id, env.id);
    }
    
    return __mods[id] || (__mods[id] = {
        // @type {string} standard module identifier, must be something like:
        //  'path/to/module'
        id  : id,
        
        // @type {Array.<function()>} pending callbacks
        p   : [],
        
        // 
        v   : {},

        // @type {boolean} true if the module is newly created, and has not been defined by `NR.define`
        _   : true
    });
}


// @param {string} id
// @returns {string=}
// function getModuleNamespaceById(id){
//    var idsplit = id.split(APP_NAMESPACE_SPLITTER);
    
    // 'promo::index' -> 'promo'
    // 'io/ajax' -> undefined
//    return idsplit[1] && idsplit[0];
// };


// free
// however, to keep the code clean, 
// tidy the data of a module at the final stage instead of each intermediate process    
function tidyModuleData(mod){
    mod.p.forEach(function(c){
        c();
    });
    
    mod.p.length = 0;
    
    delete mod.p;
    delete mod.f;
}


// module tools
// ---------------------------------------------------------------------------------------------------

// function isCyclic(env, uri) {
//    return uri && ( env.r === uri || env.p && isCyclic(env.p, uri) );
// };


// get the current directory from the location
//
// http://jsperf.com/regex-vs-split/2
// vs: http://jsperf.com/regex-vs-split
function dirname(uri){
    var m = uri.match(REGEX_DIR_MATCHER); // greedy match
    return (m ? m[0] : '.') + '/';
}


// Canonicalize path
 
// realpath('a/b/c') ==> 'a/b/c'
// realpath('a/b/../c') ==> 'a/c'
// realpath('a/b/./c') ==> '/a/b/c'
// realpath('a/b/c/') ==> 'a/b/c/'
// realpath('a//b/c') ==> 'a//b/c'   - for 'a//b/c' is a valid uri

function realpath(path, env_id) {

    // relative
    if(path.indexOf('./') === 0 || path.indexOf('../') === 0){
        var old = (dirname(env_id) + path).split('/'),
            ret = [];
            
        old.forEach(function(part){
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
    }
    
    return path;
}


// @public
// ----------------------------------------------------------------------------------

// event support
mix(loader, NR._Event);

// use extend method to add public methods, 
// so that google closure will NOT minify Object properties

// define a module
NR.define = define;

// attach a module
NR.provide = provide;

/**
 * attach a module for business requirement, for configurations of inline scripts
 * if wanna a certain biz module to automatically initialized, the module's exports should contain a method named 'init'
 * @usage: 
 <code>
     
     // require biz modules with no config
     NR.require('Index::common', 'Index::food');
 
     // require biz modules with configs
     NR.require('Index::common', {
         mod: 'Index::food',
         config: {
             icon: 'http://kael.me/u/2012-03/icon.png'
         }
     });
 
 </code>
 */
NR.require = function(){
    makeArray(arguments).forEach(function(module){
        if(typeof module === 'string'){
            module = {
                mod: module
            };
        }
        
        module && provide(module.mod, function(K, method){
            method.init && method.init(module.config);
        });
    });
};


/**
 change log:
 
 import ./ChangeLog.md;
 
 */