/**
 * ECMAScript5 implementation
     - methods native object implemented
     - methods native object extends
     
 * STANDALONE language enhancement
 * always has no dependencies on Neuron
 
 * codes from mootools, MDC or by Kael Zhang
 
 Array.prototype
     - indexOf
     - lastIndexOf
     - filter
     - forEach
     - every
     - map
     - some
     - reduce
     - reduceRight
 
 Object
     - create
     - keys
     
 String.prototype
     - trim
     - trimLeft
     - trimRight
 
 */

;(function(){

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

    filter: function(fn, context){
        var result = [];
        for (var i = 0, len = this.length; i < len; i++){
        
            // Kael:
            // Some people might ask: "why we use a `i in this` here?".
            // The answer is that `filter` method is not always used with real Arrays, invocation below might happen:
            
            //     var obj = {length: 4}; obj[3] = 1;
            //     Array.prototype.filter.call({length: 4});
            //     Array.prototype.filter.call($('body'));
            
            // as well as the lines below
            if ((i in this) && fn.call(context, this[i], i, this)){
                result.push(this[i]);
            }
        }
        return result;
    },

    forEach: function(fn, context){
        for (var i = 0, len = this.length; i < len; i++){
            if (i in this){
                fn.call(context, this[i], i, this);
            }
        }
    },
    
    every: function(fn, context){
        for (var i = 0, len = this.length; i < len; i++){
            if ((i in this) && !fn.call(context, this[i], i, this)){
                return false;
            }
        }
        return true;
    },    

    map: function(fn, context){
        var results = [];
        for (var i = 0, l = this.length; i < l; i++){
            if (i in this) results[i] = fn.call(context, this[i], i, this);
        }
        return results;
    },

    some: function(fn, context){
        for (var i = 0, l = this.length; i < l; i++){
            if ((i in this) && fn.call(context, this[i], i, this)) return true;
        }
        return false;
    },

    reduce: function (fn /* [, initialValue ] */) {
        if(typeof fn !== 'function') {
            throw new TypeError(fn + ' is not an function');
        }
        
        var self = this,
            len = self.length >>> 0, 
            i = 0, 
            result;
        
        if (arguments.length > 1) {
            result = arguments[1];
            
        }else{
            do {
                if (i in self) {
                    result = self[i++];
                    break;
                }
                
                // if array contains no values, no initial value to return
                if (++ i >= len) {
                    throw new TypeError('reduce of empty array with on initial value');
                }
            }while(true);
        }
        
        for (; i < len; i++) {
            if (i in self) {
                result = fn.call(null, result, self[i], i, self);
            }
        }
        
        return result;
    },
    
    reduceRight: function (fn /* [, initialValue ] */) {
        if(typeof fn !== 'function') {
            throw new TypeError(fn + ' is not an function');
        }
        
        var self = this,
            len = self.length >>> 0, 
            i = len - 1, 
            result;
        
        if (arguments.length > 1) {
            result = arguments[1];
            
        }else {
            do {
                if (i in self) {
                    result = self[i--];
                    break;
                }
                // if array contains no values, no initial value to return
                if (-- i < 0){
                    throw new TypeError('reduce of empty array with on initial value');
                }
            
            }while (true);
        }
        
        for (; i >= 0; i--) {
            if (i in self) {
                result = fn.call(null, result, self[i], i, self);
            }
        }
        
        return result;
    }

});


/**
implement(Function, {
    bind: // use NR.bind instead to prevent further problems
});
*/


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
    ];


extend(Object, {

    // https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Object/create
    create: function(o){
        if (arguments.length > 1) {  
            throw new Error('Object.create only accepts 1 param.');  
        }
          
        function F() {}  
        F.prototype = o;
          
        return new F();
    },
    
    // refs:
    // http://ejohn.org/blog/ecmascript-5-objects-and-properties/
    // http://whattheheadsaid.com/2010/10/a-safer-object-keys-compatibility-implementation
    // https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Object/keys
    // https://developer.mozilla.org/en/ECMAScript_DontEnum_attribute
    // http://msdn.microsoft.com/en-us/library/adebfyya(v=vs.94).aspx
    keys: (function () {
        var DontEnums = NONT_ENUMS,
            DontEnumsLength = DontEnums.length;
        
        return function (o) {
            if (o !== Object(o)) {
                throw new TypeError(o + ' is not an object');
            }
            
            var result = [],
                name;
            
            for (name in o) {
                if (hasOwnProperty.call(o, name)) {
                    result.push(name);
                }
            }
                
            if (has_dontEnumBug) {
                for (var i = 0; i < DontEnumsLength; i++) {
                    if (hasOwnProperty.call(o, DontEnums[i])) {
                        result.push(DontEnums[i]);
                    }
                }
            }
            
            return result;
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


})();

/**
 change log:
 
 2012-04-05  Kael:
 - use trimLeft and trimRight to do a entire trim
 
 2012-03-02  Kael:
 - Optimize the performance of String.trim method for IE who always do a bad work with regular expressions.
     It may even cause IE browsers(IE6-8) expectedly crash if use `/^\s+|\s+$/` to trim a big string which contains a lot of whitespaces.
 
 */