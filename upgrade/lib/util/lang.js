'use strict';

var

NR = require('../../../lib/neuron');

/**
 * provide a deep comparison
 */
exports.isEqual = function(compare, to){
    var 
    
    equal = NR._type(compare) === NR._type(to);
    
    equal && Object.keys(to).forEach(function(key){
        if(equal){
            var v = compare[key];
        
            if(v === Object(v)){
                equal = exports.isEqual(v, to[key]);
                
            }else{
                equal = v === to[key];
            }
        }
    });
    
    return equal;
};