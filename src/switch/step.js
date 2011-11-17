KM.define(function(K, require){

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
			item = self.items[index] = self[ITEM_RENDERER].call(self, index).inject(self.container);
			
			dontSetPos || item.css(self.get('direction'), self._getOffset(index) * self.get('itemSpace'));
		}
		
		return item;
	},
	
	/**
	 * 
	 */
	_getOffset: function(index){
		return index;
	}
};


return {
	name: 'step',
	
	ATTRS: {
		// async: false,
		
		/**
		 * method to render the Neuron/DOM instance of the item of expected index
		 * @returns {string} the Neuron/DOM instance of the item with <index> index
		 */
		itemRenderer: {
		
			// type {function(index, callback)}
			validator: K.isFunction,
			setter: function(v){
				return this[ITEM_RENDERER] = v;
			}
		},
		
		dataLength: {
			value: K.isNumber,
			getter: function(v){
				return v || 0;
			}
		},
		
		itemSpace: null
	},
	
	init: function(self){
		var EVENTS = self.get('EVENTS');
		
		// check the existance of the items in the expected page which the switche is switching to
		self.on(EVENTS.BEFORE_SWITCH, function(){
			var self = this,
				move = self.get('move'),
				length = self.length,
				
				now = self.expectIndex,
				end = now + move,
				index;
				
			while(now < end){
				index = now ++ % length;
				
				index >= self.originLength && self._getItem(index);
			}
		});
		
		self.on(EVENTS.BEFORE_INIT, function(){
		
			// override
			K.mix(this, METHODS_OVERRIDEN);
		});
	
		self.on(EVENTS.AFTER_INIT, function(){
			var self = this,
				length = self.originLength = self.length;
			
			// set fake length value
			self._itemData(length + self.get('dataLength'));
		});
	}
};


});

/**
 2011-11-09  Kael:
 issue:
 - A. if items don't exist, _getItem will fail 

 2011-11-02  Kael:
 - complete plugin::step
 - refractor _getItem method, so it could authentically create new items and apply them to precise positions

 */