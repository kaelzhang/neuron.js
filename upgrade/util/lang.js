var

NR = require('../../lib/neuron/seed'),

lang = exports;

/**
 * provide a deep comparison
 */
lang.isEqual = function(compare, to){
    var 
    
    equal = NR._type(compare) === NR._type(to);
    
    equal && Object.keys(to).forEach(function(v, i){
        if(equal){
            if(v === Object(v)){
                equal = lang.isEqual(compare[i], to[i]);
            }else{
                equal = compare[i] === to[i];
            }
        }
    });
    
    return equal;
};