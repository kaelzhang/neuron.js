KM.define(function(K, require){

var 

ITEM_RENDERER = 'itemRenderer',

METHODS_OVERRIDEN = {
	_getItem: function(index){
		var self = this;
		
		return self.items[index] || (self.items[index] = self[ITEM_RENDERER].call(self, index));
	}
};


return {
	name: 'step',
	
	options: {
		// async: false,
		
		/**
		 * @type {function(index, callback)}
		 * @returns {string} the Neuron/DOM instance of the item with <index> index
		 */
		itemRenderer: null
	},
	
	init: function(self){
		var EVENTS = self.get('EVENTS');
	
		self.on(EVENTS.AFTER_INIT, function(){
			var t = this;
			
			K.mix(t, METHODS_OVERRIDEN);
			
			t[ITEM_RENDERER] = t.get(ITEM_RENDERER);
		});
	}
};


});