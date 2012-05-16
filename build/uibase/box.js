KM.define([], function(K, require){

var 

Box = K.Class({
	Implements: 'attrs events',

	initialize: function(){
		
	},
	
	show: function(){
		this.set('visible', true);
		this.fire('show');
	},
	
	hide: function(){
		this.set('visible', false);
		this.fire('hide');
	}
}),

ATTRS = {
	visible: {
		setter: function(v){
			this.element.css('display', v ? '' : 'none');
		}
	}
};


K.Class.setAttrs(Box, ATTRS);


});