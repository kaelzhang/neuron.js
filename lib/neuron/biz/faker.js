/**
 * module  biz/faker
 */
;(function(K){

function Faker(name, config){
	config || (config = {});

	var self = this;
		mod = config.mod,
		f;
		
	self._q = config.noQueue;
	self._queue = [];
	self._host = config.host || K.__HOST;
	self._name = name;
	self._faked = f = config.type === 'namespace' ? {} : function(){
		self.q(arguments);
		return f;
	};
	
	K.makeArray(config.methods).forEach(self.make, this);
	
	mod && K.provide(mod, function(K, realExports){
		host[name] = realExports;
		self.real();
	});
};

Faker.prototype = {
	queue: function(args, methodName){
		!this._q && this._queue.push({
			args: args,
			name: methodName
		});
	},
	
	/**
	 * @param {string}
	 */
	make: function(methodName){
		var self = this,
			faked = self._faked;
			
		faked[methodName] = function(){
			self.queue(arguments, methodName);
			return faked;
		};
	},
	
	// making the actions come true out of the pending queue
	real: function(){
		var self = this,
			real_method = self._host[self._name],
			last_return = real_method;
		
		self._queue.forEach(function(queued){
			var name = queued.name,
				method,
				L = last_return,
				args = queued.args;
			
			if(name){
				L[name].apply(L, args);
			}else{
				last_return = real_method.apply(null, args);
			}
		});
		
		// free
		self._queue.length = 0;
	}
};


/** 
 * method to fake a global function to put its invocations into a queue,
 * until the real implementation attached,
 * and then faker will tring to fetch the relavent module, making it real
 
 * but the method to be faked should fit several conditions:
  	- the method has no getter methods or there's no use of them
  	- if there's a chaining invocation, the return value of all methods should be the context itself
 
 * @param {string} name
 * @param {Object} config {
 		host: {Object} default to window
 		type: {string} 'namespace' || 'function'
 		methods: {Array}
 		mod: {string} module name for loader
   }
 */
KM.fake = function(name, config){
	var faker = new Faker(name, config);
	
	return {
		real: function(){
			faker.real();
		}
	}
};

})(KM);