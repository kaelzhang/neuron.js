KM.define(['~/compare'], function(K, require){
	var compare = require('~/compare');
	
	return {
		max: function(a, b){
			return compare.isME(a, b) ? a : b;
		},
		
		min: function(a, b){
			return compare.isLE(a, b) ? a : b;
		}
	}
});