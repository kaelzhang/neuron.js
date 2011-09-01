/**
 * plugin enum for plugin module names and the more of module names
 */
KM.define(function(K){

function setPrefix(prefix, items){
	if(K.isString(prefix)){
		K.makeArray(items).forEach(function(name){
			alias[name] = prefix + '/' + name;
		});
	}
};

var alias = {};

return {
	prefix: setPrefix,
	
	getName: function(name){
		return alias[name] || name;
	}
}

});