/**
 * Switch Plugin: fade
 * author  Kael Zhang
 */
 
var 

accordion = require('./accordion'),
mix = NR.mix,
fade = {},

STR_ATTRS = 'ATTRS',

ACCORDION_ATTRS = accordion[STR_ATTRS],	
	
ATTRS = {
	property: {
		readOnly: true,
		value: 'opacity'
	},
	
	activeValue: {
		value: 1
	},
	
	normalValue: {
		value: 0
	},
	
	fx: {
		value: {
			duration: 1000
		}
	}
};

fade[STR_ATTRS] = ATTRS;

// mix attributes
mix(ATTRS, ACCORDION_ATTRS, false);

// mix value of fx
mix(ATTRS.fx.value, ACCORDION_ATTRS.fx.value, false);

// mix plugin members
mix(fade, accordion, false);

module.exports = fade;