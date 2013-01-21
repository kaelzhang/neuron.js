;(function(K){


/**
 * setter for class attributes
 * @private
 * @param {boolean} ghost inner use
     if true, setValue will ignore all flags or validators and force to writing the new value
     
 * @return {boolean} whether the new value has been successfully set
 */
function setValue(host, attr, value){
    var pass = true,
        setter,
        validator,
        v;

    if(attr[READ_ONLY]){
        pass = false;
        
    }else{
        validator = getMethod(host, attr, VALIDATOR);
        
        pass = !validator || validator.call(host, value);
    }
    
    if(pass && attr[WRITE_ONCE]){
        delete attr[WRITE_ONCE];
        attr[READ_ONLY] = TRUE;
    }
    
    if(pass){
        setter = getMethod(host, attr, SETTER);
        
        if(setter){
            // if setter is defined, always set the return value of setter to attr.value
            attr.value = setter.call(host, value);
        }else{
        
            // mix object values
            attr.value = value;
        }
    }
    
    return pass;
};


/**
 * getter for class attributes
 */
function getValue(host, attr){
    var getter = getMethod(host, attr, GETTER),
        v = attr.value;
    
    return getter ?
    
          // getter could based on the value of the current value
          getter.call(host, v)
        : v;
};


function getMethod(host, attr, name){
    var method = attr[name];
    
    return typeof method === 'string' ? host[method] : method;
};


/**
 * @private
 * @param {Object} host
 * @param {Object} sandbox shadow copy of the attributes of a class instance
 * @param {undefined=} undef
 */
function createGetterSetter(host, sandbox, undef){
    function _get(host, key, sandbox){
        var attr = sandbox[key];
        
        return attr ? getValue(host, attr) : undef;
    };
    
    function _getAll(host){
        var s = sandbox,
            key,
            ret = {};
            
        for(key in s){
            ret[key] = _get(host, key, s);
        }
        
        return ret;
    };

    host.set = overloadSetter( function(key, value){
        var attr = sandbox[key];
        
        return attr ? setValue(this, attr, value) : false;
    });
    
    host.get = function(key){
        return arguments.length ? _get(this, key, sandbox) : _getAll(this);
    };
    
    host.addAttr = overloadSetter(function(key, setting){
        sandbox[key] || (sandbox[key] = K.isObject(setting) ? 
                            
                            // it's important to clone the setting before mixing into the sandbox,
                            // or host.set method will ruin all references
                            K.clone(setting) : 
                            {}
                        );
    });
    
    host.removeAttr = function(key){
        delete sandbox[key];
    };
};


function createPublicMethod(name){
    return function(){
        var self = this,
            
            // @private
            // sandbox
            sandbox = createSandBox(self);
        
        // .set and .get methods won't be initialized util the first .set method excuted
        createGetterSetter(self, sandbox);
        
        return self[name].apply(self, arguments);
    };
};


function createSandBox(host){
    var class_ = host.constructor,
        sandbox;
    
    do{
        if(sandbox = class_.ATTRS){
            break;
        }
    } while(class_ = class_.prototype[__SUPER_CLASS]);
    
    return sandbox ? K.clone(sandbox) : {};
};


var TRUE = true,
    GETTER = 'getter',
    SETTER = 'setter',
    VALIDATOR = 'validator',
    READ_ONLY = 'readOnly',
    WRITE_ONCE = 'writeOnce',
    
    __SUPER_CLASS = 'superclass',
    
    NOOP = function(){},
    
    isPlainObject = K.isPlainObject,
    overloadSetter = K._overloadSetter;


/**

 ATTRS = {
     attr: {
         value: 100
     },
     
     attrWithSetter: {
         setter: function(){}
     },
     
     attrWithProxySetter: {
         setter: '_setTimeout'
     },
     
     attrWithValidator: {
         value: 100,
         validator: function(v){
             return v <= 100;
         }
     }
 };

 */
 
var attrs = {};

['get', 'set', 'addAttr', 'removeAttr'].forEach(function(name){
    attrs[name] = createPublicMethod(name);
});
    
K.Class.EXTS.attrs = attrs;

attrs = null;


})(NR);


/**
 2012-02-23  Kael:
 - fix a fatal reference exception for .addAttr method
 - fix a bug that newly-created instance has no method: `addAttr` and `removeAttr`

 2012-01-30  Kael:
 - remove .setAttrs method. sandbox will be initialized by the first execution of .set, .get, or .addAttr method

 2011-10-24  Kael:
 - setAttrs method will return this
 - prevent addAttr method from affecting the existing attr object

 2011-10-18  Kael:
 TODO:
 - ? A. optimize setAttrs method, lazily initialize presets after they are called
 
 2011-09-20  Kael:
 - attr setter will return true or false to tell whether the new value has been successfully set

 2011-09-17  Kael:
 - TODO[09-15].A

 2011-09-15  Kael:
 - privatize attributes
 - create .get and .set method
 
 TODO:
 - √ A. ATTRs inheritance

 */