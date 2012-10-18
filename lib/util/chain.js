/**
 * author  Kael Zhang
 * diff with mootools', acting as a plugin and unobtrusively making a method chain supported
 */

/**
 * method to set current method to trigger the pipline chain
 
 * @param methodName {String} method name of the current instance
 * @param judge {Function}
 * if returns
 *		- 'chain'	: chain the method
 *		- 'stop'	: stop the method
 *		-  other	: exec the method
 */
function setChain(methodName, judge, host){
	var method = host[methodName];
	
	if(method){
		host[methodName] = function(){
			var self = this,
				result = judge && judge.call(self);
			
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
	
	return host;
};


var Chain = new Class({

	_chain: [],

	chain: function(){
		this._chain.append(Array.flatten(arguments));
		return this;
	},

	callChain: function(){
		return (this._chain.length) ? this._chain.shift().apply(this, arguments) : false;
	},

	clearChain: function(){
		this._chain.length = 0;
		return this;
	},

	setChain: function(methodName, judge){
		return setChain(methodName, judge, this);
	}
});

/**
 * unobtrusively make a object or a class chain supported
 * @param {string} methodName
 * @param {function()} judge
 * @param {function()|Object} host class or class instance or plain object
 */
Chain.setChain = function(methodName, judge, host){
	if(NR.isFunction(host)){
		host.implement(Chain);
		host = host.prototype;
	}
	
	NR.isObject(host) && setChain(methodName, judge, host);
};

module.exports = Chain;


/**
 TODO:
 
 A. merge Chain and ASQueue together as Queue
 
 */
