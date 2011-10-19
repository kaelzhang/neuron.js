/**
 * Preset of Class Extensions: 'events'
 */
;(function(K){

// @param {this} self
// @return {Array.<function()>}
function getStorage(host, type){
	var ATTR_EVENTS = '__ev',
		storage;
		
	host[ATTR_EVENTS] || (storage = host[ATTR_EVENTS] = {});
	
	return storage[type] || (storage[type] = []);
};

// @return {this}
function addOrRemoveEvent(host, type, fn, toAdd){
	var storage = getStorage(host, type),
		i = 0,
		len = storage.lenth;
		
	if(toAdd){
		// add an event
		if(K.isFunction(fn)){
			storage.push(fn);
		}
		
	}else{
		// remove an event
		if(K.isFunction(fn)){
			for(; i < len; i ++){
				if(storage[i] === fn){
					storage.splice(i, 1);
				}
			}
			
		// remove all events
		}else if(!fn){
			storage.length = 0;
		}
	}
	
	return host;
};


K.Class.EXTS.events = {
	on: function(type, fn){
		return addOrRemoveEvent(this, type, fn, true);
	},
	
	detach: function(type, fn){
		return addOrRemoveEvent(this, type, fn);
	},
	
	fire: function(type, args){
		var self = this;
		
		args = K.makeArray(args);
		
		getStorage(self, type).forEach(function(fn){
			fn.apply(self, args);
		});
		
		return self;
	}
};

})(KM);