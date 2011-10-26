KM.define(['./css'], function(K, require){

var FxCSS = require('./css'),
	FxCSS_proto = FxCSS.prototype;


return K.Class({
	Extends: FxCSS,

	initialize: function(element, options){
		this.element = this.subject = $(element);
		FxCSS.call(this, options);
	},

	_set: function(now){
		var self = this;
		
		for (var p in now){
			self.render(self.element, p, now[p], self.options.unit);
		}
		
		return self;
	},

	_compute: function(from, to, delta){
		var now = {},
			p;
			
		for (p in from){
			now[p] = FxCSS_proto._compute.call(this, from[p], to[p], delta);
		}
		
		return now;
	},

	start: function(properties){
		var self = this;
		
		var from = {}, to = {},
			p,
			parsed;
		
		for (p in properties){
			parsed = self._prepare(self.element, p, properties[p]);
			
			from[p] = parsed.from;
			to[p] = parsed.to;
		}
		
		return FxCSS_proto.start.call(self, from, to);
	}

});

});

/**
 change log:

 2011-10-26  Kael
 - migrate to Neuron
 - remove chain methods of mootools
 
 
 */