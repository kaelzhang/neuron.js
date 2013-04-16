/**
 * Preset of Class Extensions: 'events'
 */
;(function(K){


// @returns {Object}
function getStorage(host){
    var ATTR_EVENTS = '__ev';
        
    return host[ATTR_EVENTS] || (host[ATTR_EVENTS] = {});
};


// @param {this} self
// @param {string} type
// @returns {Array.<function()>}
function getStorageByType(host, type){
    var storage = getStorage(host);
    
    return type ? storage[type] || (storage[type] = []) : [];
};


K.Class.EXTS.events = {
    on: K._overloadSetter(function(type, fn){
        if(K.isString(type) && K.isFunction(fn)){
            var storage = getStorageByType(this, type);
            
            storage.push(fn);
        }
    
        return this;
    }),
    
    off: function(type, fn){
        var self = this,
            args = arguments,
            storage,
            s;
        
        // remove all attached events
        // only deal with .off()
        if(!args.length){
            storage = getStorage(this);
            
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
        if(K.isString(type)){
            s = getStorageByType(self, type);
            
            // .off(type)
            if(args.length === 1){
                s.length = 0;
            
            // .off(type, fn)
            
            // ignore: .off(type, undefined)
            }else if(K.isFunction(fn)){
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
        
        if(K.isString(type)){
            args = K.makeArray(args);
            
            getStorageByType(self, type).forEach(function(fn){
                fn.apply(self, args);
            });
        }
        
        return self;
    }
};

})(NR);

/**
 change log
 
 2012-08-02  Kael:
 - improved the stablility of function overloading, prevent user mistakes
 - optimized calling chain
 
 2011-02-24  Kael:
 TODO:
 A. add .after and .before
 
 */