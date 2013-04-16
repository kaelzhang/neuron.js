;(function(K){

function alias(newKey, standardKey){
    jQuery_proto[newKey] = jQuery_proto[standardKey];
};
    
var 

DOM = K.DOM = jQuery,

jQuery_proto = DOM.fn,

ATTR_BOOLS = ['compact', 'nowrap', 'ismap', 'declare', 'noshade', 'checked', 'disabled', 'readOnly', 'multiple', 'selected', 'noresize', 'defer', 'defaultChecked'],

ATTR_BOOLS_ENUM = {};


ATTR_BOOLS.forEach(function(key, i){
    this[key] = true;
    
}, ATTR_BOOLS_ENUM);


alias('dispose', 'detach');
alias('destroy', 'remove');

DOM.create = function(fragment, attributes){
    var attrs = [],
        key;
    
    if(attributes){
        for(key in attributes){
            if(key in ATTR_BOOLS_ENUM){
                !!attributes[key] && attrs.push(key + '=' + key);
                
            }else{
                attrs.push(key + '=' + attributes[key]);
            }
        }
    }
    
    return fragment ? DOM('<' + fragment + ' ' + attrs.join(' ') + '>') : DOM();
};

K.mix(jQuery_proto, {

    inject: function(target, where){
        if(arguments.length === 1){
            where = 'bottom';
        }
    
        if(target){
            switch(where){
                case 'after':
                    this.insertAfter(target);
                    break;
                
                case 'before':
                    this.insertBefore(target);
                    break;
                
                case 'top':
                    var c = DOM(target).children();
                    
                    if(c.length){
                        this.insertBefore(c.eq(0));
                    }else{
                        this.appendTo(target);
                    }
                    
                    break;
                    
                case 'bottom':
                    this.appendTo(target);
                    break;
            };
        }
        
        return this;
    },
    
    grab: function(element, where){
        if(arguments.length === 1){
            where = 'bottom';
        }
        
        if(element){
            DOM(element).inject(this, where);
        }
        
        return this;
    },
    
    contains: function(element){
        element = DOM(element)[0];
        
        return !!element && !this.get().every(function(el){
            return !DOM.contains(el, element);
        });
    }
});


K.ready = function(fn){
    if(K.isFunction(fn)){
        jQuery(function(){
            fn(K); 
        });
    }
};


DOM.jq = true;
    
})(NR);

