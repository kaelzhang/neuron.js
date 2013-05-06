/**
 * @preserve Neuron JavaScript Framework & Library
 *   author i@kael.me
 */

// version 0.2.1
// build 2013-05-06

// including sequence: see ../build.json


// @param {Object} ENV environment
// @param {undefined=} undefined
;(function(ENV, undefined){




// module seed

var NR = makeSureObject(ENV, 'NR');

/**
 * build time will be replaced when packaging and compressing
 */
NR.build = '%buildtime%';


/**
 
 --------------------------------------------------
 [1] NR.isPlainObject will accept instances created by new myClass, but some libs don't, such as jQuery of whose strategy is dangerous, I thought.
 for example:
 suppose somebody, a newbie, wrote something like this:
 <code>
     Object.prototype.destroyTheWorld = true;
     NR.isPlainObject({}); // true
 </code>
 
 if use jQuery: (at least up to 1.6.4)
 <code>
     jQuery.isPlainObject({}); // false
 </code>
 
 
 milestone 2.0 ------------------------------------
 
 2011-10-11  Kael:
 - add NR.isWindow method
 - add an atom to identify the Neuron Object
 
 2011-10-04  Kael:
 - fix a but that NR.isObject(undefined/null) -> true in IE
 
 2011-09-04  Kael:
 - add global support for CommonJS(NodeJS)
 
 Global TODO:
 A. make Slick Selector Engine slim
 B. remove setAttribute opponent from Slick
 C. [business] move inline script for header searching after the HTML structure of header
 
 2011-09-02  Kael:
 - rename core.js as seed.js
 - remove everything unnecessary out of seed.js
 - seed.js will only manage the NR namespace and provide support for type detection
 
 milestone 1.0 ------------------------------------

 2010-08-27  Kael:
 - add global configuration: NR.__PARSER as DOM selector and parser

 2010-08-16  Kael:
 TODO:
 √ GLOBAL: remove all native implements of non-ECMAScript5 standards


 2011-03-19  Kael: move NR.type to lang.js
 2011-03-01  Kael Zhang: add adapter for typeOf of mootools
 2010-12-13  Kael Zhang: fix the getter of NR.data
 2010-10-09  Kael Zhang: create file
 
 */

// common code slice
// ----
//     - constants
//     - common methods


var DOC = ENV.document;
var EMPTY = '';



// no-operation
function NOOP(){};


// copy all properties in the supplier to the receiver
// @param {Object} receiver
// @param {Object} supplier
// @param {boolean=true} override whether override the existing property in the receiver
// @param {(Array.<string>)=} copylist copy list, an array of selected properties
// @returns {mixed} r
function mix(receiver, supplier, override, copylist) {

    if (supplier && receiver){

        var i = 0;
        var c;
        var len;

        // default to true
        override = override || override === undefined;

        if ( copylist && ( len = copylist.length ) ) {

            for (; i < len; i++) {
                c = copylist[i];

                if ( (c in supplier) && (override || !(c in receiver) ) ) {
                    receiver[c] = supplier[c];
                }
            }

        } else {
            for (c in supplier) {
                if (override || !(c in receiver)) {
                    receiver[c] = supplier[c];
                }
            }
        }
    }

    return receiver;
};

NR.mix = mix;


// make sure `host[key]` is an object
// @param {Object} host
// @param {string} key 
function makeSureObject(host, key){
    return host[key] || (host[key] = {});
};




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
};


function implement(host, methods){
    extend(host.prototype, methods);
};


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


// isXXX method - basic javascript type detecting
 
// NEVER use `NR._type` to test for a certain type in your javascript for business, 
// since the returned string may be subject to change in a future version 
 
// ALWAYS use `NR.isXXX` instead, because:
//     - `typeof` is unreliable and imprecise
//     - the best method to detect whether the passed object matches a specified type is ever changing
      
// in the future, `NR.isXXX` method may support Object.is(obj, type) of ECMAScript6        
// ------------------------------------------------------------------------------------ */
NR._type = function(){
    
    /**
     * @param {all} obj
     * @param {boolean=} strict, 
         if true, method _type will only return a certain type within the type_list
     
     * NEVER use `K._type(undefined)`
     * for undefined/null, use obj === undefined / obj === null instead
     
     * for host objects, always return 'object'
     */
    function _type(obj, strict){
        return type_map[ toString.call(obj) ] || !strict && obj && 'object' || undefined;
    };

    var toString = Object.prototype.toString;
    var _K = NR;
        
        // basic javascript types
        // never include any host types or new types of javascript variables for compatibility
    var type_list = 'Boolean Number String Function Array Date RegExp Object'.split(' ');
    var i = type_list.length;

    var type_map = {};
    var name;
    var name_lower;
    var isObject;
        
    while( i -- ){
        name = type_list[i];
        name_lower = name.toLowerCase();
        
        type_map[ '[object ' + name + ']' ] = name_lower;
        
        _K['is' + name] = name === 'Object' ?
        
            // Object.prototype.toString in IE:
            // undefined     -> [object Object]
            // null         -> [object Object]
            isObject = function(nl){
                return function(o){
                    
                    // never use `toString.call(obj) === '[object Object]'` here,
                    // because `isObject` is a totally generic detection
                    return !!o && _type(o) === nl;
                };
                
            }(name_lower)
        :
            function(nl){
                return function(o){
                    return _type(o) === nl;
                }
            }(name_lower);
    }
    
    
    /**
     * whether an object is created by '{}', new Object(), or new myClass() [1]
     * to put the first priority on performance, just make a simple method to detect plainObject.
     * so it's imprecise in many aspects, which might fail with:
     *    - location
     *    - other obtrusive changes of global objects which is forbidden
     */
    _K.isPlainObject = function(obj){
    
        // undefined     -> false
        // null            -> false
        return !!obj && toString.call(obj) === '[object Object]' && 'isPrototypeOf' in obj;
    };
    
    
    /**
     * simple method to detect DOMWindow in a clean world that has not been destroyed
     */
    _K.isWindow = function(obj){
    
        // toString.call(window):
        // [object Object]    -> IE
        // [object global]    -> Chrome
        // [object Window]    -> Firefox
        
        // isObject(window)    -> 'object'
        return isObject(obj) && 'setInterval' in obj; 
    };
    
    
    /**
     * never use isNaN function, use NR.isNaN instead.  NaN === NaN // false
     * @return {boolean} 
         true, if Number(obj) is NaN
         
     * ref:
     * http://es5.github.com/#x15.1.2.4
     * https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/isNaN
     */
    // TODO
    // _K.isNaN = function(obj){
    //    return obj == null || !/\d/.test( obj ) || isNaN( obj );
    // };

    return _type;
}();


/**
 * language and OOP enhancement for non-ECMAScript5 standards
 */


/**
 * bind the this pointer of a function    
 * @param {function()} fn
 * @param {Object} bind
 */
function bind_method(fn, bind){
    return function(){
        return fn.apply(bind, arguments);
    }
};


/**
 * clone an object as a pure array, and ignore non-number properties
 * @param {Array} array
 * @param {Array|Object} host required, receiver which the array be cloned to
 */
function mergePureArray(array, host){

    // we might merge arrays to some imitated array-like hosts(not really Array), such as Neuron jQuerified-DOM or jQuery objects
    // so `length` properties must be updated simultaniously
    var i = host.length = array.length;
        
    while(i --){
        host[i] = array[i];
    }
    
    return host;
};


/**
 * @param {all} array
         if nodelist, returns an array which generated from the nodelist
         if Array, returns the array itself
         otherwise, returns an array contains the subject
 * @param {Array=} host
 * @param {boolean=} force if true, the subject will pretend to be an array, `force` will be usefull if you call makeArray with an array-like object
 */
function makeArray(array, host){
    var NULL = null;
    
    // if is already an array, do nothing to improve performance 
    if(NR.isArray(array)){
        return host ? 
            // if there's a host, we will clean the host and manipulate the `length` property of the host
            mergePureArray(array, host) 
            
            // if no host, return the array itself
            : array;
    }
    
    if(array != NULL){
        if(
            // false == null // false
            // false.length     -> undefined    -> [false]
            array.length == NULL ||
                
            // NR.isObject(arguments) -> true(all browsers)
            
            // Object.prototype.toString.call(arguments);
            // -> [object Arguments]    if Chrome, IE >= 9, Firefox >= 4
            // -> [object Object]       if Firefox < 4, IE < 9
            !NR.isObject(array) ||
            
            // if is DOM subject
            // <select>.length === <select>.options.length
            
            // ATTENSION:
            // <select>.options === <select> (tested up to IE9)
            // so, never try to NR.makeArray(select.options)
            array.nodeType ||
            
            // NR.isObject(window)    -> true
            // window also has 'length' property
            'setInterval' in array
        ){
            array = [array];
        }
        
        // else {
        //      deal as well as Array, such as NodeLists, Array-like Objects, etc.
        // }
        
    // null and undefined are the isset value of object variable and primitive variable, so:
    // null         -> []
    // undefined    -> NR.makeArray() -> []
    }else{
        array = [];
    }
    
    // IE fails slice on collections and <select>.options (refers to <select>)
    // use array clone instead of Array.prototype.slice
    return mergePureArray(array, host || []);
};


function toQueryString(obj, splitter){
    var key, value, ret = [], encode = encodeURIComponent;
    
    for(key in obj){
        !NR.isObject(value = obj[key]) && !NR.isArray(value) && ret.push(key + '=' + encode(value));
    }
    
    return ret.join(splitter || '&');
};


var STR_CLONE_MARKER = '>_>~cloned';

var __nr_guid = 1;

/**
 * @private
 * @param {mixed} o
 * @param {Object} marked stack for marked objects
 * @param {function()=} filter filter function
         function(value, key, depth)
             value {mixed}
             key {string}
             depth {number} using depth parameter with a recursive object is DANGEROUS[1], make sure you really wanna do this
             
 * @param {Object=} host, the receiver of the cloned menbers, for both inner and external use
 * @param {Object=} cached stack for cached objects which are the clones of marked objects
 * @param {number=} depth, for inner use
 */
function clone(o, filter, marked, cached, depth){
    var marker, id, key, value, is_array, host;
    
    // internal use
    cached || (cached = {});
    depth || (depth = 1);
    
    switch(NR._type(o)){
        case 'array':
            host = [];
            is_array = true;
            // |
            // v
            
        // object, plainObject, instance
        case 'object':
            if( !( NR.isPlainObject(o) || is_array) ){
            
                // in IE, when o is undefined or null or host objects
                // element(DOMElement, HTMLWindow, HTMLDocument, HTMLhtmlElement), collections
                // arguments
                return o;
            }
        
            marker = STR_CLONE_MARKER;
            host || (host = {});
        
            if(o[marker]){
                return cached[o[marker]];
            }
            
            id = __nr_guid ++;
            
            // mark copied object to prevent duplicately cloning
            o[marker] = id;
            
            // store the marked object in order to santitize the markers after cloning
            marked[id] = o;
            
            // cache the tidy clone of the marked object
            cached[id] = host;
            
            // always use for-in loop
            // 'coz on many situation, o is not a pure object or array, eg.
            // var a = []; a.a = 123;
            for(key in o){
                value = o[key];
                
                if(
                    // !STR_CLONE_MARKER
                    key !== marker &&
                    
                    // checking filter
                    (!filter || filter.call(o, value, key, depth))
                ){
                    host[key] = clone(value, filter, marked, cached, depth + 1);
                }
            }
            
            // free
            marked = cached = null;
        
            return host;
            
        case 'date':
            return new Date(o);
        
        // ECMAScript5+
        
        // in ECMAScript3 standard, regexps can't be cloned, because
        // a regular expression literal returns a shared object each time the literal is evaluated
        // such as Firefox(<4), but IEs betray the rules of ECMA3
        case 'regexp':
            return new RegExp(o);
            
        
        default:
            // number, boolean, 
            return o;
    }
};

          
/**
 * language enhancement 
 
 * for non-ECMAScript5 implementations, we'll add them into the NR namespace
 * and ECMAScript5 standard methods will be included in native.js
 * --------------------------------------------------------------------------------------------- */

NR.guid = function(){
    return __nr_guid ++;
};


/**
 * transform functions that have the signature fn(key, value)
 * to 
 * functions that could accept object arguments

 * @param {function()} fn
 * @param {boolean} noStrict if true, overloadSetter will not check the type of parameter 'key'
 */
NR._overloadSetter = function (fn, noStrict){

    // @return {undefined} setter method will always return this, 
    // for the sake of potential chain-style invocations
    return function(key, value){
    
        // @this
        // for instance method, 'this' is the context
        // for normal functions, if use ecma strict, 'this' is undefined
        var ret = this;
        var k;
        var v;
        
        if (NR.isObject(key)){
            for (k in key){
                v = key[k];
                fn.call(this, k, v);
            }
            
        }else if(noStrict || NR.isString(key)){
        
            // use apply instead of fn.call(self, key, value)
            // so the overloaded function could receive more arguments
            ret = fn.apply(this, arguments);
        }
        
        return ret;
    };
};


/**
 * forEach method for Object
 * which will not look for the prototype chain
 
 * @returns {undefined}
 */
NR.each = function(obj, fn, context){
    if(NR.isFunction(fn)){
    
        context = context || obj;

        if(NR.isObject(obj)){
            var keys = Object.keys(obj);
            var i = 0;
            var len = keys.length;
            var key;
            
            for(; i < len; i ++){
                key = keys[i];
                obj.hasOwnProperty(key) && fn.call(context, obj[key], key);
            }
            
        }else if(NR.isArray(obj)){
            obj.forEach(fn, context);
        }
    }
};
 

/**
 * deep clone an object, including properties on prototype chain.()
 * is able to deal with recursive object, unlike the poor Object.clone of mootools
 
 * @param {Object|Array} o
 * @param {?function()} filter filter function(value, key, depth)
 * @return {Object} the cloned object
 
 usage:
 <code>
     var a = {}, b = {b: 1}, c; a.a = a;
     c = NR.clone(a);         // clone a to c
 </code>
 */
NR.clone = function(o, filter) {
    var marked = {};
    var cloned = clone(o, filter, marked);
    
    // remove CLONE_MARKER
    NR.each(marked, function(v){
        try{
            delete v[STR_CLONE_MARKER];
        }catch(e){
        }
    });
    
    marked = null;
    
    return cloned;
};


/**
 * bind 'this' pointer for a function
 * or bind a method for a constructor
 * @usage:
 * <code>
   1. NR.bind(myFunction, {a:1});
   2. NR.bind('method', {a:1, method: function(){ alert(this.a) }});
 
 * </code>
 * 
 */
NR.bind = function(fn, bind){
    return NR.isFunction(fn) ?
        bind_method(fn, bind)
    :
        (bind[fn] = bind_method(bind[fn], bind));
};


/**
 * method to encapsulate the delayed function
 */
NR.delay = function(fn, delay, isInterval){
    var ret = {
        start: function(){
            ret.cancel();
            return ret.id = isInterval ? setInterval(fn, delay) : setTimeout(fn, delay);
        },
        cancel: function(){
            var timer = ret.id;
            
            ret.id = isInterval ? clearInterval(timer) : clearTimeout(timer);
            return ret;
        }
    };
    
    return ret;
};

makeArray.merge = mergePureArray;
NR.makeArray = makeArray;


/**
 * @param {string} template template string
 * @param {Object} params
 */
NR.sub = function(template, params){
    
    // suppose:
    // template = 'abc{a}\\{b}';
    // params = { a: 1, b: 2 };
    
    // returns: 'abc1{b}'
    return ('' + template).replace(/\\?\{([^{}]+)\}/g, function(match, name){ // name -> match group 1
    
        // never substitute escaped braces `\\{}`
        // '\\{b}' -> '{b}'
        return match.charAt(0) === '\\' ? match.slice(1)
            :
                // '{a}' -> '1'
                ( params[name] != null ? params[name] : '');
    });
};


NR.toQueryString = function(obj, splitter){
    return NR.isObject(obj) ?
        toQueryString( NR.clone(obj, function(v, k, d){
                
                // abandon deep object members
                // copy depth: 1
                return d < 2;
            }
        ), splitter)
        
        : obj;
};


/**
 * 
 */
// _overloadInstanceMethod: overload_for_instance_method,

/**
 * run a method once and only ONCE before the real method executed
 * usefull for lazy initialization
 *
 * @example
 * if Overlay::show is the public api to show the overlay
 * but it has a initialization method, which we want to be called just before the overlay shows, not the very moment when the instance of Overlay created,
 * so,
 * we apply:
 * initialization method     -> Overlay::_showInit
 * real show method         -> Overlay::show
 * and then:
 *
 * @usage
     <code>
         // before 'show', '_showInit' will be executed only once
         NR._onceBefore('show', '_showInit', Overlay.prototype);
     </code>
 */
NR._onceBefore = function(real_method_name, init_method_name, belong){
    var init = belong[init_method_name],
        real = belong[real_method_name];
        
    belong[real_method_name] = function(){
        var ret, self = this;
    
        init.call(self);
        
        ret = real.apply(self, arguments);
        
        // assign `real` to `this` but not belong, so that NR._onceBefore will not ruin the prototype
        self[real_method_name] = real;
        
        return ret;
    };
};


// push the giving array to the end of `append`, and make sure every element is unique
// @param {mixed} append item to push into the array
// @param {Array} array receiver array
NR.pushUnique = function(append, array){
    array = makeArray(array);

    var AP_push = Array.prototype.push,
        length = array.length,
        j, k,
        append_length,
        unique,
        member;
                
    for(k = 0; k < length; k ++){
        // append.length is ever changing
        append_length = append.length;
        member = array[k];
        unique = true;
        
        for(j = 0; j < append_length; j ++){
            if(member === append[j]){
                unique = false;
                break;
            }
        }
        
        // make sure, all found members are unique
        if(unique){
        
            // use `push.call(append, member)` instead of `append.push(member)`
            // append might be array-like objects
            AP_push.call(append, member);
        }
    }
    
    return append;
};


/**
 ---------------------------------------------------------
 [1] why dangerous? you could find out. the order of the old keys and new created keys between various browsers is different
 
 change log:
 
 2012-07-25  Kael:
 - refractor NR.makeArray method, removing `force` parameter; and now NR.makeArray will no longer append the specified array to the end of the host, but to override it. improve performance.
 
 2012-04-05  Kael:
 - add a parameter to force makeArray treating the current subject as an array
 - add NR.sub method to substitute a string templete with parameters
 
 2012-01-12  Kael:
 - improve NR._overloadSetter, so that the overloaded function could receive more arguments
 
 2012-01-04  Kael:
 - NR._onceBefore will not affect prototype chain but instance only
 
 2011-10-13  Kael:
 - NR.makeArray could has an array receiver to be merged to
 
 2011-10-10  Kael:
 - fix a bug about NR.makeArray who fails to deal with document
 
 2011-10-04  Kael:
 - fix a bug about NR.clone that IE fails when cloning a NodeList or DOMElement
 - NR.clone will clone RegExp Objects
 
 2011-09-28  Kael:
 - improve the stability of NR.makeArray and NR.toQueryString
 
 2011-09-17  Kael:
 - add receiver to NR.clone to clone the list of methods into a specified object
 - fix a bug about NR.clone that unexpectedly convert Array to Object
 - to implement NR.clone use for-in instead of NR.each, so that we can unlink the prototype chain
 
 2011-09-10  Kael:
 - add NR.clone to clone an object instead of Object.clone
     fix the bug that mootools will exceed maximum call stack size when cloning a recursive object
     
 TODO:
 A. test memleak about cached parameter in function clone on ie

 2011-09-04  Kael:
 TODO:
 A. improve stability for NR.makeArray

 change log:
 2011-04-19  Kael:
 - add method lazyInit, fix a bug of overloadInstanceMethod
 - add method to detect the type of an object. set NR._type as semi-private method
 2011-04-15  Kael:
 - add adapter for overloadSetter, 
 - add method overloadInstanceMethod
 2011-04-1   Kael Zhang: move NR.ready to web.js
 2010-12-31  Kael Zhang:
 - add NR.data and NR.delay
 - remove domready from mootools
 */

/**
 * @module  web
 * methods for browsers and business requirement
 
 * - domready
 * - data storage
 * - getLocation
 * - UA
 */

/**
 * get the readable location object of current page 
 */
function getCurrentLocation(){
    var L, H;

    // IE may throw an exception when accessing
    // a field from document.location if document.domain has been set
    // ref:
    // stackoverflow.com/questions/1498788/reading-window-location-after-setting-document-domain-in-ie6
    try {
        L = DOC.location;
        H = L.href;

    } catch(e) {
    
        // Use the href attribute of an A element
        // since IE will modify it given document.location
        H = DOC.createElement('a');
        H.href = EMPTY;
        H = H.href;
        
        L = parseLocation(H);
    }
    
    return L;
};

/**
 * parse a link to location object
 * @param {string} H
 * @return {Object} custom location object
 */
function parseLocation(H){
    var E = nullOrEmpty;

    H = H.match(REGEX_URL);
    
    var port   = H[3];
    var search = E( H[5] );
    var hash   = E( H[6] );
    
    return {
        href        : H[0],
        protocol    : H[1],
        host        : H[2] + (port ? ':' + port : EMPTY),
        hostname    : H[2],
        port        : E( port ),
        pathname    : E( H[4] ),
        
        // ATTENSION!
        search      : search === '?' ? '' : search,

        // ATTENSION!
        // if hash is '#', `location.hash` is an empty string rather than '#' 
        hash        : hash === '#' ? '' : hash
    };
};


function nullOrEmpty(str){
    return str || EMPTY;
};


/* 
REGEX_URL = /^
    ([\w\+\.\-]+:)          // protocol
    \/\/
    ([^\/?#:]+)             // domain
(?::
    (\d+)                   // port
)?
    (/[^?#]*)?              // pathname
    (\?[^?#]*)?             // search
    (#.+)?                  // hash
$/
*/

var REGEX_URL = /^([\w\+\.\-]+:)\/\/([^\/?#:]+)(?::(\d+))?(\/[^?#]*)?(\?[^#]*)?(#.*)?$/;


/**
 * @param {string} href
 * @return {Object}
 *    - if href undefined, returns the current location
 *    - if href is a string, returns the parsed loaction
 */
NR.getLocation = function(href){
    return href ?
        parseLocation(href)
    :    getCurrentLocation();
};


/**
 TODO:
 - add constructor for NR.data 
 - syntax checking for uri

 change log:
 2012-09-14  Kael:
 - fix NR.getLocation(href).search that if search query is `'?'`, location.search should be an empty string
 
 2011-07-05  Kael:
 - remove UA.fullversion
 - add adapter for Browser.Platform
 
 2011-06-12  Kael:
 - fix a bug about the regular expression of location pattern that more than one question mark should be allowed in search query
 - add UA.chrome. 
 
 2011-04-26  Kael:
 - adapt mootools.Browser
 - remove ua.chrome, ua.safari, add ua.webkit
 
 2011-04-12  Kael Zhang:
 - fix a bug that domready could not be properly fired
 - add NR.getLocation method, 
     1. to fix the bug of ie6, which will cause an exception when fetching the value of window.location if document.domain is already specified
     2. which can split an specified uri into different parts
     
 2010-12-31  Kael Zhang:
 - migrate domready event out from mootools to here, and change some way 
 - migrate .data and .delay methods from core/lang to here
 
 */

/**
 * Preset of Class Extensions: 'events'
 */

// @returns {Object}
function getEventStorage(host){
    return host._ev || (host._ev = {});
};


// @param {this} self
// @param {string} type
// @returns {Array.<function()>}
function getEventStorageByType(host, type){
    var storage = getEventStorage(host);
    
    return type ? storage[type] || (storage[type] = []) : [];
};


NR._Event = {
    on: NR._overloadSetter(function(type, fn){
        if(NR.isString(type) && NR.isFunction(fn)){
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
        if(NR.isString(type)){
            s = getEventStorageByType(self, type);
            
            // .off(type)
            if(args.length === 1){
                s.length = 0;
            
            // .off(type, fn)
            
            // ignore: .off(type, undefined)
            }else if(NR.isFunction(fn)){
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
        
        if(NR.isString(type)){
            args = NR.makeArray(args);
            
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
    if(typeof identifier === 'string' && NR.isArray(dependencies) && NR.isFunction(factory) ){
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
};


// @private
// @param {Array.<string>} modules no type detecting
function generateModuleVersionMap(modules, host){
    modules.forEach(function(mod) {
        var name = mod.split(STR_VERSION_SPLITTER)[0];
        host[name] = mod;
    });
};


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
        var mod = getModById(env.v[id] || id, env);
        
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
};


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
};


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
};


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
    }
    
    return path;
};


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
    var isString = NR.isString;
    
    makeArray(arguments).forEach(function(module){
        if(isString(module)){
            module = {
                mod: module
            };
        }
        
        provide(module.mod, function(K, method){
            method.init && method.init(module.config);
        });
    });
};


/**
 change log:
 
 import ./ChangeLog.md;
 
 */

/**
 * module  loader/assets
 */

var HEAD = DOC.getElementsByTagName('head')[0];

var REGEX_FILE_TYPE = /\.(\w+)$/i;

/**
 * method to load a resource file
 * @param {string} uri uri of resource
 * @param {function()=} callback callback function
 * @param {string=} type the explicitily assigned type of the resource, 
     can be 'js', 'css', or 'img'. default to 'img'. (optional) 
 */
loadSrc = function(uri, callback, type){
    var extension = type || uri.match(REGEX_FILE_TYPE)[1];
    
    return extension ?
        ( loadSrc[ extension.toLowerCase() ] || loadSrc.img )(uri, callback)
        : NULL;
};


/**
 * static resource loader
 * meta functions for assets
 * --------------------------------------------------------------------------------------------------- */

/**
 * @param {string} url
 * @param {function()=} callback
 */    
loadSrc.css = function(uri, callback){
    var node = DOC.createElement('link');
    
    node.href = uri;
    node.rel = 'stylesheet';
    
    callback && assetOnload.css(node, callback);
    
    // insert new CSS in the end of `<head>` to maintain priority
    HEAD.appendChild(node);
    
    return node;
};

/**
 * @param {string} url
 * @param {function()=} callback
 */
loadSrc.js = function(uri, callback){
    var node = DOC.createElement('script');
    
    node.src = uri;
    node.async = true;
    
    callback && assetOnload.js(node, callback);
    
    loadSrc.__pending = uri;
    HEAD.insertBefore(node, HEAD.firstChild);
    loadSrc.__pending = NULL;
    
    return node;
};
    
/**
 * @param {string} url
 * @param {function()=} callback
 */
loadSrc.img = function(uri, callback){
    var node = DOC.createElement('img'),
        delay = setTimeout;
        
    function complete(name){
        node.onload = node.onabort = node.onerror = complete = NULL;
        
        // on IE, `onload` event may be fired during the setting{1} of the src of image node
        // so setTimeout to make sure the callback function will be executed after the current loadSrc.img stack.
        setTimeout(function(){
            callback.call(node, {type: name});
            node = NULL;
        }, 0);
    };

    callback && ['load', 'abort', 'error'].forEach(function(name){
        node['on' + name] = function(){
            complete(name);
        };
    });

    // {1}
    node.src = uri;
    
    callback && node.complete && complete && complete('load');
    
    return node;
};

// @this {element}
var assetOnload = {
    js: DOC.createElement('script').readyState ?
    
        /**
         * @param {DOMElement} node
         * @param {!function()} callback asset.js makes sure callback is not null
         */
        function(node, callback){
            node.onreadystatechange = function(){
                var rs = node.readyState;
                if (rs === 'loaded' || rs === 'complete'){
                    node.onreadystatechange = NULL;
                    
                    callback.call(this);
                }
            };
        } :
        
        function(node, callback){
            node.addEventListener('load', callback, false);
        }
    ,

    css: DOC.createElement('css').attachEvent ?
        function(node, callback){
            node.attachEvent('onload', callback);
        } :
        
        function(node, callback){
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
                    assetOnload.css(node, callback);
                }, 10);
            }
        }
};


/**
 * load a static source 
 * NR.load(src, cb);
 * NR.load.js(src, cb);
 * NR.load.css(src, cb);
 * NR.load.img(src, cb);
 */
NR['load'] = loadSrc;


/**
 change log:
 
 2012-06-29  Kael:
 - fix a bug of NR.load.img on IE, 
 
 
 */


/**
 * user agent
 * author  Kael Zhang
 */

// @namespace NR.UA 
var UA = NR.UA = {};
    
// @enum {RegExp}
var REGEX_UA_MATCHER = {
    
        // the behavior of Google Chrome, Safari, Maxthon 3+, 360 is dependent on the engine they based on
        // so we will no more detect the browser version but the engine version
        
        // NR.UA.chrome and NR.UA.safari are removed
        webkit  : /webkit[ \/]([^ ]+)/,
        opera   : /opera(?:.*version)?[ \/]([\w.]+)/,
        ie      : /msie ([\w.]+)/,
        mozilla : /mozilla(?:.*? rv:([\w.]+))?/
    };
    
var DEFAULT_PLATFORM = 'other';
    
var userAgent = navigator.userAgent.toLowerCase();
var platform = navigator.platform.toLowerCase();


// userAgent
['webkit', 'opera', 'ie', 'mozilla'].forEach(function(name){
    var ua = UA;

    if(!ua.version){
        var match = userAgent.match(REGEX_UA_MATCHER[name]);
            
        if(match){
            ua[name] = ua.version = parseInt(match[1]);
            UA.fullVersion = match[1];
        }
    }
});


UA.platform = platform = platform.match(/ip(?:ad|od|hone)/) ? 'ios' 
    : ( platform.match(/(?:webos|android)/) || platform.match(/mac|win|linux/) || [DEFAULT_PLATFORM] )[0];


if(platform !== DEFAULT_PLATFORM){
    UA[platform] = true;
}


/**
 change log:
 
 2012-05-16  Kael:
 TODO:
 A. support detect a specified userAgent text
 
 2011-09-03  Kael Zhang:
 - create file
 - remove NR.UA.chrome and NR.UA.safari

 */

/**
 * module  biz
 * method for business requirement
 */

// --- method for NR.data ----------------------- *\
function NRSetData(data){
    data && NR.mix(nr_stored_data, data);
};

function NRCloneData(){
    return NR.clone(nr_stored_data);
};

function NRGetData(name){
    return nr_stored_data[name];
};
// --- /method for NR.data ----------------------- *\


    // @type {Object}
var nr_stored_data = {};


/**
 * module  data

 * setter
 * getter

 * usage:
 * 1. NR.data()                     returns the shadow copy of the current data stack
 * 2. NR.data('abc')                returns the data named 'abc'
 * 3. NR.data('abc', 123)           set the value of 'abc' as 123
 * 4. NR.data({abc: 123, edf:456})  batch setter
 *
 * @param {all=} value 
 */
NR.data = function(name, value){
    var type = NR._type(name),
        empty_obj = {},
        is_getter, ret;
    
    if(name === undefined){
        ret = NRCloneData(); // get: return shadow copy
        is_getter = true;

    }else if(type === 'string'){
        if(value === undefined){
            ret = NRGetData(name); // get: return the value of name
            is_getter = true;
        }else{
            empty_obj[name] = value;
            NRSetData(empty_obj) // set
        }

    }else if(type === 'object'){
        NRSetData(name); // set
    }

    return is_getter ? ret : NR;
};


/**
 change log:
 
 2012-02-08  Kael:
 - use NR.require instead of NR.bizRequire, and no longer initialize modules after DOMReady by default. 
     Modules loaded by NR.require should manage DOMReady by their own if necessary.
 
 2011-10-13  Kael:
 - move NR.data to biz.js
 - add NR.bizRequire method to automatically provide a batch of specified modules
 
 TODO:
 A. add a method to fake a global function to put its invocations into a queue until the real implementation attached
 
 */

})(this);

