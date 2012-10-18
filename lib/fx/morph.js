var 

Fx = require('./core'),
FxCSS = require('./css');

module.exports = NR.Class({
	Extends: Fx,
	
	Implements: FxCSS,

	initialize: function(element, options){
		this.element = this.subject = $(element);
		Fx.call(this, options);
	},

	_set: function(now){
		var self = this;
		
		for (var p in now){
			self._render(self.element, p, now[p], self.get('unit'));
		}
		
		return self;
	},

	_compute: function(from, to, delta){
		var now = {},
			p;
			
		for (p in from){
			now[p] = FxCSS._compute.call(this, from[p], to[p], delta);
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
		
		return Fx.prototype.start.call(self, from, to);
	}

});

/**
 change log:
 
 2012-02-08  Kael:
 - major bug fixes

 2011-10-26  Kael
 - migrate to Neuron
 - remove chain methods of mootools
 
 
 */