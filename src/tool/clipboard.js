KM.define(['ui/position', 'tool/swiff'], function(K, require){

var Position = require('ui/position'),
	Swiff = require('tool/swiff'),
	
	NS_NAME = 'KM._clipboard',
	
	GETTER_STR = 'get',
	CALLBACK_STR = 'cb',
	
	namespace = K.namespace(NS_NAME);
	
	
	
function Clipboard(cfg){
	
};

Clipboard.prototype = {
	createLoader: function(getter, callback){
		var guid = K.guid(),
			getter_name 	= GETTER_STR + '_' + guid,
			callback_name 	= CALLBACK_STR + '_' + guid;
			
		namespace[getter_name] = getter;
		namespace[callback_name] = callback;
		
		return {
			getContent	: NS_NAME + '.' + getter_name,
			callback	: NS_NAME + '.' + callback_name
		}	
	}
};




return Clipboard;
	
	
	
});