/**
 * state manager
 * state history, state navigation, 
 */
 
KM.define([], function(K, require){


var

State = K.Class({

	Implements: 'events',

	initialize: function(){
		this._stack = [];
		this._offset = -1;
	},

	push: function(state){
		this._stack[++ this._offset] = state;
	},
	
	clear: function(){
		this._stack.length = 0;
		return this;
	},

	go: function(direction){
		direction = Math.min(this._offset, Number(direction) || 0);
		this._offset -= direction;
		return this;
	},
	
	prev: function(){
		return this.go(-1).fire('prev', this.getState());
	},
	
	next: function(){
		return this.go(1).fire('next', this.getState());
	},
	
	getState: function(){
		return this._stack[this._offset];
	}

});


return State;

});