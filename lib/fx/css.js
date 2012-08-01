NR.define(['./core'], function(K, require){

var 

Fx = require('./core'),
	
// atom
ATOM_ALREADY_COMPUTED = {},
makeArray = K.makeArray,

PARSERS = {
	Color: {
		parse: function(value){
			if (value.match(/^#[0-9a-f]{3,6}$/i)) return value.hexToRgb(true);
			return ((value = value.match(/(\d+),\s*(\d+),\s*(\d+)/))) ? [value[1], value[2], value[3]] : false;
		},
		compute: function(from, to, progress){
			return from.map(function(value, i){
				return Math.round(Fx.compute(from[i], to[i], progress));
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

},


/**
 * @interface
 * @private
 
 * FxCSS could not be used alone. please implement it
 */
FxCSS = {

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
		value = String( K.isFunction(value) ? value() : value );
			
		var found,
			parsers = PARSERS,
			parser,
			key,
			parsed;
			
		for(key in parsers){
			parser = parsers[key];
			
			parsed = parser.parse(value);
			if (parsed || parsed === 0){
				found = {
					value: parsed, 
					parser: parser
				};
				
				break;
			}
		}
		
		found = found || {
			value: value,
			parser: PARSERS.String
		};
		
		return found;
	},

	// computes by a from and to prepared objects, using their parsers.
	_compute: function(from, to, progress){
		return {
			_: 		ATOM_ALREADY_COMPUTED,
			value:  from.parser.compute(from.value, to.value, progress),
			parser: from.parser
		};
	},

	// serves the value as settable
	_serve: function(sprite, unit){
		if (sprite._ !== ATOM_ALREADY_COMPUTED){
			sprite = this._parse(sprite);
		}
		
		return sprite.parser.serve(sprite.value, unit);
	},

	// renders the change to an element
	_render: function(element, property, value, unit){
		element.css(property, this._serve(value, unit));
	}
};

return FxCSS;

});


/**
 change log:
 
 2011-10-19  Kael:
 - refractor Fx.CSS. Fx.CSS is now a extension of Fx.Tween or Fx.Morph
 
 
 
 
 */