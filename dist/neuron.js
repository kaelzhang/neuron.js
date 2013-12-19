/**
 * @preserve Neuron JavaScript Framework
 *   author i@kael.me
 */

// Goal
// 1. Implement safe native ecma5 methods for they are basic requirements which, nevertheless, is pluggable
// 2. Manage module dependencies and initialization 

// Non-goal
// > What neuron will never do
// 1. Neuron will never care about non-browser environment
// 2. Neuron core will never care about module loading

'use strict';

// version 3.5.4
// build 2013-12-19

// including sequence: see ../build.json


// @param {Object} ENV environment
// @param {undefined=} undefined
;(function(ENV, undefined){

var DOC = document;
var neuron = makeSureObject(ENV, 'neuron');



/**
 ECMAScript5 implementation
 ----
 
    - methods native object implemented
    - methods native object extends
 
 codes from mootools, MDC or by Kael Zhang
 
 Indexes
 ----
 
 ### Array.prototype
     - indexOf
     - lastIndexOf
     - filter
     - forEach
     - every
     - map
     - some
     - reduce
     - reduceRight
 
 ### Object
     - keys
     - create: removed
     
 ### String.prototype
     - trim
     - trimLeft
     - trimRight
 
 Specification
 ----
 
 ### STANDALONE language enhancement
 
    - always has no dependencies on Neuron
    - always follow ECMA standard strictly, including logic, exception type
    - throw the same error hint as webkit on a certain exception
 
 */


function extend(host, methods){
    for(var name in methods){
        if(!host[name]){
            host[name] = methods[name];
        }
    }
}


function implement(host, methods){
    extend(host.prototype, methods);
}


var TYPE_ERROR = TypeError;


// ref: https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array
implement(Array, {

// Accessor methods ------------------------
    
    indexOf: function (value, from) {
        var len = this.length >>> 0;
        
        from = Number(from) || 0;
        from = Math[from < 0 ? 'ceil' : 'floor'](from);
        
        if (from < 0) {
            from = Math.max(from + len, 0);
        }
        
        for (; from < len; from ++) {
            if (from in this && this[from] === value) {
                return from;
            }
        }
        
        return -1;
    },
    
    lastIndexOf: function (value, from) {
        var len = this.length >>> 0;
        
        from = Number(from) || len - 1;
        from = Math[from < 0 ? 'ceil' : 'floor'](from);
        
        if (from < 0) {
            from += len;
        }
        
        from = Math.min(from, len - 1);
        
        for (; from >= 0; from--) {
            if (from in this && this[from] === value) {
                return from;
            }
        }
        
        return -1;
    },


// Iteration methods -----------------------

    filter: function(fn, thisObject){
        var ret = [];
        for (var i = 0, len = this.length; i < len; i++){
        
            // Kael:
            // Some people might ask: "why we use a `i in this` here?".
            // ECMA:
            // > callback is invoked only for indexes of the array which have assigned values; 
            // > it is not invoked for indexes which have been deleted or which have never been assigned values
            
            // Besides, `filter` method is not always used with real Arrays, invocations below might happen:
            
            //     var obj = {length: 4}; obj[3] = 1;
            //     Array.prototype.filter.call({length: 4});
            //     Array.prototype.filter.call($('body'));
            
            // as well as the lines below
            if ((i in this) && fn.call(thisObject, this[i], i, this)){
                ret.push(this[i]);
            }
        }
        
        return ret;
    },

    forEach: function(fn, thisObject){
        for (var i = 0, len = this.length; i < len; i++){
            if (i in this){
            
                // if fn is not callable, it will throw
                fn.call(thisObject, this[i], i, this);
            }
        }
    },
    
    every: function(fn, thisObject){
        for (var i = 0, len = this.length; i < len; i++){
            if ((i in this) && !fn.call(thisObject, this[i], i, this)){
                return false;
            }
        }
        return true;
    },    

    map: function(fn, thisObject){
        var ret = [],
            i = 0,
            l = this.length;
            
        for (; i < l; i++){
        
            // if the subject of the index i is deleted, index i should not be contained in the result of array.map()
            if (i in this){
                ret[i] = fn.call(thisObject, this[i], i, this);
            }
        }
        return ret;
    },

    some: function(fn, thisObject){
        for (var i = 0, l = this.length; i < l; i++){
            if ((i in this) && fn.call(thisObject, this[i], i, this)){
                return true;
            }
        }
        return false;
    },

    reduce: function (fn) {
        if(typeof fn !== 'function') {
            throw new TYPE_ERROR(fn + ' is not an function');
        }
        
        var self = this,
            len = self.length >>> 0, 
            i = 0, 
            ret;
        
        if (arguments.length > 1) {
            ret = arguments[1];
            
        }else{
            do {
                if (i in self) {
                    ret = self[i++];
                    break;
                }
                
                // if array contains no values, no initial value to return
                if (++ i >= len) {
                    throw new TYPE_ERROR('Reduce of empty array with on initial value');
                }
            }while(true);
        }
        
        for (; i < len; i++) {
            if (i in self) {
                ret = fn.call(null, ret, self[i], i, self);
            }
        }
        
        return ret;
    },
    
    reduceRight: function (fn) {
        if(typeof fn !== 'function') {
            throw new TYPE_ERROR(fn + ' is not an function');
        }
        
        var self = this,
            len = self.length >>> 0, 
            i = len - 1, 
            ret;
        
        if (arguments.length > 1) {
            ret = arguments[1];
            
        }else {
            do {
                if (i in self) {
                    ret = self[i--];
                    break;
                }
                // if array contains no values, no initial value to return
                if (-- i < 0){
                    throw new TYPE_ERROR('Reduce of empty array with on initial value');
                }
            
            }while (true);
        }
        
        for (; i >= 0; i--) {
            if (i in self) {
                ret = fn.call(null, ret, self[i], i, self);
            }
        }
        
        return ret;
    }

});


extend(Object, {

    // ~ https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Object/create ~
    // create: function(o){
    //    if(o !== Object(o) && o !== null){
    //        throw new TYPE_ERROR('Object prototype may only be an Object or null');
    //    }
    
    //    function F() {}
    //    F.prototype = o;
          
    //    return new F();
    // },
    
    // refs:
    // http://ejohn.org/blog/ecmascript-5-objects-and-properties/
    // http://whattheheadsaid.com/2010/10/a-safer-object-keys-compatibility-implementation
    // https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Object/keys
    // https://developer.mozilla.org/en/ECMAScript_DontEnum_attribute
    // http://msdn.microsoft.com/en-us/library/adebfyya(v=vs.94).aspx
    keys: (function () {
        var hasOwnProperty = Object.prototype.hasOwnProperty,
            has_dontEnumBug = !{toString:''}.propertyIsEnumerable('toString'),
            
            // In some old browsers, such as OLD IE, keys below might not be able to iterated with `for-in`,
            // even if each of them is one of current object's own properties  
            NONT_ENUMS = [
                'toString',
                'toLocaleString',
                'valueOf',
                'hasOwnProperty',
                'isPrototypeOf',
                'propertyIsEnumerable',
                'constructor'
            ],
            
            NONT_ENUMS_LENGTH = NONT_ENUMS.length;
        
        return function (o) {
            if (o !== Object(o)) {
                throw new TYPE_ERROR('Object.keys called on non-object');
            }
            
            var ret = [],
                name;
            
            for (name in o) {
                if (hasOwnProperty.call(o, name)) {
                    ret.push(name);
                }
            }
                
            if (has_dontEnumBug) {
                for (var i = 0; i < NONT_ENUMS_LENGTH; i++) {
                    if (hasOwnProperty.call(o, NONT_ENUMS[i])) {
                        ret.push(NONT_ENUMS[i]);
                    }
                }
            }
            
            return ret;
        };
        
    })()
    
    // for our current OOP pattern, we don't reply on Object based inheritance
    // so Neuron has not implemented the methods of Object such as Object.defineProperty, etc.
});


implement(String, {
    trimLeft: function(){
        return this.replace(/^\s+/, '');
    },
    
    trimRight: function(){
        return this.replace(/\s+$/, '');
    },
    
    trim: function(){
        return this.trimLeft().trimRight();
    }
});



/**
 change log:
 
 2012-09-23  Kael:
 - remove implementation of Object.create, due to the failure of imitating ECMA standard with old JavaScript methods
 
 2012-09-22  Kael:
 TODO:
 X A. second argument of Object.create
 
 2012-09-21  Kael:
 - will no longer throw error if there're more than one parameters for Object.create, according to ECMA.
 
 2012-04-05  Kael:
 - use trimLeft and trimRight to do a entire trim
 
 2012-03-02  Kael:
 - Optimize the performance of String.trim method for IE who always do a bad work with regular expressions.
     It may even cause IE browsers(IE6-8) expectedly crash if use `/^\s+|\s+$/` to trim a big string which contains a lot of whitespaces.
 
 */

// common code slice
// ----
//     - constants
//     - common methods


// A very simple `mix` method
// copy all properties in the supplier to the receiver
// @param {Object} receiver
// @param {Object} supplier
// @returns {mixed} receiver
// function mix(receiver, supplier) {

//     if (receiver && supplier){

//         var c;

//         for (c in supplier) {
//             receiver[c] = supplier[c];
//         }
//     }

//     return receiver;
// }


// make sure `host[key]` is an object
// @param {Object} host
// @param {string} key 
function makeSureObject(host, key){
    return host[key] || (host[key] = {});
}

function isArray(obj){
    return Object.prototype.toString.call(obj) === '[object Array]';
}

function isObject(obj){
    return Object(obj) === obj;
}

/**
 * transform functions that have the signature fn(key, value)
 * to 
 * functions that could accept object arguments

 * @param {function()} fn
 */
// function overloadSetter(fn){

//     // @return {undefined} setter method will always return this, 
//     // for the sake of potential chain-style invocations
//     return function(key, value){

//         var k;
//         var ret = this;

//         if ( isObject(key) ){
//             for ( k in key ) {
//                 fn.call(this, k, key[k]);
//             }
            
//         }else if( typeof key === 'string' ){
        
//             // use apply instead of fn.call(self, key, value)
//             // so the overloaded function could receive more arguments
//             ret = fn.apply(this, arguments);
//         }
        
//         return ret;
//     };
// }


// A simple and imperfect `makeArray` method
// @param {mixed} array
//         should only use basic types
//         if nodelist, returns an array which generated from the nodelist
//         if Array, returns the array itself
//         otherwise, returns an array contains the subject
function makeArray(array){

    // if is already an array
    if(isArray(array)){
        return array;
    }

    // null and undefined are the unset value of object variable and primitive variable, so:
    // null         -> []
    // undefined    -> K.makeArray() -> []
    if(array == null){
        return [];
    }


    if(
        // false == null // false
        // false.length     -> undefined    -> [false]
        array.length != null &&
            
        // isObject(arguments) -> true(all browsers)
        
        // Object.prototype.toString.call(arguments);
        // -> [object Arguments]    if Chrome, IE >= 9, Firefox >= 4
        // -> [object Object]       if Firefox < 4, IE < 9
        isObject(array)
    ){
        return Array.prototype.slice.call(array);
    }

    return [array];
}




// ## Passive Mode - a very simple version of loader, which
// - event supported
// - No longer concern module loading or business configurations. All things could be done outside of loader.
// - No longer support directly define an object as module.exports
// - When user provide a module with its identifier, 
//     - loader of passive mode only register callback function which relavant to the identifier into the pending queue. 
//     - Once the module and its dependencies is defined, the callback function will execute immediately 
 
// ## Functionalities:
// 1. emit module-load event after module defining
// 2. provide event interface for each key sub-process

// CommonJS::Modules/Wrappings-Explicit-Dependencies    >> http://kael.me/-cmwed
// Google closure compiler advanced mode strict

// ## Naming Conventions
// `'a@1.0.0/relative'`

// ### package 
// The package which the current module belongs to: 'a@1.0.0'
// A package only contains `name` and `version` and the `'@'` as the splitter.

// ### module
// A package is consist of several modules.
// For example, `'a@1.0.0/relative'` is a module id(entifier)

// ### name
// Package name: 'a'

// ### version
// Package version: '1.0.0'

// stack, config or flag for modules
var loader = {};

// map -> identifier: module
var __mods = makeSureObject(loader, 'mods');


// module define
// ---------------------------------------------------------------------------------------------------

// Method to define a module, `define` has no fault tolerance in neuron 2.0,
// because `define` method is no longer designed for human to use.
// `define` should be generated by some develop environment such as [cortex](http://ctx.io)
// @private
 
// @param {string} identifier (optional) module identifier
// @param {Array.<string>} dependencies ATTENSION! dependencies must be array of standard module identifier
//  there will be fault tolerance for argument `dependencies`. be carefull!
// @param {function(...[number])} factory
 
// @returns {undefined=}
function define (identifier, dependencies, factory, options){
    if( 
        typeof identifier === 'string' && 
        isArray(dependencies) && 
        typeof factory === 'function'
    ){
        var mod = getModById(identifier);

        // a single module might be defined more than once.
        // use this trick to prevent module redefining, avoiding the subsequent side effect.
        // mod.f        -> already defined
        // mod.exports  -> the module initialization is done
        if( !mod.f && !mod.exports ){
            mod.f = factory;
            
            // if has dependencies
            if ( dependencies.length ) {
                
                // ['a@0.0.1']  -> {'a' -> 'a@0.0.1'}
                generateModuleVersionMap(dependencies, mod.v);
                if ( options && options.asyncDeps ) {
                    generateModuleVersionMap(options.asyncDeps, mod.v);
                }

                _provide(
                    dependencies,
                    function(){
                        generateExports(mod);
                    }, mod, true
                );
                
            }else{
                // for standalone modules, run factory immediately.
                generateExports(mod);
            }

            loader.emit('define', {
                mod: mod
            });
        }
    }
}


// 'ajax@0.0.1'
var STR_VERSION_SPLITTER = '@';

// @private
// create version info of the dependencies of current module into current sandbox
// @param {Array.<string>} modules no type detecting

// ['a@~0.1.0', 'b@~2.3.9']
// -> 
// {
//     a: '~0.1.0',
//     b: '~2.3.9'
// }
function generateModuleVersionMap (modules, host){
    modules.forEach(function(mod) {
        var name = mod.split(STR_VERSION_SPLITTER)[0];
        host[name] = mod;
    });
}


// \stable
// generate the exports if the module status is 'ready'
// @param {Object} mod
function generateExports (mod){
    var exports = {};
    var module = {
            exports: exports
        };

    // clean module properties, free memory

    // to keep the object mod away from the executing context of factory,
    // use `factory` instead `mod.f`,
    // preventing user from fetching runtime data by 'this'
    var factory = mod.f;
    factory(createRequire(mod), exports, module);
    delete mod.f;

    // during the execution of `factory`, `module.exports` might be changed
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
    
    // execute pending callbacks and clean
    mod.p.forEach(function(c){
        c();
    });
    mod.p.length = 0;
    delete mod.p;

    // never delete `mod.v`, coz `require` method might be executed after module factory executed

    //      module.exports = {
    //          abc: function() {
    //              return require('b'); 
    //          }
    //      }
    
    loader.emit('ready', {
        mod: mod
    });
}


// module load
// ---------------------------------------------------------------------------------------------------

var GLOBAL_ENV = {
    v: {}
};


// method to load a module
// @public
// @param {Array.<String>} dependencies
// @param {(function(...[number]))=} callback (optional)
function provide (dependencies, callback){
    dependencies = makeArray(dependencies);
    
    _provide(dependencies, callback, GLOBAL_ENV);
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
function _provide (dependencies, callback, env, noCallbackArgs, async){
    var counter = dependencies.length;
    var args = [];
    var cb;

    if(typeof callback === 'function'){
        cb = noCallbackArgs ?
            callback : 
            function(){
                callback.apply(null, args);
            };
    }

    dependencies.forEach(function(dep, i){
        if (dep) {
            var mod = getModById(dep, env);

            if ( async ) {
                mod.async = true;
            }

            registerModLoad(mod, function(){
                if(cb){
                    -- counter;
                
                    if(!noCallbackArgs){
                        args[i] = createRequire(env)(dep);
                    }
                    
                    if(counter === 0){
                        cb();
                        args.length = 0;
                        // prevent memleak
                        cb = callback = args = null;
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
function registerModLoad (mod, callback){
    var loaded = !!mod.exports;
    
    // if mod is ready, it will initialize its factory function
    loaded ?
        callback()
      : mod.p.push(callback);
    
    // everytime we encounter a module which is depended by the other module, `'use'` event fires 
    loader.emit('use', {
        mod: mod,

        // prevent duplicate loading
        // @type {boolean=} whether the module is already fetched, i.e. we don't need to fetch it from the remote server
        defined: loaded || !!mod.f
    });
}


// use the sandbox to specify the environment for every id that required in the current module 
// @param {Object} envMod mod
function createRequire (env){
    var require = function(id){
        return getModById(env.v[id] || id, env).exports;
    };

    require.async = function (dependencies, callback) {
        _provide(makeArray(dependencies), callback, env, false, true);
    };

    return require;
}


// get a module by id. if not exists, a ghost module(which will be filled after its first `define`) will be created
// @param {string} id
// @param {Object} env the environment module, 
function getModById (id, env){
    var parsed;

    // `env` exists, which means
    if ( env ) {
        // pathResolve('align', 'jquery')   -> 'jquery'
        // pathResolve('align', './')
        id = pathResolve(env.id, id);

        // 'a@1.0.0'    -> 'a@1.0.0'
        // 'a'          -> 'a@latest'
        // 'a/inner'    -> 'a@latest/inner'
        parsed = parseModuleId(id);

        // Suppose:
        // {
        //     'a': {
        //         '~1.2.3': '1.2.12'
        //     }
        // }

        // We route a package of certain range to a specific version, 
        // so several modules may point to a same exports

        // `NEURON_CONF` is generated by `loader.config`
        parsed.v = NEURON_CONF.transform(parsed.v, parsed.n);
        id = formatModuleId(parsed);

    } else {
        parsed = parseModuleId(id);
    }

    var mod = __mods[id];

    if ( !mod ) {
        // initialize transformed module
        mod = __mods[id] = {
            name    : parsed.n,
            version : parsed.v,
            path    : parsed.p,
            id      : id,
            pkg     : formatModulePkg(parsed),

            // @type {Array.<function()>} pending callbacks
            p       : [],
            // @type {Object} version map of the current module
            v       : {}
        };
    }

    return mod;
}


// 'a@1.2.3/abc' -> 
// ['a@1.2.3/abc', 'a', '1.2.3', '/abc']

//                    01            2         3
var REGEX_PARSE_ID = /^([^\/]+?)(?:@([^\/]+))?(\/.*)?$/;

// @param {string} resolved resolved module identifier
function parseModuleId (resolved) {
    var match   = resolved.match(REGEX_PARSE_ID);
    var name    = match[1];

    // 'a/inner' -> 'a@latest/inner'
    var version = match[2] || 'latest';
    var path    = match[3] || '';

    // There always be matches
    return {
        n: name,
        v: version,
        p: path
    };
}


function formatModulePkg (parsed){
    return parsed.n + STR_VERSION_SPLITTER + parsed.v;
}


function formatModuleId (parsed) {
    return formatModulePkg(parsed) + parsed.p;
}


// module tools
// ---------------------------------------------------------------------------------------------------

// greedy match:
var REGEX_DIR_MATCHER = /.*(?=\/.*$)/;

// get the current directory from the location
//
// http://jsperf.com/regex-vs-split/2
// vs: http://jsperf.com/regex-vs-split
function dirname (uri){
    var m = uri.match(REGEX_DIR_MATCHER);

    // abc/def  -> abc
    // abc      -> abc
    // abc/     -> abc
    return m ? m[0] : uri;
}


// Canonicalize path
// similar to path.resolve() of node.js
 
// pathResolve('a/b/c') ==> 'a/b/c'
// pathResolve('a/b/../c') ==> 'a/c'
// pathResolve('a/b/./c') ==> '/a/b/c'
// pathResolve('a/b/c/') ==> 'a/b/c/'
// pathResolve('a//b/c') ==> 'a//b/c'   - for 'a//b/c' is a valid uri
function pathResolve (from, to) {
    // relative
    if(to.indexOf('./') === 0 || to.indexOf('../') === 0){
        var old = (dirname(from) + '/' + to).split('/');
        var ret = [];
            
        old.forEach(function(part){
            if (part === '..') {
                ret.pop();
                
            } else if (part !== '.') {
                ret.push(part);
            }
        });
        
        to = ret.join('/');
    }
    
    return to;
}


// @public
// ----------------------------------------------------------------------------------

// event support
// mix(loader, Event);


/**
 change log:
 
 import ./ChangeLog.md;
 
 */



// @param {this} self
// @param {string} type
// @returns {Array.<function()>}
function getEventStorageByType(type){
    var storage = loader.__ev || (loader.__ev = {});
    
    return type ? storage[type] || (storage[type] = []) : [];
}


loader.on = function(type, fn){
    if(fn){
        var storage = getEventStorageByType(type);
        storage.push(fn);
    }

    return loader;
};
    
loader.emit = function(type, args){
    args = makeArray(args);
        
    getEventStorageByType(type).forEach(function(fn){
        fn.apply(this, args);
    }, loader);
};

/**
 change log
 
 2012-08-02  Kael:
 - improved the stablility of function overloading, prevent user mistakes
 - optimized calling chain
 
 2011-02-24  Kael:
 TODO:
 A. add .after and .before
 */
 
 

// <script 
// src="http://localhost:8765/mod/neuronjs/2.0.1/neuron.js" 
// id="neuron-js" 
// data-path="mod"
// data-server="localhost:8765"
// ></script>

var HEAD = DOC.getElementsByTagName('head')[0];

function loadJS(src){
    var node = DOC.createElement('script');
    
    node.src = src;
    node.async = true;

    jsOnload(node, function() {
        HEAD.removeChild(node); 
    });

    HEAD.insertBefore(node, HEAD.firstChild);
}


var jsOnload = DOC.createElement('script').readyState ?
    
    /**
     * @param {DOMElement} node
     * @param {!function()} callback asset.js makes sure callback is not null
     */
    function(node, callback){
        node.onreadystatechange = function(){
            var rs = node.readyState;
            if (rs === 'loaded' || rs === 'complete'){
                node.onreadystatechange = null;
                
                callback.call(this);
            }
        };
    } :
    
    function(node, callback){
        node.addEventListener('load', callback, false);
    };


// Manage configurations
// It is not the core functionalities of neuron, since this module.

// Never use `location.hash` to store configurations.
// Evil guys may use that to obtain user private informations or execute authorized commands
//      by using hash configurations to inject remote modules and sending these urls to
//      the other users

function configInCookie(){
    var match = DOC.cookie.match(/(?:^|;)\s*neuron=([^;]*)/);
    return match ? parseQuery(match[1]) : {};
}

// 'base=localhost'
function parseQuery(str){
    var obj = {};

    decodeURIComponent(str).split(',').forEach(function(key_value) {
        var pair = key_value.split('=');
        obj[pair[0]] = pair[1];
    });

    return obj;
}


var neuron_script = DOC.getElementById('neuron-js');


// Get a certain configuration by key name from the script node
// <script src="/dist/neuron.js" id="neuron-js" 
//      data-path="mod" 
//      data-server="localhost"
// ></script>
function configOnScriptNodeByKey(key) {
    return neuron_script.getAttribute('data-' + key);
}


function configByDefault() {
    var src = neuron_script.src;
    var index = src.indexOf('neuron');
    var base = src.substr(index);

    return {
        base: base,
        ns: ''
    };
}


function combineConfig(){
    var conf = configByDefault();
    var cookie_conf = configInCookie();

    Object.keys(CONF_ATTRIBUTES).forEach(function(key) {
        var checker;

        // Priority:
        // cookie > script attributes > default
        if( 
            (key in cookie_conf) && 
            (
                // Cookie is not safe relatively, sometimes we need special checking 
                !(checker = CONF_ATTRIBUTES[key].C) ||
                checker(cookie_conf[key])
            )
        ){
            conf[key] = cookie_conf[key];

        }else{
            var value = configOnScriptNodeByKey(key);

            if( value === '' || value === null ){
                value = conf[key];
            }

            conf[key] = value;
        }
    });

    return conf;
}


// Ref: [semver](http://semver.org/)
// note that we must use '\-' rather than '-', becase '-' presents a range within brackets
var REGEX_MATCH_SERVER = /^(\D*)((\d+)\.(\d+))\.(\d+)([a-z0-9\.\-+]*)$/i;
//                       0  1   2 3      4       5    6              

// @returns {Object} parsed semver object
function parseSemver (version) {
    if ( Object(version) === version ) {
        return version;
    }

    var ret = null;

    if ( version ) {
        ret = {
            origin: version
        };

        var match = version.match(REGEX_MATCH_SERVER);
    
        // For example:
        // '~1.3.9-alpha/lang'
        if ( match ) {
            ret.decorator = match[1];

            // minor version
            // '1.3'
            ret.vminor  = match[2];

            // ret.major = match[3];
            // ret.minor = match[4];
            // ret.patch = match[5];

            // // version.extra contains `-<pre-release>+<build>`
            // ret.extra = match[6];
        }
    }

    return ret;
}


var neuron_loaded = [];
var NEURON_CONF = {
    loaded: neuron_loaded,

    // By default, we only cook ranges
    transform: function (version) {
        var parsed = parseSemver(version);
        return parsed.decorator ? 
            // '~1.2.3'     -> '~1.2.0'
            parsed.decorator + parsed.vminor + '.0' :
            // '1.2.3'      -> '1.2.3'
            version;
    }
};


var range_map = {};

function rangeMapping (range, name) {
    var ranges = range_map[name] || {};
    return ranges[range] || 

        // if `range` is a normal version, or not specified, remain the origin.
        range;
}


var LOCALHOST = '://localhost';

var CONF_ATTRIBUTES = {

    // The server where loader will fetch modules from
    // if use `'localhost'` as `base`, switch on debug mode
    path: {
        // Setter function
        S: function(path) {
            if(~ path.indexOf(LOCALHOST)){
                NEURON_CONF.debug = true;
            }

            // remove ending slash(`/`)
            return path.replace(/\/+$/, '');
        },

        // Cookie checker
        C: function(path) {

            // For the sake of security, 
            // we only support to set path to '%://localhost%' in cookie.
            // If there's a XSS bug in a single page, 
            // attackers could use this cookie to redirect all javascript module to anything they want
            return ~ path.indexOf(LOCALHOST);
        }
    },

    // We don't allow this, just use facade configurations and manage it on your own
    // 'vars',
    // var: {
    // },

    // By default, the public methods of neuron will be exploded to global context.
    // But you can force neuron to mix certain methods to a certain namespace.
    // If the namespace is not exists, neuron will initialize it as an empty object.
    ns: {
        S: function(ns) {

            // ''       -> [window]
            // 'NR'     -> ['NR']       -> [window.NR]
            // 'NR,'    -> ['NR', '']   -> [window.NR, window]
            ns = typeof ns === 'string' ? ns.split('|').map(function(name) {
                        return name && makeSureObject(ENV, name) || ENV;
                    }) : 
                    isArray(ns) ? ns :
                        [];

            // There should always be a `neuron` namespace
            if ( ! ~ ns.indexOf(neuron) ) {
                ns.push(neuron);
            }

            return ns;
        }
    },

    loaded: {
        S: function (loaded) {
            neuron_loaded = neuron_loaded.concat(loaded);
        },

        C: function (){
            return false;
        }
    },

    ranges: {
        S: function (map) {
            if ( map ) {
                NEURON_CONF.transform = rangeMapping;
                range_map = map;
            }
        },

        C: function(){
            return false
        }
    }
};


// If is not an array, split it
// @returns {Array}
function splitIfNotArray(subject) {
    if(typeof subject === 'string'){
        return subject.split('|').filter(Boolean);

    }else{
        return makeArray(subject);
    }
}


function config(conf) {
    var key;
    var value;

    for(key in conf){
        if(key in CONF_ATTRIBUTES){
            value = CONF_ATTRIBUTES[key].S( conf[key] );
            if(value !== undefined){
                NEURON_CONF[key] = value;
            }
        }
    }
}

loader.config = config;
config( combineConfig() );

function hasher(str){
    return str.length % 3 + 1;
}

// server: 'http://localhost/abc',
// -> http://localhost/abc/<relative>

// @param {string} relative relative module url
function absolutizeURL(relative) {
    return NEURON_CONF.path.replace( '{n}', hasher(relative) ) + '/' + relative;
};


// Generate absolute url of a certain id
// @param {string} id, standard identifier, such as '<name>@<version>'
function generateModuleURL(mod){
    var rel = (
        mod.async && mod.path ? 
            // if is an async module, we will load the source file by module id
            mod.id : 

            // if is a normal module, we will load the source file by package
            
            // 1.
            // on use: 'a@1.0.0' (async or sync)
            // -> 'a/1.0.0/a.js'

            // 2.
            // on use: 'a@1.0.0/relative' (sync)
            // -> not an async module, so the module is already packaged inside:
            // -> 'a/1.0.0/a.js'
            mod.pkg + '/' + mod.name

    ).replace('@', '/') + '.js';

    return absolutizeURL(rel);
}


// Load the script file of a module into the current document
// @param {string} id module identifier
function loadByModule(mod) {
    var id = mod.id;
    if(! ~ neuron_loaded.indexOf(id) ){
        neuron_loaded.push(id);
        neuron._load( generateModuleURL(mod) );
    }
}


loader.on('use', function(e) {
    !e.defined && loadByModule(e.mod);
});



// Explode public methods

/**
 * Attach a module for business facade, for configurations of inline scripts
 * if you want a certain biz module to be initialized automatically, the module's exports should contain a method named 'init'
 * @usage: 
 <code>
     // require biz modules with no config
     facade('app-main-citylist', 'app-main-header-bar');
 
     // require biz modules with configs
     facade('app-main-citylist', {
         mod: 'app-main-header-bar',
         data: {
             icon: 'http://kael.me/u/2012-03/icon.png'
         }
     });
 
 </code>
 */
function facade(item){
    Object(item) === item && provide(item.mod, function(method){
        method.init && method.init(item.data);
    });
}


NEURON_CONF.ns.forEach(function(host) {
    host.define = define;
    host.facade = facade;
    host.loader = loader;

    // private methods only for testing
    // avoid using this method in product environment
    host._use = provide;
    host._load = loadJS;
});


NEURON_CONF.ns.length = 0;




// Simply use `this`, and never detect the current environment
})(this);

