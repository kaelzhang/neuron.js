/**
 * plugin enum for plugin module names and the more of module names
 */
KM.define(function(K){

function setPrefix(prefix, items){
	K.makeArray(items).forEach(function(name){
		alias[name] = prefix + '/' + name;
	});
};

var alias = {},
	PLUGIN_BASE = 'switch/';

setPrefix('more', []);

return {
	prefix: setPrefix,
	
	modName: function(name){
		name = name.toLowerCase();
	
		return PLUGIN_BASE + (alias[name] || name);
	}
};


});