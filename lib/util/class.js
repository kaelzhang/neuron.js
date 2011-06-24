/**
 * Class.Extras
 *
 * Different from mootools.Options
 
 * a improved Chain
 */
 
 
/**
 * @usage
 <code>
 	// Implements: Options  					// REMOVED! mootools method
 	// Implements: [Options, Chain]				// REMOVED! mootools method
 	
 	Implements: 'options'						// preset Class
 	Implememts: 'options chain'					// multiple prest Class
 	
 	Implements: MyClass							// custom Class
 	Implements: ['options', 'chain', MyClass]	// mixed
 </code>
 */

;(function(K){

function removeOn(string){
	return string.replace(/^on([A-Z])/, function(full, first){
		return first.toLowerCase();
	});
};

var Chain, Events, Options,
	class_enum,

	// Mootools Mutators
	mootools_class_enum = Class.Mutators,
	mootools_implement = mootools_class_enum.Implements;
	

Chain = new Class({

	_chain: [],

	chain: function(){
		this._chain.append(Array.flatten(arguments));
		return this;
	},

	callChain: function(){
		return (this._chain.length) ? this._chain.shift().apply(this, arguments) : false;
	},

	clearChain: function(){
		this._chain.empty();
		return this;
	},
	
	/**
	 * method to set current method to trigger the pipline chain
	 
	 * @param methodName {String} method name of the current instance
	 * @param judge {Function}
	 * if returns
	 *		- 'chain'	: chain the method
	 *		- 'stop'	: stop the method
	 *		-  other	: exec the method
	 */
	setChain: function(methodName, judge){
		var self = this,
			method = self[methodName];
			
			
		if(method){
			self[methodName] = function(){
				var result = judge && judge.call(self);
				
				switch(result){
					case 'chain':
						self.chain(function(){
							method.apply(self, arguments);
						});
						break;
							
					case 'cancel':
						break;
					
				}
				
				return result || method.apply(self, arguments);
			}
		}
		
		return self;
	}

});


Events = new Class({

	_events: {},

	addEvent: function(type, fn, internal){
		type = removeOn(type);

		

		this._events[type] = (this._events[type] || []).include(fn);
		if (internal) fn.internal = true;
		return this;
	},

	addEvents: function(events){
		for (var type in events) this.addEvent(type, events[type]);
		return this;
	},

	fireEvent: function(type, args, delay){
		type = removeOn(type);
		var events = this._events[type];
		if (!events) return this;
		args = Array.from(args);
		events.each(function(fn){
			if (delay) fn.delay(delay, this, args);
			else fn.apply(this, args);
		}, this);
		return this;
	},
	
	removeEvent: function(type, fn){
		type = removeOn(type);
		var events = this._events[type];
		if (events && !fn.internal){
			var index =  events.indexOf(fn);
			if (index != -1) delete events[index];
		}
		return this;
	},

	removeEvents: function(events){
		var type;
		if (typeOf(events) == 'object'){
			for (type in events) this.removeEvent(type, events[type]);
			return this;
		}
		if (events) events = removeOn(events);
		for (type in this._events){
			if (events && events != type) continue;
			var fns = this._events[type];
			for (var i = fns.length; i--;) if (i in fns){
				this.removeEvent(type, fns[i]);
			}
		}
		return this;
	}

});

Options = new Class({

	// different!
	setOptions: function(options, presets, useMerge){
		presets = presets || this.options;
	
		var self = this,
			o = useMerge ?
				K.mix(options || {}, presets, false)
				: Object.merge({}, presets, options);
		
		if (self.addEvent){
			for (var option in o){
				if (type(o[option]) === 'function' && (/^on[A-Z]/).test(option) ){
					self.addEvent(option, o[option]);
					delete o[option];
				}
			}
		}
		
		return self.options = o;
	}

});

class_enum = {
	options: Options,
	events: Events,
	chain: Chain
};


/**
 * override Mootools Mutators
 */
mootools_class_enum.Implements = function(items){
	var isString = K.isString,
		_items = isString(items) ? items.trim().split(' ') : items,
		newItems = [],
		i = 0,
		len = _items.length,
		m,
		enum = class_enum;
		
	for(; i < len; i ++){
		m = _items[i];
		
		m = isString(m) ? enum[ m.trim().toLowerCase() ] : m;
		
		m && newItems.push(m);
	}
	
	mootools_implement.call(this, newItems);
};


K.__class = class_enum;


})(KM);

KM.define({});



/**
 * TODO:


 * change log:
 * 2011-04-12  Kael Zhang:
 * - 创建
 * - 修改Class.Extra的部分实现，移除全局的Options, Chain, Events方法
 */