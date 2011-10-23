/**
 * Switch Plugin: fade
 * author  Kael Zhang
 */
 
KM.define(['./accordion'], function(K, require){

var accordion = require('./accordion'),
	fade = K.mix({}, accordion),
	
	fade_fx = fade.options = K.clone(accordion.options);
	
fade_fx.duration = 1000;





return K.merge({}, accordion, {
	options: {
		fx: {
			duration: 1000
		},
		property: 'opacity',
		activeValue: 1, 
		normalValue: 0
	}
});

});