/**
 * module  asqueue
 * author  Kael Zhang

 * Asynchronous and Synchronous Queue: 
 * - Converter: put all specified methods into an executing queue before initialization methods completed
 * - Runner: or execute a specified list of methods
 * which could:
 * - keep the executing ORDER even if the queue is mixed with both asynchronous and synchronous methods
 * - make sure method A will be executed before method B if specified
 * - make sure a method will be executed only once
 
 <code>
 	// .plugin method is an asynchronous method, but .init method relies on the effect which the .plugin method caused
 	new Switch().plugin('carousel').init({...});
 </code>
 */
 
KM.define([], function(K){

var NOOP = function(){}

ASQueue = {},
    
// meta prototypes
ASQ_meta = {
	Runner: {
		/**
	     * run the list of configured methods
	     */
	    run: function(){
	    	var self = this;
	    	
	    	self._sd();
	    	
	    	self._stack = Array.clone(self._presetItems);
	    	self._items = self.host;
	    	
	    	self.resume();
	    },
	    
	    stop: function(){
	    	this._clean();
	    },
	    
	    _sd: function(){
	    	var self = this, items = self._presetItems, i = 0, len = items.length;
	    	
	    	for(; i < len; i ++){
	    		items[i] = self._santitize(items[i]);
	    	}
	    	
	    	self._sd = NOOP;
	    }
	},

	Converter: {
		/**
	     * make all specified method queue-supported
	     */
	    on: function(){
	    	var self = this, host = self.host;
	    
	    	K.makeArray(self._presetItems).each(function(i){
	    		i && self._add(i, host);
	    	});
	    	
	    	return self;
	    },
	    
	    /**
	     * recover the converted methods
	     */
	    off: function(){
	    	var name, self = this, host = self.host;
	    	
	    	for(name in self._items){
	    		delete host[name];
	    		host[name] = self._items[name];
	    	}
	    	
	    	self._clean();
	    	return self;
	    },
	    
	    _add: function(obj, host, undef){
	    	var self = this, name;

			obj = self._santitize(obj);
			name = obj.name;
			
			fn = self._items[name] = self._items[name] || host[name];
			
			if(fn){
				host[name] = function(){
					// 
					if(
						!self._history.contains(obj.before) && 
						(!obj.once || 
							!self._history.contains(name)
						)
					){
						self._stack.push({
							auto: obj.auto,
							once: obj.once,
							name: name,
							arg: arguments
						});
						
						self._history.push(name);
					}
					
					// avoid recursive invocation
					setTimeout(function(){ self._next(); }, 0);
					
					return host; // chain
				}
			}
	    }
	}
},

ASQ_proto = {
	_items: {},
    _stack: [],
    _history: [],
    
    initialize: function(host, items){
    	var self = this;
    
    	self.host = host;
    	self._presetItems = items;
    },
    
    /**
     * resume the paused executing queue
     */
    resume: function(){
    	var self = this;
    	self.processing = false;
    	
    	return self._next();
    },
    
    // apply default settings
    // 'method' -> {name: 'method'}
    _santitize: function(obj, undef){
    	var self = this;
    
    	if(K.isString(obj)){
    		obj = {name: obj};
    	}
    	
    	return K.mix({
    		auto: true,
    		once: false
    	}, obj);
    },
    
    _clean: function(){
    	var self = this;
    	self._items = {};
    	self._history.length = 0;
    	self._stack.length = 0;
    },
    
    _next: function(){
    	var self = this,
    		current, fn;

    	if(!self.processing && (current = self._stack.shift()) && (fn = self._items[current.name])){
    		self.processing = true;
    		
    		// clean the method before executing
    		if(current.once){
    			self._items[current.name] = NOOP;
    		}
    	
    		fn.apply(self.host, current.arg || []);
    		
    		return current.auto && self.resume();
    	}
    }
};

// ASQueue.Runner
// ASQueue.Converter
['Runner', 'Converter'].each(function(type){
	var ASQ = ASQueue[type] = new Class(ASQ_proto);

	K.mix(ASQ.prototype, ASQ_meta[type]);
});

return ASQueue;

});