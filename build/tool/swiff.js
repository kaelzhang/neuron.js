KM.define([], function(K){

/**
 * modified from mootools.Swiff
---

name: Swiff

description: Wrapper for embedding SWF movies. Supports External Interface Communication.

license: MIT-style license.

credits:
  - Flash detection & Internet Explorer + Flash Player 9 fix inspired by SWFObject.

requires: [Options, Object, Element]

provides: Swiff

...
*/

var flash_version,

	NS_NAME = 'KM._swiff',
	namespace = K.namespace(NS_NAME),
	Swiff;

Swiff = new Class({

	Implements: Options,

	options: {
		id: null,
		height: 1,
		width: 1,
		container: null,
		properties: {},
		params: {
			quality: 'high',
			allowScriptAccess: 'always',
			wMode: 'window',
			swLiveConnect: true
		},
		callback: {},
		vars: {}
	},

	toElement: function(){
		return this.object;
	},

	initialize: function(path, options){
	
		var self = this,
			guid = self._guid = K.guid(),
			o = self.setOptions(options);
			id = self.id = o.id || self.instance,
			
			container = document.id(o.container),
			
			params = o.params, 
			vars = o.vars, 
			callback = o.callback,
			properties = K.mix({height: o.height, width: o.width}, o.properties);

		for (var callbackName in callback){
			namespace['_' + guid][cb] = (function(option){
				return function(){
					return option.apply(self.object, arguments);
				};
				
			})(callback[callBack]);
			
			vars[callBack] = 'Swiff.CallBacks.' + this.instance + '.' + callBack;
		}

		params.flashVars = Object.toQueryString(vars);
		if (Browser.ie){
			properties.classid = 'clsid:D27CDB6E-AE6D-11cf-96B8-444553540000';
			params.movie = path;
		} else {
			properties.type = 'application/x-shockwave-flash';
		}
		properties.data = path;

		var build = '<object id="' + id + '"';
		for (var property in properties) build += ' ' + property + '="' + properties[property] + '"';
		build += '>';
		for (var param in params){
			if (params[param]) build += '<param name="' + param + '" value="' + params[param] + '" />';
		}
		build += '</object>';
		this.object = ((container) ? container.empty() : new Element('div')).set('html', build).firstChild;
	},

	replaces: function(element){
		element = document.id(element, true);
		element.parentNode.replaceChild(this.toElement(), element);
		return this;
	},

	inject: function(element){
		document.id(element, true).appendChild(this.toElement());
		return this;
	},

	remote: function(functionName){
		var rs = this.toElement().CallFunction('<invoke name="' + functionName + '" returntype="javascript">' + __flash__argumentsToXML(arguments, 2) + '</invoke>');
		
		return eval(rs);
	}

});



K.mix({
	_version: function(){
		var version = (Function.attempt(function(){
			return navigator.plugins['Shockwave Flash'].description;
		}, function(){
			return new ActiveXObject('ShockwaveFlash.ShockwaveFlash').GetVariable('$version');
		}) || '0 r0').match(/\d+/g);
		
		flash_version = {
			version: Number(version[0] || '0.' + version[1]) || 0,
			build: Number(version[2]) || 0
		};
	},
	
	flashVersion: function(){
		return flash_version;
	}
};

K._onceBefore('flashVersion', '_version', Swiff);


return Swiff;

});