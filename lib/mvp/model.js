/**
 * module  model
    - object manager: setter, getter, validators
    - data history and navigation
    - 
    
 * object manager, add or remove object members. 
 */

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

// EVENT_LOAD = 'load',
// EVENT_ERROR = 'error',
// EVENT_SAVE = 'save',

Model = NR.Class({
    Implements: 'events attrs',
    
    /**
     * Override this method
     */
    sync: function(actionType, callback){},
    
    initialize: function(options){
        this.set({id: NR.guid()});
        this.set(options);
        
        swapMethods(this, 'set', '_set', '__set');
        
        this.history = {};
        this.history_start = 0;
        this.history_end = this.history_pointer = -1;
        
    },
    
    load: function(callback){
        this.sync('load', function(){
            callback(res);
        });
    },
    
    update: function(callback){
        this.sync('update', /* create */ function(res){
            callback(res);
        });
    },
    
    undo: function(){
        return this.history_pointer > this.history_start ?
              ( this.__set( this.history[-- this.history_pointer] ), true )
            : false;
    },
    
    redo: function(){
        return this.history_pointer < this.history_end ?
              ( this.__set( this.history[++ this.history_pointer] ), true )
            : false;
    },
    
    /**
     * Update the value of a specified key associated with the model.
     * It will override Class.Ext.attrs.set after initialization
     * @return {boolean} whether the key is successfully updated
     
     <code>
     1. 
     .set('username', 'kael');
     
     2.
     .set({
         username: 'kael',
         email: 'i@kael.me'
     });
     
     </code>
     
     */
    _set: function(key, value){
    
        var pass = this.__set(key, value);
        
        // push the shadow copy
        if(pass){
            this._pushState(this.get());
        }
        
        return pass;
    },
    
    /**
     * Add an item to the history stack
     */
    _pushState: function(item){
        var history = this.history;
        
        history[this.history_end = ++ this.history_pointer] = item;
        
        while(this.history_end - this.history_start > MAX_HISTORY_STATE){
            delete history[this.history_start ++];
        }
    },
    
    escape: function(key){
        var value = this.get(key);
        
        return escapeHTML(value ? '' + value : '');
    }
    
});


// @param {Object} config
Model.create = function(config){
    
};


module.exports = Model;

/**
 @usage:
 
 var Classmate = NR.Class({
    Extends: Model
 }, {
    name: {value: null},
    gender: {value: null},
    score: {value: null}
 });
 
 */
 
/**
 
 change log:
 
 2013-01-27  Kael:
 - refractor method `_set`
 - refractor data history and improve performance to make it possible to implement `redo` method
 - abandon the `remove` method, use `removeAttr` method instead
 - rename actionType `read` -> 'load', method `save` -> `update` to maintain consistency
 
 TODO:
 A. configuration structure for custom sync method and invocation of specified modules
 
 2012-06-10  Kael:
 - mvp/model could undo several steps of data changes
 
 */