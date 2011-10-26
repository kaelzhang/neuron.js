/**
 * Switch Plugin: fade
 * author  Kael Zhang
 */
 
KM.define(['./accordion'], function(K, require){

var accordion = require('./accordion'),
	fade = {
		options: {
			property: 'opacity',
			activeValue: 1, 
			normalValue: 0,
			
			fx: {
				duration: 1000
			}
		}
	};
	
K.mix(fade, accordion, false);
K.mix(fade.options, accordion.options, false);
K.mix(fade.options.fx, accordion.options.fx, false);

return fade;

});