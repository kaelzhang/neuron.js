/**
 * module  model
 * object manager, add or remove object members. 
 */

KM.define(function(K){

function escapeHTML(string){
	return string.replace(/&(?!\w+;|#\d+;|#x[\da-f]+;)/gi, '&amp;')
				 .replace(/</g, '&lt;')
				 .replace(/>/g, '&gt;')
				 .replace(/"/g, '&quot;')
				 .replace(/'/g, '&#x27;')
				 .replace(/\//g,'&#x2F;');
};


/**
 * @param {Object} host
 */
function swapMethods(host, move, as, backup){
    host[backup] = host[move];
    host[move] = host[as];
    
    delete host[as];
};


var

// TODO: 
// global env
MAX_HISTORY_STATE = 20,

EVENT_LOAD = 'load',
EVENT_ERROR = 'error',
EVENT_SAVE = 'save',

Model = K.Class({
    Implements: 'events attrs',
    
    /**
	 * Override this method
	 */
	sync: function(actionType, callback){},
    
    initialize: function(options){
        var self = this;
    
        self.set({id: K.guid()});
		self.set(options);
		
		swapMethods(host, 'set', '_set', '__set');
		
		self._history = [];
	},
	
	load: function(callback){
    	this.sync('read', function(){
        	callback(res);
    	});
	},
	
	save: function(callback){
	    this.sync('update', /* create */ function(res){
    	    callback(res);
	    });
	},
	
	undo: function(){
        this.__set(this._history.pop());
	},
	
	/**
	 * Update the value of a specified key associated with the model.
	 * It will override Class.Ext.attrs.set after initialization
	 * @return {boolean} whether the key is successfully updated
	 
	 <code>
	 1. 
	 update('username', 'kael');
	 
	 2.
	 update({
	 	username: 'kael',
	 	email: 'i@kael.me'
	 });
	 
	 </code>
	 
	 */
    _set: function(key, value){
        var
        
        self = this,
        obj = {},
        
        validators = self.get('validators'),
        validator = validators[key],
        pass = true;
        
        if(K.isPlainObject(key)){
            obj = key;
        }else{
            obj[key] = value;
        }
        
        for(key in obj){
            value = obj[key];

            if(validator && !validator(value) || !self.__set(key, value) ){
                delete obj[key];
            }
        }
        
        self._pushState(obj);
    },
    
    /**
     * Add an item to the history stack
     */
    _pushState: function(item){
        var history = this._history;
        
        history.push(item);
        
        while(history.length > MAX_HISTORY_STATE){
            history.shift();
        }
    },
		
	/**
	 * remove a key
	 * example:
	 <code>
	 	.remove('name');
	 	.remove('name', 'gender');
	 </code>
	 */
	remove: function(/* item1, item2, ... */){
		var self = this;
		
		K.makeArray(arguments).forEach(function(key){
			self.removeAttr(key);
		});
		
		return self;
	},
	
	escape: function(key){
		var value = this.get(key);
		
		return escapeHTML(value ? '' + value : '');
	}
}),


ATTRS = {
	validators: {
	
		// so that we could add validator rules after initilization
		setter: function(rules){
			return K.mix(this.get('validators'), rules);
		},

		getter: function(v){
			return v || {};
		}
	},
	
	id: {
		writeOnce: true
	}
};


K.Class.setAttrs(Model, ATTRS);

return Model;

});

/**
 @usage:
 
 var Classmate = KM.Class({
    Extends: Model
 });
 
 KM.Class.setAttrs(Classmate, {
    name: {value: null},
    gender: {value: null},
    score: {value: null}
 });
 
 */
 
/**
 
 change log:
 
 2012-06-10  Kael:
 
 - mvp/model could undo several steps of data changes
 
 */