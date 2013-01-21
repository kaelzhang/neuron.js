var 

ITEM_RENDERER = 'itemRenderer',

METHODS_OVERRIDEN = {

    /**
     * override the _getItem method
     * so it could generate unexisted items
     * @param {number} index
     * @param {boolean=} dontSetPos if true, _getItem method will not set the position of newly created item
     */
    _getItem: function(index, dontSetPos){
        var self = this,
            item = self.items[index];
            
        if(!item){
            item = self.items[index] = self[ITEM_RENDERER].call(self, index);
        }
        
        return self._plantItem(item, index, dontSetPos);
    }
};


module.exports = {
    name: 'step',
    
    ATTRS: {
        // async: false,
        
        /**
         * method to render the Neuron/DOM instance of the item of expected index
         * @returns {string} the Neuron/DOM instance of the item with <index> index
         */
        itemRenderer: {
        
            // type {function(index, callback)}
            validator: NR.isFunction,
            setter: function(v){
                return this[ITEM_RENDERER] = v;
            }
        },
        
        data: {
            value: [],
            validator: NR.isArray
        },
        
        dataLength: {
            value: 0,
            validator: NR.isNumber,
            getter: function(v){
                return v || this.get('data').length;
            }
        },
        
        itemSpace: null
    },
    
    init: function(self){
        var EVENTS = self.get('EVENTS');
        
        self.on(EVENTS.BEFORE_SWITCH, function(){
            var self = this,
                move = self.get('stage'),
                length = self.length,
                
                now = self.expectIndex,
                end = now + move,
                index;            

            // check the existance of the items in the expected page which the switcher is switching to
            while(now < end){
                index = self._limit(now ++);
                
                index >= self.originLength && self._getItem(index);
            }
        });
        
        self.on(EVENTS.BEFORE_INIT, function(){
        
            // override
            NR.mix(this, METHODS_OVERRIDEN);
        });
    
        self.on(EVENTS.AFTER_INIT, function(){
            var self = this,
                length = self.originLength;
            
            // set fake length value
            self._itemData(length + self.get('dataLength'));
        });
    }
};

/**
 
 2012-04-25  Kael:
 - [issue.11-09].A
 - fix a bug which is caused by confusing ATTR.move with ATTR.stage

 2011-11-17  Kael:
 TODO:
 A. async itemRenderer(blocked by B)
 B. queue with multiple threads support

 2011-11-09  Kael:
 issue:
 A. if items don't exist, _getItem will fail 

 2011-11-02  Kael:
 - complete plugin::step
 - refractor _getItem method, so it could authentically create new items and apply them to precise positions

 */