var OP_toString = Object.prototype.toString;

function isArray(obj){
    return OP_toString.call(obj) === '[object Array]';
};

function isFunction(obj){
    return OP_toString.call(obj) === '[object Function]';
};

function isObject(obj){
    return
        !!obj // make sure boolean type 
        && OP_toString.call(obj) === '[object Object]';
};

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

        if ( isObject(key) ){
            for ( k in key ) {
                fn.call(this, k, key[k]);
            };
            
        }else if( typeof key === 'string' ){
        
            // use apply instead of fn.call(self, key, value)
            // so the overloaded function could receive more arguments
            ret = fn.apply(this, arguments);
        }
        
        return ret;
    };
};


// A simple and imperfect `makeArray` method
// @param {mixed} array
//         if nodelist, returns an array which generated from the nodelist
//         if Array, returns the array itself
//         otherwise, returns an array contains the subject
function makeArray(array){
    var NULL = null;
    
    // if is already an array, do nothing to improve performance 
    if(isArray(array)){
        return array;
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
            !K.isObject(array) ||
            
            // if is DOM subject
            // <select>.length === <select>.options.length
            
            // ATTENSION:
            // <select>.options === <select> (tested up to IE9)
            // so, never try to NR.makeArray(select.options)
            array.nodeType ||
            
            // K.isObject(window)    -> true
            // window also has 'length' property
            'setInterval' in array
        ){
            array = [array];
        }
        
    // null and undefined are the isset value of object variable and primitive variable, so:
    // null         -> []
    // undefined    -> K.makeArray() -> []
    }else{
        array = [];
    }
    
    // IE fails slice on collections and <select>.options (refers to <select>)
    // use array clone instead of Array.prototype.slice
    return mergePureArray(array, host || []);
};