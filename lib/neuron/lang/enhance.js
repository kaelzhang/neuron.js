/**
 * language and OOP enhancement for non-ECMAScript5 standards
 */

;(function(K, undef){
    
/**
 * copy all properties in the supplier to the receiver
 * @param r {Object} receiver
 * @param s {Object} supplier
 * @param or {boolean=} whether override the existing property in the receiver
 * @param cl {(Array.<string>)=} copy list, an array of selected properties
 */
function mix(r, s, or, cl) {
    if (!s || !r) return r;
    var i = 0, c, len;
    or = or || or === undef;

    if (cl && (len = cl.length)) {
        for (; i < len; i++) {
            c = cl[i];
            if ( (c in s) && (or || !(c in r) ) ) {
                r[c] = s[c];
            }
        }
    } else {
        for (c in s) {
            if (or || !(c in r)) {
                r[c] = s[c];
            }
        }
    }
    return r;
};
    
    
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
 * transform functions that have the signature fn(key, value)
 * to 
 * functions that could accept object arguments

 * @param {function()} fn
 * @param {boolean} noStrict if true, overloadSetter will not check the type of parameter 'key'
 */
function overloadSetter(fn, noStrict){

    // @return {undefined} setter method will always return this, 
    // for the sake of potential chain-style invocations
    return function(key, value){
    
        // @this
        // for instance method, 'this' is the context
        // for normal functions, if use ecma strict, 'this' is undefined
        var self = this, ret = self;
        
        if (K.isObject(key)){
            K.each(key, function(v, k){
                fn.call(self, k, v);
            });
            
        }else if(noStrict || K.isString(key)){
        
            // use apply instead of fn.call(self, key, value)
            // so the overloaded function could receive more arguments
            ret = fn.apply(self, arguments);
        }
        
        return ret;
    };
};


/**
 * memoize static result of a complicated method to save time
 * @param {function(string...)} fn method which only accepts string parameters
 */
function memoizeMethod(fn){
    var stack = {};
    
    return function(){
        var arg = array_join.call(arguments, MEMOIZE_JOINER);
    
        return (arg in stack) ? stack[arg] : (stack[arg] = fn.apply(this, arguments));
    }
};


/**
 * clone an object as a pure array, and ignore non-number properties
 * @param {Array} array
 * @param {Array|Object} host required, receiver which the array be cloned to
 */
function mergePureArray(array, host){
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
    if(K.isArray(array)){
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
                
            // KM.isObject(arguments) -> true(all browsers)
            
            // Object.prototype.toString.call(arguments);
            // -> [object Arguments]    if Chrome, IE >= 9, Firefox >= 4
            // -> [object Object]       if Firefox < 4, IE < 9
            !K.isObject(array) ||
            
            // if is DOM subject
            // <select>.length === <select>.options.length
            
            // ATTENSION:
            // <select>.options === <select> (tested up to IE9)
            // so, never try to KM.makeArray(select.options)
            array.nodeType ||
            
            // K.isObject(window)    -> true
            // window also has 'length' property
            'setInterval' in array
        ){
            array = [array];
        }
        
        // else deal as well as Array
    
    // null         -> []
    // undefined    -> K.makeArray() -> []
    }else{
        array = [];
    }
    
    // IE fails slice on collections and <select>.options (refers to <select>)
    // use array clone instead of Array.prototype.slice
    return mergePureArray(array, host || []);
};


/**
 * transform constructor functions to functions that could change a method of a instance or singleton 
 */
/*
function overload_for_instance_method(fn){
    var self = this;

    return function(methodname, instance){
        var arg = arguments;
    
        return K.isFunction(methodname) ?
            fn.apply(self, arg)
        :    instance[methodname] = fn.call(instance, instance[methodname], instance);
    };
};
*/


function toQueryString(obj, splitter){
    var key, value, ret = [], encode = encodeURIComponent;
    
    for(key in obj){
        !K.isObject(value = obj[key]) && !K.isArray(value) && ret.push(key + '=' + encode(value));
    }
    
    return ret.join(splitter || '&');
};


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
    
    switch(K._type(o)){
        case 'array':
            host = [];
            is_array = true;
            // |
            // v
            
        // object, plainObject, instance
        case 'object':
            if( !( K.isPlainObject(o) || is_array) ){
            
                // in IE, when o is undefined or null or host objects
                // element(DOMElement, HTMLWindow, HTMLDocument, HTMLhtmlElement), collections
                // arguments
                return o;
            }
        
            marker = CLONE_MARKER;
            host || (host = {});
        
            if(o[marker]){
                return cached[o[marker]];
            }
            
            id = _guid ++;
            
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
                    // !CLONE_MARKER
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


var    NOOP             = function(){},
    array_join         = Array.prototype.join,
    CLONE_MARKER     = '>_>~cloned',
    MEMOIZE_JOINER     = '~^_^~',

    _guid = 1;

          
/**
 * language enhancement 
 
 * for non-ECMAScript5 implementations, we'll add them into the KM namespace
 * and ECMAScript5 standard methods will be included in native.js
 * --------------------------------------------------------------------------------------------- */
    
K.mix = mix;
    

K.guid = function(){
    return _guid ++;
};


/**
 * forEach method for Object
 * which will not look for the prototype chain
 */
K.each = function(obj, fn, context){
    if(K.isFunction(fn)){
    
        context = context || obj;

        if(K.isObject(obj)){
            var keys = Object.keys(obj), i = 0, len = keys.length, key;
            
            for(; i < len; i ++){
                key = keys[i];
                obj.hasOwnProperty(key) && fn.call(context, obj[key], key);
            }
            
        }else if(K.isArray(obj)){
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
     c = KM.clone(a);         // clone a to c
 </code>
 */
K.clone = function(o, filter) {
    var marked = {},
        m = CLONE_MARKER,
        cloned = clone(o, filter, marked);
    
    // remove CLONE_MARKER
    K.each(marked, function(v){
        try{
            delete v[m];
        }catch(e){
            var U;
            K.log('del clone m err', e);
            v[m] = U;
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
   1. KM.bind(myFunction, {a:1});
   2. KM.bind('method', {a:1, method: function(){ alert(this.a) }});
 
 * </code>
 * 
 */
K.bind = function(fn, bind){
    return K.isFunction(fn) ?
        bind_method(fn, bind)
    :
        (bind[fn] = bind_method(bind[fn], bind));
};


/**
 * method to encapsulate the delayed function
 */
K.delay = function(fn, delay, isInterval){
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
K.makeArray = makeArray;


/**
 * @param {string} template template string
 * @param {Object} params
 */
K.sub = function(template, params){
    
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


K.toQueryString = function(obj, splitter){
    return K.isObject(obj) ?
        toQueryString( K.clone(obj, function(v, k, d){
                
                // abandon deep object members
                // copy depth: 1
                return d < 2;
            }
        ), splitter)
        
        : obj;
};


/**
 * OOP Enhancement 
 * --------------------------------------------------------------------------------------------- */
 
 
/**
 * overload a setter function or a setter method of a instance
 */
K._overloadSetter = overloadSetter; // overload_for_instance_method( batch_setter ),

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
         KM._onceBefore('show', '_showInit', Overlay.prototype);
     </code>
 */
K._onceBefore = function(real_method_name, init_method_name, belong){
    var init = belong[init_method_name],
        real = belong[real_method_name];
        
    belong[real_method_name] = function(){
        var ret, self = this;
    
        init.call(self);
        
        ret = real.apply(self, arguments);
        self[real_method_name] = real;
        
        return ret;
    };
};

/**
 @usage
     <code>
        funcion myMethod(string){....}
        var memoizedMyMethod = KM._memoize(myMethod);
     </code>
 */
K._memoize = memoizeMethod; // overload_for_instance_method( memoizeMethod )


})(KM);


/**
 ---------------------------------------------------------
 [1] why dangerous? you could find out. the order of the old keys and new created keys between various browsers is different
 
 change log:
 
 2012-07-25  Kael:
 - refractor KM.makeArray method, removing `force` parameter; and now KM.makeArray will no longer append the specified array to the end of the host, but to override it. improve performance.
 
 2012-04-05  Kael:
 - add a parameter to force makeArray treating the current subject as an array
 - add KM.sub method to substitute a string templete with parameters
 
 2012-01-12  Kael:
 - improve KM._overloadSetter, so that the overloaded function could receive more arguments
 
 2012-01-04  Kael:
 - KM._onceBefore will not affect prototype chain but instance only
 
 2011-10-13  Kael:
 - KM.makeArray could has an array receiver to be merged to
 
 2011-10-10  Kael:
 - fix a bug about KM.makeArray who fails to deal with document
 
 2011-10-04  Kael:
 - fix a bug about KM.clone that IE fails when cloning a NodeList or DOMElement
 - KM.clone will clone RegExp Objects
 
 2011-09-28  Kael:
 - improve the stability of KM.makeArray and KM.toQueryString
 
 2011-09-17  Kael:
 - add receiver to KM.clone to clone the list of methods into a specified object
 - fix a bug about KM.clone that unexpectedly convert Array to Object
 - to implement KM.clone use for-in instead of KM.each, so that we can unlink the prototype chain
 
 2011-09-10  Kael:
 - add KM.clone to clone an object instead of Object.clone
     fix the bug that mootools will exceed maximum call stack size when cloning a recursive object
     
 TODO:
 A. test memleak about cached parameter in function clone on ie

 2011-09-04  Kael:
 TODO:
 A. improve stability for KM.makeArray

 change log:
 2011-04-19  Kael:
 - add method lazyInit, fix a bug of overloadInstanceMethod
 - add method to detect the type of an object. set KM._type as semi-private method
 2011-04-15  Kael:
 - add adapter for overloadSetter, 
 - add method overloadInstanceMethod
 2011-04-1   Kael Zhang: move KM.ready to web.js
 2010-12-31  Kael Zhang:
 - add KM.data and KM.delay
 - remove domready from mootools
 */