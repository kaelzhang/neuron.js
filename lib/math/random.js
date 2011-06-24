KM.define(function(K, require){
	var filter = require('./filter');

	return function(a, b){
		var max = filter.max(a, b),
			min = filter.min(a, b);
			
		return Math.random() * ( max - min ) + min;
	}
});
