KM.define(['./core'], function(K, require){

var Fx = require('./core'),
	FxCSS,
	
	// atom
	ATOM = {},
	makeArray = K.makeArray,
	
	PARSERS = {
		Color: {
			parse: function(value){
				if (value.match(/^#[0-9a-f]{3,6}$/i)) return value.hexToRgb(true);
				return ((value = value.match(/(\d+),\s*(\d+),\s*(\d+)/))) ? [value[1], value[2], value[3]] : false;
			},
			compute: function(from, to, delta){
				return from.map(function(value, i){
					return Math.round(Fx.compute(from[i], to[i], delta));
				});
			},
			serve: function(value){
				return value.map(Number);
			}
		},
	
		Number: {
			parse: parseFloat,
			compute: Fx.compute,
			serve: function(value, unit){
				return (unit) ? value + unit : value;
			}
		},
	
		String: {
			parse: function(){
				return false; 
			},
			compute: function(zero, one){
				return one;
			},
			serve: function(zero){
				return zero;
			}
		}
	
	};

FxCSS = K.Class({

	Extends: Fx,

	// prepares the base from/to object
	_prepare: function(element, property, args){
		var style, parsed;
		
		// [100, 1000]
		args = makeArray(args);
		
		if (args[1] == null){
			args[1] = args[0];
			
			style = element.css(property);
			
			args[0] = style === 'auto' ? 0 : style;
		}
		
		parsed = args.map(this._parse);
		
		return {
			from: parsed[0], 
			to: parsed[1]
		};
	},

	// parses a value into an array
	_parse: function(value){
		value = K.isFunction(value) ? value() : value;
		
		value = typeof value == 'string' ? value.split(' ') : makeArray(value);
		
		return value.map(function(val){
			val = String(val);
			
			var found = false,
				parsers = PARSERS,
				parser,
				key,
				parsed;
				
			for(key in parsers){
				parser = parsers[key];
				
				parsed = parser.parse(val);
				if (parsed || parsed === 0){
					found = {
						value: parsed, 
						parser: parser
					};
					
					break;
				}
			}
			
			found = found || {
				value: val, 
				parser: PARSERS.String
			};
			
			return found;
		});
	},

	// computes by a from and to prepared objects, using their parsers.
	_compute: function(from, to, delta){
		var computed = [], i = 0, len = Math.min(from.length, to.length);
		
		for(; i < len; i ++){
			computed.push({
				value: from[i].parser.compute(from[i].value, to[i].value, delta), 
				parser: from[i].parser
			});
		}
		
		computed._ = ATOM;
		
		return computed;
	},

	// serves the value as settable
	_serve: function(value, unit){
		if (value._ !== ATOM){
			value = this._parse(value);
		}
		
		var returned = [];
		value.each(function(bit){
			returned = returned.concat(bit.parser.serve(bit.value, unit));
		});
		
		return returned;
	},

	// renders the change to an element
	_render: function(element, property, value, unit){
		element.css(property, this._serve(value, unit));
	}
});


FxCSS.Parsers = PARSERS;

return FxCSS;

});