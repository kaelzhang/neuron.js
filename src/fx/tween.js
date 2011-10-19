KM.define(['./css'], function(K, require){

var FxCSS = require('./css'),
	FxCSS_start = FxCSS.prototype.start;

return K.Class({

	Extends: FxCSS,

	initialize: function(element, options){
		var self = this;
		
		self.element = self.subject = $(element);
		FxCSS.call(self, options);
	},

	_set: function(property, now){
		var self = this;
	
		if (arguments.length == 1){
			now = property;
			property = self.property;
		}
		
		self._render(self.element, property, now, self.get('unit'));
		return self;
	},

	start: function(property, from, to){
		var self = this,
			args,
			parsed;
	
		if (!self._check(property, from, to)){
			return self;
		}
		
		args = K.makeArray(arguments);
		
		if(!self.get('property')){
			self.property = args.shift();
		}
		
		parsed = this._prepare(self.element, self.property, args);
		
		return FxCSS_start.call(self, parsed.from, parsed.to);
	}

});

});