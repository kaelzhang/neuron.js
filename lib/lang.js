var OP_toString = Object.prototype.toString;

function isArray(obj){
    return OP_toString.call(obj) === '[object Array]';
}

function isFunction(obj){
    return OP_toString.call(obj) === '[object Function]';
}

function isObject(obj){
    return !!obj // make sure boolean type 
        && OP_toString.call(obj) === '[object Object]';
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

    // if not an array
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


