/** 
 * Form Nerve Center
 * form/core is a plugin-manager
 */
 
/**


Nerve center

 - option member
 - event register
 - comm getter
 - comm setGetter
 - element adoption
 
 - custom event
 - custom


*/
 
 
KM.define(function(K, require){
	
var NC = new Class({
	
	_nerves: [],
	
	_NC: true,

	initialize: function(element, options){
		element = $(element)
		
		var self = this;
		
		if(element){
			self.element = element;
		}
	},
	
	_addNerve: function(Neuron){
		var self = this,
			o = self.options,
			options = K.mix({}, o, true, cell._optionMembers || []),
			
			nerve = new Neuron(self.element, options, self);
			
		self._nerves.push(nerve);
		
		nerve._valGetter && self._setValGetter( nerve._valGetter(self.val) );
		
	},
	
	_addEvent: function(){
	},
	
	val: function(){
		return element.get('value');
	},
	
	_setValGetter: function(getter){
		this.val = getter;
	}
});
	
	

return NC;


});