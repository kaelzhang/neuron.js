/**
 * module  mvp/presenter
 * connect view and model togethor
 */
KM.define(['event/live', './model'], function(K, require, exports){

var 

Live = require('event/live'),
Model = require('./model'),

Presenter = K.Class({
	Implements: 'attrs',
	
	initialize: function(options){
		var self = this;
	
		self.set(options);
		
		self._dealEvents('on');
		self._observeModel();
		
		if(self.get('hasInit')){
			self._init();
		}
	},
	
	destroy: function(){
		this._dealEvents('off');
		delete this._model;
		delete this.view;
	},
	
	_init: function(data){
		var self = this,
			model = self.get('model');
	
		model.update(data);
		model.sync('read', function(data){
			self.view.render(data);
		});
	},
	
	// model: Model,
	
	// @type {Object} 
	// @see ATTRS.events
	// events: {}
	 
	_dealEvents: function(action){
		var self = this,
			subject = self.get('subject');
	
		K.each(self.get('events'), function(events, selector){
			K.each(events, function(actionName, type){
				var action = K.isFunction(actionName) ? actionName : self[actionName];
			
				Live[action](subject, type, selector, action);
			});
		});
	},
	
	/**
	 * 
	 */
	_observeModel: function(){
		var model = this.get('model');
		
		model.on({
			'update': this._applyChange
		});
	},
	
	/**
	 * apply change event
	 */
	_applyChange: function(){
		
	}
	
	
});


/**
 myPresenter.on({
 	'email': function(){
 		// check email
 	},
 	
 	'username': function(){
 		// check username
 	},
 	
 	'button': function(){
 		new Ajax(...).send();
 	}
 })
 */


K.Class.setAttrs(Presenter, {

	/**
	 live events
	
	 syntax:
	 
	 
	 @param {string} selector
	 @param {string} event-type
	 @param {string|function()} event-handler
	 	{string} 
	 	{function()} handler function
	 
	 {
	 	'<selector>': {
	 		'<event-type>': <event-handler>
	 	}
	 }
	 
	 example:
	 {
	 	'.tab': {
	 		click: getDestinationIndex
	 	}
	 }
	 
	 */
	events: {
		getter: function(v){
		
			// user options has higher priority
			return v || this.events || {};
		}
	},
	
	/**
	 * the container element to be delegated to
	 */
	container: {
		getter: function(){
			return this.view.get('container');
		}
	},
	
	model: {
		setter: function(v){
			return this._model = v;
		},
		
		getter: function(v){
			if(!v){
				var M = this.model || Model;
				v = new M;
				
				this.set('model', v);
			}
		
			return v;
		}
	},
	
	view: {
		setter: function(v){
			return this.view = v;
		}
	},
	
	/**
	 * @type {boolean} whether the presenter 
	 */
	hasInit: {
		value: false
	}
	
});


return Presenter;

});