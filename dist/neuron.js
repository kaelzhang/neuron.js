/**
 * @preserve Neuron JavaScript Framework
 *   author i@kael.me
 */

 'use strict';

// version 2.0.1
// build 2013-06-14

// including sequence: see ../build.json


// @param {Object} ENV environment
// @param {undefined=} undefined
;(function(ENV, undefined){



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

    reduce: function (fn /* [, initialValue ] */) {
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
    
    reduceRight: function (fn /* [, initialValue ] */) {
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


// module seed

var NR = makeSureObject(ENV, 'NR');

/**
 * build time will be replaced when packaging and compressing
 */
// NR.build = '2.0.1 2013-06-14';

// common code slice
// ----
//     - constants
//     - common methods

// var DOC = ENV.document;
// var EMPTY = '';


// no-operation
// function NOOP(){};


// A very simple `mix` method
// copy all properties in the supplier to the receiver
// @param {Object} receiver
// @param {Object} supplier
// @returns {mixed} receiver
function mix(receiver, supplier) {

    if (receiver && supplier){

        var c;

        for (c in supplier) {
            receiver[c] = supplier[c];
        }
    }

    return receiver;
}


// make sure `host[key]` is an object
// @param {Object} host
// @param {string} key 
function makeSureObject(host, key){
    return host[key] || (host[key] = {});
}


var OP_toString = Object.prototype.toString;

function isArray(obj){
    return OP_toString.call(obj) === '[object Array]';
}

function isFunction(obj){
    return OP_toString.call(obj) === '[object Function]';
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
function overloadSetter(fn){

    // @return {undefined} setter method will always return this, 
    // for the sake of potential chain-style invocations
    return function(key, value){

        var k;
        var ret = this;

        if ( isObject(key) ){
            for ( k in key ) {
                fn.call(this, k, key[k]);
            }
            
        }else if( typeof key === 'string' ){
        
            // use apply instead of fn.call(self, key, value)
            // so the overloaded function could receive more arguments
            ret = fn.apply(this, arguments);
        }
        
        return ret;
    };
}


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
            
        // NR.isObject(arguments) -> true(all browsers)
        
        // Object.prototype.toString.call(arguments);
        // -> [object Arguments]    if Chrome, IE >= 9, Firefox >= 4
        // -> [object Object]       if Firefox < 4, IE < 9
        isObject(array)
    ){
        return Array.prototype.slice.call(array);
    }


    return [array];
}


// @private
// function definePrivateProperty(obj, key, value){
//     if(Object.defineProperty){
//         Object.defineProperty(obj, key, {
//           enumerable: false,
//           configurable: false,
//           writable: false,
//           value: value
//         });

//     }else{
//         obj[key] = value;
//     }
// };





/**
 * Preset of Class Extensions: 'events'
 */

// @returns {Object}
function getEventStorage(host){
    return host.__ev || (host.__ev = {});
}


// @param {this} self
// @param {string} type
// @returns {Array.<function()>}
function getEventStorageByType(host, type){
    var storage = getEventStorage(host);
    
    return type ? storage[type] || (storage[type] = []) : [];
}


var Event = {
    on: overloadSetter(function(type, fn){
        if(isFunction(fn)){
            var storage = getEventStorageByType(this, type);
            
            storage.push(fn);
        }
    
        return this;
    }),
    
    off: function(type, fn){
        var self = this;
        var args = arguments;
        var storage;
        var s;
        
        // remove all attached events
        // only deal with .off()
        if(!args.length){
            storage = getEventStorage(this);
            
            for(type in storage){
                s = storage[type];
                s && (s.length = 0);
            }
            
            return self;
        }
        // else:
        // ignore: .off(undefined, undefined)
        // invocation like .off(undefined, undefined) shall be ignored, which must be a runtime logic exception
        
        
        // ignore: .off(undefined, fn);
        // ignore: .off(undefined)
        if(typeof type === 'string'){
            s = getEventStorageByType(self, type);
            
            // .off(type)
            if(args.length === 1){
                s.length = 0;
            
            // .off(type, fn)
            
            // ignore: .off(type, undefined)
            }else if(isFunction(fn)){
                for(var i = 0, len = s.length; i < len; i ++){
                    if(s[i] === fn){
                        s.splice(i, 1);
                    }
                }
            }
        }
        
        return self;
    },
    
    fire: function(type, args){
        var self = this;
        
        if(typeof type === 'string'){
            args = makeArray(args);
            
            getEventStorageByType(self, type).forEach(function(fn){
                fn.apply(self, args);
            });
        }
        
        return self;
    }
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
var Loader = makeSureObject(NR, 'Loader');

// map -> identifier: module
var __mods = makeSureObject(Loader, 'mods');


// module define
// ---------------------------------------------------------------------------------------------------

// method to define a module, `define` has no fault tolerance in neuron 2.0
// @private
 
// @param {string} identifier (optional) module identifier
// @param {Array.<string>} dependencies ATTENSION! dependencies must be array of standard module identifier
//  there will be fault tolerance for argument `dependencies`. be carefull!
// @param {function(...[number])} factory
 
// @returns {undefined=}
function define(identifier, dependencies, factory){
    if(typeof identifier === 'string' && isArray(dependencies) && isFunction(factory) ){
        var mod = getModById(identifier);

        // a single module might be defined more than once.
        // use this trick to prevent module redefining, avoiding the subsequent side effect.
        // mod.f        -> already defined
        // mod.exports  -> the module initialization is done
        if(!mod.f && !mod.exports){
            mod.f = factory;
            
            // if has dependencies
            if ( dependencies.length ) {
                _provide(
                    dependencies,
                    function(){
                        generateExports(mod);
                    }, mod, true
                );

                // ['a@0.0.1']  -> {'a' -> 'a@0.0.1'}
                generateModuleVersionMap(dependencies, mod.v);
            }else{
                // for standalone modules, run factory immediately.
                generateExports(mod);
            }

            Loader.fire('define', {
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
    
    Loader.fire('ready', {
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
function provide(dependencies, callback){
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
function _provide(dependencies, callback, env, noCallbackArgs){
    var counter = dependencies.length;
    var args = [];
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
function registerModLoad(mod, callback){
    var loaded = !!mod.exports;
    
    // if mod is ready, it will initialize its factory function
    loaded ?
        callback()
      : mod.p.push(callback);
    
    // everytime we encounter a module which is depended by the other module, `'use'` event fires 
    Loader.fire('use', {
        mod: mod,

        // prevent duplicate loading
        // @type {boolean=} whether the module is already fetched, i.e. we don't need to fetch it from the remote server
        defined: loaded || !!mod.f
    });
}


// use the sandbox to specify the environment for every id that required in the current module 
// @param {Object} envMod mod
function createRequire(env){
    return function(id){
        return getModById(env.v[id] || id, env).exports;
    };
}


// get a module by id. if not exists, a ghost module(which will be filled after its first `define`) will be created
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
        // @type {string} standard module identifier
        id  : id,
        
        // @type {Array.<function()>} pending callbacks
        p   : [],
        
        // @type {Object} version map of the current module
        v   : {}
    });
}


// module tools
// ---------------------------------------------------------------------------------------------------

// greedy match:
var REGEX_DIR_MATCHER = /.*(?=\/.*$)/;

// get the current directory from the location
//
// http://jsperf.com/regex-vs-split/2
// vs: http://jsperf.com/regex-vs-split
function dirname(uri){
    var m = uri.match(REGEX_DIR_MATCHER);

    // abc/def  -> abc
    // abc      -> abc
    return m ? m[0] : uri;
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
        var old = (dirname(env_id) + '/' + path).split('/'),
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
mix(Loader, Event);


/**
 change log:
 
 import ./ChangeLog.md;
 
 */

// <script 
// src="http://localhost:8765/mod/neuronjs/2.0.1/neuron.js" 
// id="neuron-js" 
// data-path="mod"
// data-server="localhost:8765"
// ></script>

var DOC = document;
var HEAD = DOC.getElementsByTagName('head')[0];

var neuron_script = DOC.getElementById('neuron-js');

// '' -> 'mod/'
// 'mod' -> 'mod/'
var path = ( neuron_script.getAttribute('data-path') || 'mod' ).replace(/\/$/, '') + '/';
var server = neuron_script.getAttribute('data-server');
var RETRY_TIMEOUT = 3000;
var MAX_RETRY_TIMES = 3;

if(server){
    server = parseServer(server);
}

function parseServer(server){
    if(server.indexOf('://') === -1){
        server = 'http://' + server;
    }

    // remove ending '/'
    return server.replace(/\/$/, '');
}


function hasher(str){
    return str.length % 3 + 1;
}


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


var absolutizeURL = !server || path.indexOf('../') === 0 || path.indexOf('./') === 0 ?

    // if relative path, or no server specified
    // server: 'http://localhost', path: '../abc/'
    // -> ../abc/<rel>

    // server: undefined, path: 'abc/'
    // -> abc/<rel>
    function(rel) {
        return path + rel;
    } :

    // server: 'http://localhost',
    // path: 'abc/'
    // -> http://localhost/abc/<rel>
    function(rel) {
        return server.replace( '{n}', hasher(rel) ) + '/' + path + rel;
    };


function generateModuleURL(id){
    var info = id.split('@');

    if(!info[1]){
        info[1] = 'latest';
    }

    // TODO:
    // if version -> 'latest', add timestamp
    var rel = info.join('/') + '/index.js';

    return absolutizeURL(rel);
}


function loadModuleAndSetTimout(id){
    loadJS( generateModuleURL(id) );

    if( retry_counters[id] > 0){
        console.log('timeout load', id);
    }

    if(!(id in retry_counters) ){
        retry_counters[id] = 1;
    }

    if(retry_counters[id] ++ <= MAX_RETRY_TIMES){
        retry_timers[id] = setTimeout(function(){
            loadModuleAndSetTimout(id);

        }, RETRY_TIMEOUT);
    }
};


var retry_timers = {};
var retry_counters = {};

NR.Loader.on({
    use: function(e) {
        !e.defined && loadModuleAndSetTimout(e.mod.id);
    },

    define: function(e) {
        clearTimeout( retry_timers[e.mod.id] );
    }
});






ENV.define = NR.define = define;

// avoid using this method in product environment
ENV.use = NR.use = provide;

/**
 * attach a module for business requirement, for configurations of inline scripts
 * if wanna a certain biz module to automatically initialized, the module's exports should contain a method named 'init'
 * @usage: 
 <code>
     
     // require biz modules with no config
     facade('Index::common', 'Index::food');
 
     // require biz modules with configs
     facade('Index::common', {
         mod: 'Index::food',
         data: {
             icon: 'http://kael.me/u/2012-03/icon.png'
         }
     });
 
 </code>
 */
ENV.facade = NR.facade = function(){
    makeArray(arguments).forEach(function(module){
        if(typeof module === 'string'){
            module = {
                mod: module
            };
        }
        
        module && provide(module.mod, function(method){
            method.init && method.init(module.data);
        });
    });
};

})(this);

