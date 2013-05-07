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


NR.Event = {
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