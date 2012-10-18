/**
 * module  mvp/presenter
 * connect view and model togethor
 */

var 

Live = require('event/live'),
Model = require('./model');

module.exports = NR.Class({
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
		delete this.view;
	},
	
	applyData: function(data){
        
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
	_dealEvents: function(actionType){
		var self = this,
			subject = self.get('subject');
	
		NR.each(self.get('events'), function(events, selector){
			NR.each(events, function(actionName, type){
				var action = NR.isFunction(actionName) ? actionName : self[actionName];
			
				Live[actionType](subject, type, selector, action);
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
}, {

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
        setter: function(v){
            this.events || (this.events = {});
            
            // user option has higher priority
            NR.mix(this.events, v);
        },
        
		getter: function(v){
			return this.events || {};
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
		getter: function(v){
            // user option has higher priority
			return v || this.view;
		}
	},
	
	/**
	 * @type {boolean} whether the presenter 
	 */
	hasInit: {
		value: false
	}
	
});