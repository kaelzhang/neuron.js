

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
 
 