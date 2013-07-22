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



