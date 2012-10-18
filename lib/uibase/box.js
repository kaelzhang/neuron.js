module.exports = NR.Class({
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

}, {
	visible: {
		setter: function(v){
			this.element.css('display', v ? '' : 'none');
		}
	}
});