/**
 * module  mvp/presenter
 * connect view and model togethor
 */
KM.define(['event/live', './model', ''], function(K, require, exports){

var 

Live = require('event/live'),
Model = require('./model'),

Presenter = K.Class({
	Implements: 'attrs',
	
	initialize: function(options){
		this.set(options);
	},
	
	register: K._overloadSetter(function(name){
		
	}),
	
	_updateView: function(){
		this.view.render();
	},
	
	_updateModel: function(){
		
	},
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
	 {
	 	'<selector>': {
	 		'<event-type>': dataGetter
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
		setter: function(events){
			if(K.isPlainObject(events)){
				var key,
					handler,
					element = this.element;
				
				for(key in events){
					handler = events[key];
					key = key.split(' ');
					Live.on(element, key[0], key[1], );
				}
			}
			
			return events;
		}
	},
	
	model: {
		setter: function(v){
			return this.model = v || new Model();
		}
	},
	
	view: {
		setter: function(){
			
		}
	}
	
});


return Presenter;

});