/**
 * state manager
 * state history, state navigation, 
 */
 
NR.define([], function(K, require){


var

State = K.Class({

	Implements: 'events',

	initialize: function(){
		this._stack = [];
		this._offset = this._max = -1;
	},

	/**
	 * push a state into the stack
	 * @param {mixed} state 
	 */
	push: function(state){
		var self = this;
	
		self._stack[++ self._offset] = state;
		
		self._max = Math.max(self._offset, self._max);
		
		self.fire('push', self._getData());
		
		return self;
	},
	
	_getData: function(){
		var offset = this._offset;
	
		return {
			state: this.getState(),
			offset: offset,
			max: offset === this._max,
			min: offset === 0
		};
	},
	
	clear: function(){
		this._stack.length = 0;
		return this;
	},

	go: function(direction){
		var offset = this._offset + direction;
		
		this._offset = Math.min(this._max, Math.max(offset, 0));
		
		return this;
	},
	
	prev: function(){
		return this.go(-1).fire('prev', this._getData());
	},
	
	next: function(){
		return this.go(1).fire('next', this._getData());
	},
	
	getState: function(){
		return this._stack[this._offset];
	}

});


return State;

});