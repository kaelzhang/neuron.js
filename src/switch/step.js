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
			item = 
			self.items[index] = self[ITEM_RENDERER].call(self, index).inject(self.container);
			
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
			// validator: K.isFunction
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
		
		self.on(EVENTS.BEFORE_INIT, function(){
			K.mix(this, METHODS_OVERRIDEN);
		});
	
		self.on(EVENTS.AFTER_INIT, function(){
			var self = this;
			
			self[ITEM_RENDERER] = self.get(ITEM_RENDERER);
			
			// set fake length value
			self._itemData(self.length + self.get('dataLength')); console.log(self.get('dataLength'))
		});
	}
};


});