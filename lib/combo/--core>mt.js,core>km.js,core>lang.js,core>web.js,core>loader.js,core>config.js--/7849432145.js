/*!
 * 1. A modified and simplified mootools.js
 * 2. Kael.me framework core, based on mootools lib
 *	- Copyright 2011, Kael Zhang(i@kael.me)
 */

/**
 * Mootools.core
 * modified version from the mootools builder
 * PAY ATTENSION!
 
 * @include
 * Array, Number, String, Function, Object, Event, Browser
 * Class, Class.Extra
 * Slick.*
 * Element, Element.Event
 
 * @exclude
 * - Domready
 * - Element.Dimensions
 * - Fx
 * - Request
 * - Cookie
 * - JSON
 * - swiff
 * - Browser.Request!
 * - Browser.Plugins!
 * - Function.bind!
 */


/*
---
MooTools: the javascript framework

web build:
 - http://mootools.net/core/ab319cbef54c7c08eb1feb0fde32f1f5

packager build:
 - packager build Core/Array Core/String Core/Number Core/Function Core/Object Core/Event Core/Browser Core/Class Core/Class.Extras Core/Slick.Parser Core/Slick.Finder Core/Element Core/Element.Style Core/Element.Event

/*
---

name: Core

description: The heart of MooTools.

license: MIT-style license.

copyright: Copyright (c) 2006-2010 [Valerio Proietti](http://mad4milk.net/).

authors: The MooTools production team (http://mootools.net/developers/)

inspiration:
  - Class implementation inspired by [Base.js](http://dean.edwards.name/weblog/2006/03/base/) Copyright (c) 2006 Dean Edwards, [GNU Lesser General Public License](http://opensource.org/licenses/lgpl-license.php)
  - Some functionality inspired by [Prototype.js](http://prototypejs.org) Copyright (c) 2005-2007 Sam Stephenson, [MIT License](http://opensource.org/licenses/mit-license.php)

provides: [Core, MooTools, Type, typeOf, instanceOf, Native]

...
*/

(function(){

this.MooTools = {
	version: '1.3.2',
	build: 'c9f1ff10e9e7facb65e9481049ed1b450959d587'
};

// typeOf, instanceOf

var typeOf = this.typeOf = function(item){
	if (item == null) return 'null';
	if (item.$family) return item.$family();

	if (item.nodeName){
		if (item.nodeType == 1) return 'element';
		if (item.nodeType == 3) return (/\S/).test(item.nodeValue) ? 'textnode' : 'whitespace';
	} else if (typeof item.length == 'number'){
		if (item.callee) return 'arguments';
		if ('item' in item) return 'collection';
	}

	return typeof item;
};

var instanceOf = this.instanceOf = function(item, object){
	if (item == null) return false;
	var constructor = item.$constructor || item.constructor;
	while (constructor){
		if (constructor === object) return true;
		constructor = constructor.parent;
	}
	return item instanceof object;
};

// Function overloading

var Function = this.Function;

var enumerables = true;
for (var i in {toString: 1}) enumerables = null;
if (enumerables) enumerables = ['hasOwnProperty', 'valueOf', 'isPrototypeOf', 'propertyIsEnumerable', 'toLocaleString', 'toString', 'constructor'];

Function.prototype.overloadSetter = function(usePlural){
	var self = this;
	return function(a, b){
		if (a == null) return this;
		if (usePlural || typeof a != 'string'){
			for (var k in a) self.call(this, k, a[k]);
			if (enumerables) for (var i = enumerables.length; i--;){
				k = enumerables[i];
				if (a.hasOwnProperty(k)) self.call(this, k, a[k]);
			}
		} else {
			self.call(this, a, b);
		}
		return this;
	};
};

Function.prototype.overloadGetter = function(usePlural){
	var self = this;
	return function(a){
		var args, result;
		if (usePlural || typeof a != 'string') args = a;
		else if (arguments.length > 1) args = arguments;
		if (args){
			result = {};
			for (var i = 0; i < args.length; i++) result[args[i]] = self.call(this, args[i]);
		} else {
			result = self.call(this, a);
		}
		return result;
	};
};

Function.prototype.extend = function(key, value){
	this[key] = value;
}.overloadSetter();

Function.prototype.implement = function(key, value){
	this.prototype[key] = value;
}.overloadSetter();

// From

var slice = Array.prototype.slice;

Function.from = function(item){
	return (typeOf(item) == 'function') ? item : function(){
		return item;
	};
};

Array.from = function(item){
	if (item == null) return [];
	return (Type.isEnumerable(item) && typeof item != 'string') ? (typeOf(item) == 'array') ? item : slice.call(item) : [item];
};

Number.from = function(item){
	var number = parseFloat(item);
	return isFinite(number) ? number : null;
};

String.from = function(item){
	return item + '';
};

// hide, protect

Function.implement({

	hide: function(){
		this.$hidden = true;
		return this;
	},

	protect: function(){
		this.$protected = true;
		return this;
	}

});

// Type

var Type = this.Type = function(name, object){
	if (name){
		var lower = name.toLowerCase();
		var typeCheck = function(item){
			return (typeOf(item) == lower);
		};

		Type['is' + name] = typeCheck;
		if (object != null){
			object.prototype.$family = (function(){
				return lower;
			}).hide();
			
		}
	}

	if (object == null) return null;

	object.extend(this);
	object.$constructor = Type;
	object.prototype.$constructor = object;

	return object;
};

var toString = Object.prototype.toString;

Type.isEnumerable = function(item){
	return (item != null && typeof item.length == 'number' && toString.call(item) != '[object Function]' );
};

var hooks = {};

var hooksOf = function(object){
	var type = typeOf(object.prototype);
	return hooks[type] || (hooks[type] = []);
};

var implement = function(name, method){
	if (method && method.$hidden) return;

	var hooks = hooksOf(this);

	for (var i = 0; i < hooks.length; i++){
		var hook = hooks[i];
		if (typeOf(hook) == 'type') implement.call(hook, name, method);
		else hook.call(this, name, method);
	}
	
	var previous = this.prototype[name];
	if (previous == null || !previous.$protected) this.prototype[name] = method;

	if (this[name] == null && typeOf(method) == 'function') extend.call(this, name, function(item){
		return method.apply(item, slice.call(arguments, 1));
	});
};

var extend = function(name, method){
	if (method && method.$hidden) return;
	var previous = this[name];
	if (previous == null || !previous.$protected) this[name] = method;
};

Type.implement({

	implement: implement.overloadSetter(),

	extend: extend.overloadSetter(),

	alias: function(name, existing){
		implement.call(this, name, this.prototype[existing]);
	}.overloadSetter(),

	mirror: function(hook){
		hooksOf(this).push(hook);
		return this;
	}

});

new Type('Type', Type);

// Default Types

var force = function(name, object, methods){
	var isType = (object != Object),
		prototype = object.prototype;

	if (isType) object = new Type(name, object);

	for (var i = 0, l = methods.length; i < l; i++){
		var key = methods[i],
			generic = object[key],
			proto = prototype[key];

		if (generic) generic.protect();

		if (isType && proto){
			delete prototype[key];
			prototype[key] = proto.protect();
		}
	}

	if (isType) object.implement(prototype);

	return force;
};

force('String', String, [
	'charAt', 'charCodeAt', 'concat', 'indexOf', 'lastIndexOf', 'match', 'quote', 'replace', 'search',
	'slice', 'split', 'substr', 'substring', 'toLowerCase', 'toUpperCase'
])('Array', Array, [
	'pop', 'push', 'reverse', 'shift', 'sort', 'splice', 'unshift', 'concat', 'join', 'slice',
	'indexOf', 'lastIndexOf', 'filter', 'forEach', 'every', 'map', 'some', 'reduce', 'reduceRight'
])('Number', Number, [
	'toExponential', 'toFixed', 'toLocaleString', 'toPrecision'
])('Function', Function, [
	'apply', 'call', 'bind'
])('RegExp', RegExp, [
	'exec', 'test'
])('Object', Object, [
	'create', 'defineProperty', 'defineProperties', 'keys',
	'getPrototypeOf', 'getOwnPropertyDescriptor', 'getOwnPropertyNames',
	'preventExtensions', 'isExtensible', 'seal', 'isSealed', 'freeze', 'isFrozen'
])('Date', Date, ['now']);

Object.extend = extend.overloadSetter();

Date.extend('now', function(){
	return +(new Date);
});

new Type('Boolean', Boolean);

// fixes NaN returning as Number

Number.prototype.$family = function(){
	return isFinite(this) ? 'number' : 'null';
}.hide();

// Number.random

Number.extend('random', function(min, max){
	return Math.floor(Math.random() * (max - min + 1) + min);
});

// forEach, each

var hasOwnProperty = Object.prototype.hasOwnProperty;
Object.extend('forEach', function(object, fn, bind){
	for (var key in object){
		if (hasOwnProperty.call(object, key)) fn.call(bind, object[key], key, object);
	}
});

Object.each = Object.forEach;

Array.implement({

	forEach: function(fn, bind){
		for (var i = 0, l = this.length; i < l; i++){
			if (i in this) fn.call(bind, this[i], i, this);
		}
	},

	each: function(fn, bind){
		Array.forEach(this, fn, bind);
		return this;
	}

});

// Array & Object cloning, Object merging and appending

var cloneOf = function(item){
	switch (typeOf(item)){
		case 'array': return item.clone();
		case 'object': return Object.clone(item);
		default: return item;
	}
};

Array.implement('clone', function(){
	var i = this.length, clone = new Array(i);
	while (i--) clone[i] = cloneOf(this[i]);
	return clone;
});

var mergeOne = function(source, key, current){
	switch (typeOf(current)){
		case 'object':
			if (typeOf(source[key]) == 'object') Object.merge(source[key], current);
			else source[key] = Object.clone(current);
		break;
		case 'array': source[key] = current.clone(); break;
		default: source[key] = current;
	}
	return source;
};

Object.extend({

	merge: function(source, k, v){
		if (typeOf(k) == 'string') return mergeOne(source, k, v);
		for (var i = 1, l = arguments.length; i < l; i++){
			var object = arguments[i];
			for (var key in object) mergeOne(source, key, object[key]);
		}
		return source;
	},

	clone: function(object){
		var clone = {};
		for (var key in object) clone[key] = cloneOf(object[key]);
		return clone;
	},

	append: function(original){
		for (var i = 1, l = arguments.length; i < l; i++){
			var extended = arguments[i] || {};
			for (var key in extended) original[key] = extended[key];
		}
		return original;
	}

});

// Object-less types

['Object', 'WhiteSpace', 'TextNode', 'Collection', 'Arguments'].each(function(name){
	new Type(name);
});

// Unique ID

var UID = Date.now();

String.extend('uniqueID', function(){
	return (UID++).toString(36);
});



})();


/*
---

name: Array

description: Contains Array Prototypes like each, contains, and erase.

license: MIT-style license.

requires: Type

provides: Array

...
*/

Array.implement({

	/*<!ES5>*/
	every: function(fn, bind){
		for (var i = 0, l = this.length; i < l; i++){
			if ((i in this) && !fn.call(bind, this[i], i, this)) return false;
		}
		return true;
	},

	filter: function(fn, bind){
		var results = [];
		for (var i = 0, l = this.length; i < l; i++){
			if ((i in this) && fn.call(bind, this[i], i, this)) results.push(this[i]);
		}
		return results;
	},

	indexOf: function(item, from){
		var len = this.length;
		for (var i = (from < 0) ? Math.max(0, len + from) : from || 0; i < len; i++){
			if (this[i] === item) return i;
		}
		return -1;
	},

	map: function(fn, bind){
		var results = [];
		for (var i = 0, l = this.length; i < l; i++){
			if (i in this) results[i] = fn.call(bind, this[i], i, this);
		}
		return results;
	},

	some: function(fn, bind){
		for (var i = 0, l = this.length; i < l; i++){
			if ((i in this) && fn.call(bind, this[i], i, this)) return true;
		}
		return false;
	},
	/*</!ES5>*/

	clean: function(){
		return this.filter(function(item){
			return item != null;
		});
	},

	invoke: function(methodName){
		var args = Array.slice(arguments, 1);
		return this.map(function(item){
			return item[methodName].apply(item, args);
		});
	},

	associate: function(keys){
		var obj = {}, length = Math.min(this.length, keys.length);
		for (var i = 0; i < length; i++) obj[keys[i]] = this[i];
		return obj;
	},

	link: function(object){
		var result = {};
		for (var i = 0, l = this.length; i < l; i++){
			for (var key in object){
				if (object[key](this[i])){
					result[key] = this[i];
					delete object[key];
					break;
				}
			}
		}
		return result;
	},

	contains: function(item, from){
		return this.indexOf(item, from) != -1;
	},

	append: function(array){
		this.push.apply(this, array);
		return this;
	},

	getLast: function(){
		return (this.length) ? this[this.length - 1] : null;
	},

	getRandom: function(){
		return (this.length) ? this[Number.random(0, this.length - 1)] : null;
	},

	include: function(item){
		if (!this.contains(item)) this.push(item);
		return this;
	},

	combine: function(array){
		for (var i = 0, l = array.length; i < l; i++) this.include(array[i]);
		return this;
	},

	erase: function(item){
		for (var i = this.length; i--;){
			if (this[i] === item) this.splice(i, 1);
		}
		return this;
	},

	empty: function(){
		this.length = 0;
		return this;
	},

	flatten: function(){
		var array = [];
		for (var i = 0, l = this.length; i < l; i++){
			var type = typeOf(this[i]);
			if (type == 'null') continue;
			array = array.concat((type == 'array' || type == 'collection' || type == 'arguments' || instanceOf(this[i], Array)) ? Array.flatten(this[i]) : this[i]);
		}
		return array;
	},

	pick: function(){
		for (var i = 0, l = this.length; i < l; i++){
			if (this[i] != null) return this[i];
		}
		return null;
	},

	hexToRgb: function(array){
		if (this.length != 3) return null;
		var rgb = this.map(function(value){
			if (value.length == 1) value += value;
			return value.toInt(16);
		});
		return (array) ? rgb : 'rgb(' + rgb + ')';
	},

	rgbToHex: function(array){
		if (this.length < 3) return null;
		if (this.length == 4 && this[3] == 0 && !array) return 'transparent';
		var hex = [];
		for (var i = 0; i < 3; i++){
			var bit = (this[i] - 0).toString(16);
			hex.push((bit.length == 1) ? '0' + bit : bit);
		}
		return (array) ? hex : '#' + hex.join('');
	}

});




/*
---

name: String

description: Contains String Prototypes like camelCase, capitalize, test, and toInt.

license: MIT-style license.

requires: Type

provides: String

...
*/

String.implement({

	test: function(regex, params){
		return ((typeOf(regex) == 'regexp') ? regex : new RegExp('' + regex, params)).test(this);
	},

	contains: function(string, separator){
		return (separator) ? (separator + this + separator).indexOf(separator + string + separator) > -1 : this.indexOf(string) > -1;
	},

	trim: function(){
		return this.replace(/^\s+|\s+$/g, '');
	},

	clean: function(){
		return this.replace(/\s+/g, ' ').trim();
	},

	camelCase: function(){
		return this.replace(/-\D/g, function(match){
			return match.charAt(1).toUpperCase();
		});
	},

	hyphenate: function(){
		return this.replace(/[A-Z]/g, function(match){
			return ('-' + match.charAt(0).toLowerCase());
		});
	},

	capitalize: function(){
		return this.replace(/\b[a-z]/g, function(match){
			return match.toUpperCase();
		});
	},

	escapeRegExp: function(){
		return this.replace(/([-.*+?^${}()|[\]\/\\])/g, '\\$1');
	},

	toInt: function(base){
		return parseInt(this, base || 10);
	},

	toFloat: function(){
		return parseFloat(this);
	},

	hexToRgb: function(array){
		var hex = this.match(/^#?(\w{1,2})(\w{1,2})(\w{1,2})$/);
		return (hex) ? hex.slice(1).hexToRgb(array) : null;
	},

	rgbToHex: function(array){
		var rgb = this.match(/\d{1,3}/g);
		return (rgb) ? rgb.rgbToHex(array) : null;
	},

	substitute: function(object, regexp){
		return this.replace(regexp || (/\\?\{([^{}]+)\}/g), function(match, name){
			if (match.charAt(0) == '\\') return match.slice(1);
			return (object[name] != null) ? object[name] : '';
		});
	}

});


/*
---

name: Number

description: Contains Number Prototypes like limit, round, times, and ceil.

license: MIT-style license.

requires: Type

provides: Number

...
*/

Number.implement({

	limit: function(min, max){
		return Math.min(max, Math.max(min, this));
	},

	round: function(precision){
		precision = Math.pow(10, precision || 0).toFixed(precision < 0 ? -precision : 0);
		return Math.round(this * precision) / precision;
	},

	times: function(fn, bind){
		for (var i = 0; i < this; i++) fn.call(bind, i, this);
	},

	toFloat: function(){
		return parseFloat(this);
	},

	toInt: function(base){
		return parseInt(this, base || 10);
	}

});

Number.alias('each', 'times');

(function(math){
	var methods = {};
	math.each(function(name){
		if (!Number[name]) methods[name] = function(){
			return Math[name].apply(null, [this].concat(Array.from(arguments)));
		};
	});
	Number.implement(methods);
})(['abs', 'acos', 'asin', 'atan', 'atan2', 'ceil', 'cos', 'exp', 'floor', 'log', 'max', 'min', 'pow', 'sin', 'sqrt', 'tan']);


/*
---

name: Function

description: Contains Function Prototypes like create, bind, pass, and delay.

license: MIT-style license.

requires: Type

provides: Function

...
*/

Function.extend({

	attempt: function(){
		for (var i = 0, l = arguments.length; i < l; i++){
			try {
				return arguments[i]();
			} catch (e){}
		}
		return null;
	}

});

Function.implement({

	attempt: function(args, bind){
		try {
			return this.apply(bind, Array.from(args));
		} catch (e){}
		
		return null;
	},

	/**
	 * mootools.Functionb
	 */
	 
	/*<!ES5>
	bind: function(bind){
		var self = this,
			args = (arguments.length > 1) ? Array.slice(arguments, 1) : null;
		
		return function(){
			if (!args && !arguments.length) return self.call(bind);
			if (args && arguments.length) return self.apply(bind, args.concat(Array.from(arguments)));
			return self.apply(bind, args || arguments);
		};
	},
	</!ES5>*/

	pass: function(args, bind){
		var self = this;
		if (args != null) args = Array.from(args);
		return function(){
			return self.apply(bind, args || arguments);
		};
	},

	delay: function(delay, bind, args){
		return setTimeout(this.pass((args == null ? [] : args), bind), delay);
	},

	periodical: function(periodical, bind, args){
		return setInterval(this.pass((args == null ? [] : args), bind), periodical);
	}

});




/*
---

name: Object

description: Object generic methods

license: MIT-style license.

requires: Type

provides: [Object, Hash]

...
*/

(function(){

var hasOwnProperty = Object.prototype.hasOwnProperty;

Object.extend({

	subset: function(object, keys){
		var results = {};
		for (var i = 0, l = keys.length; i < l; i++){
			var k = keys[i];
			if (k in object) results[k] = object[k];
		}
		return results;
	},

	map: function(object, fn, bind){
		var results = {};
		for (var key in object){
			if (hasOwnProperty.call(object, key)) results[key] = fn.call(bind, object[key], key, object);
		}
		return results;
	},

	filter: function(object, fn, bind){
		var results = {};
		for (var key in object){
			var value = object[key];
			if (hasOwnProperty.call(object, key) && fn.call(bind, value, key, object)) results[key] = value;
		}
		return results;
	},

	every: function(object, fn, bind){
		for (var key in object){
			if (hasOwnProperty.call(object, key) && !fn.call(bind, object[key], key)) return false;
		}
		return true;
	},

	some: function(object, fn, bind){
		for (var key in object){
			if (hasOwnProperty.call(object, key) && fn.call(bind, object[key], key)) return true;
		}
		return false;
	},

	keys: function(object){
		var keys = [];
		for (var key in object){
			if (hasOwnProperty.call(object, key)) keys.push(key);
		}
		return keys;
	},

	values: function(object){
		var values = [];
		for (var key in object){
			if (hasOwnProperty.call(object, key)) values.push(object[key]);
		}
		return values;
	},

	getLength: function(object){
		return Object.keys(object).length;
	},

	keyOf: function(object, value){
		for (var key in object){
			if (hasOwnProperty.call(object, key) && object[key] === value) return key;
		}
		return null;
	},

	contains: function(object, value){
		return Object.keyOf(object, value) != null;
	},

	toQueryString: function(object, base){
		var queryString = [];

		Object.each(object, function(value, key){
			if (base) key = base + '[' + key + ']';
			var result;
			switch (typeOf(value)){
				case 'object': result = Object.toQueryString(value, key); break;
				case 'array':
					var qs = {};
					value.each(function(val, i){
						qs[i] = val;
					});
					result = Object.toQueryString(qs, key);
				break;
				default: result = key + '=' + encodeURIComponent(value);
			}
			if (value != null) queryString.push(result);
		});

		return queryString.join('&');
	}

});

})();




/*
---

name: Browser

description: The Browser Object. Contains Browser initialization, Window and Document, and the Browser Hash.

license: MIT-style license.

requires: [Array, Function, Number, String]

provides: [Browser, Window, Document]

...
*/

(function(){

var document = this.document;
var window = document.window = this;

var UID = 1;

this.$uid = (window.ActiveXObject) ? function(item){
	return (item.uid || (item.uid = [UID++]))[0];
} : function(item){
	return item.uid || (item.uid = UID++);
};

$uid(window);
$uid(document);

var ua = navigator.userAgent.toLowerCase(),
	platform = navigator.platform.toLowerCase(),
	UA = ua.match(/(opera|ie|firefox|chrome|version)[\s\/:]([\w\d\.]+)?.*?(safari|version[\s\/:]([\w\d\.]+)|$)/) || [null, 'unknown', 0],
	mode = UA[1] == 'ie' && document.documentMode;

var Browser = this.Browser = {

	extend: Function.prototype.extend,

	name: (UA[1] == 'version') ? UA[3] : UA[1],

	version: mode || parseFloat((UA[1] == 'opera' && UA[4]) ? UA[4] : UA[2]),

	Platform: {
		name: ua.match(/ip(?:ad|od|hone)/) ? 'ios' : (ua.match(/(?:webos|android)/) || platform.match(/mac|win|linux/) || ['other'])[0]
	},

	Features: {
		xpath: !!(document.evaluate),
		air: !!(window.runtime),
		query: !!(document.querySelector),
		json: !!(window.JSON)
	},

	Plugins: {}

};

Browser[Browser.name] = true;
Browser[Browser.name + parseInt(Browser.version, 10)] = true;
Browser.Platform[Browser.Platform.name] = true;

// Request

/*

Browser.Request = (function(){

	var XMLHTTP = function(){
		return new XMLHttpRequest();
	};

	var MSXML2 = function(){
		return new ActiveXObject('MSXML2.XMLHTTP');
	};

	var MSXML = function(){
		return new ActiveXObject('Microsoft.XMLHTTP');
	};

	return Function.attempt(function(){
		XMLHTTP();
		return XMLHTTP;
	}, function(){
		MSXML2();
		return MSXML2;
	}, function(){
		MSXML();
		return MSXML;
	});

})();

Browser.Features.xhr = !!(Browser.Request);


// Flash detection

var version = (Function.attempt(function(){
	return navigator.plugins['Shockwave Flash'].description;
}, function(){
	return new ActiveXObject('ShockwaveFlash.ShockwaveFlash').GetVariable('$version');
}) || '0 r0').match(/\d+/g);

Browser.Plugins.Flash = {
	version: Number(version[0] || '0.' + version[1]) || 0,
	build: Number(version[2]) || 0
};

*/

// String scripts

Browser.exec = function(text){
	if (!text) return text;
	if (window.execScript){
		window.execScript(text);
	} else {
		var script = document.createElement('script');
		script.setAttribute('type', 'text/javascript');
		script.text = text;
		document.head.appendChild(script);
		document.head.removeChild(script);
	}
	return text;
};

String.implement('stripScripts', function(exec){
	var scripts = '';
	var text = this.replace(/<script[^>]*>([\s\S]*?)<\/script>/gi, function(all, code){
		scripts += code + '\n';
		return '';
	});
	if (exec === true) Browser.exec(scripts);
	else if (typeOf(exec) == 'function') exec(scripts, text);
	return text;
});

// Window, Document

Browser.extend({
	Document: this.Document,
	Window: this.Window,
	Element: this.Element,
	Event: this.Event
});

this.Window = this.$constructor = new Type('Window', function(){});

this.$family = Function.from('window').hide();

Window.mirror(function(name, method){
	window[name] = method;
});

this.Document = document.$constructor = new Type('Document', function(){});

document.$family = Function.from('document').hide();

Document.mirror(function(name, method){
	document[name] = method;
});

document.html = document.documentElement;
if (!document.head) document.head = document.getElementsByTagName('head')[0];

if (document.execCommand) try {
	document.execCommand("BackgroundImageCache", false, true);
} catch (e){}

/*<ltIE9>*/
if (this.attachEvent && !this.addEventListener){
	var unloadEvent = function(){
		this.detachEvent('onunload', unloadEvent);
		document.head = document.html = document.window = null;
	};
	this.attachEvent('onunload', unloadEvent);
}

// IE fails on collections and <select>.options (refers to <select>)
var arrayFrom = Array.from;
try {
	arrayFrom(document.html.childNodes);
} catch(e){
	Array.from = function(item){
		if (typeof item != 'string' && Type.isEnumerable(item) && typeOf(item) != 'array'){
			var i = item.length, array = new Array(i);
			while (i--) array[i] = item[i];
			return array;
		}
		return arrayFrom(item);
	};

	var prototype = Array.prototype,
		slice = prototype.slice;
	['pop', 'push', 'reverse', 'shift', 'sort', 'splice', 'unshift', 'concat', 'join', 'slice'].each(function(name){
		var method = prototype[name];
		Array[name] = function(item){
			return method.apply(Array.from(item), slice.call(arguments, 1));
		};
	});
}
/*</ltIE9>*/



})();


/*
---

name: Event

description: Contains the Event Class, to make the event object cross-browser.

license: MIT-style license.

requires: [Window, Document, Array, Function, String, Object]

provides: Event

...
*/

var Event = new Type('Event', function(event, win){
	if (!win) win = window;
	var doc = win.document;
	event = event || win.event;
	if (event.$extended) return event;
	this.$extended = true;
	var type = event.type,
		target = event.target || event.srcElement,
		page = {},
		client = {},
		related = null,
		rightClick, wheel, code, key;
	while (target && target.nodeType == 3) target = target.parentNode;

	if (type.indexOf('key') != -1){
		code = event.which || event.keyCode;
		key = Object.keyOf(Event.Keys, code);
		if (type == 'keydown'){
			var fKey = code - 111;
			if (fKey > 0 && fKey < 13) key = 'f' + fKey;
		}
		if (!key) key = String.fromCharCode(code).toLowerCase();
	} else if ((/click|mouse|menu/i).test(type)){
		doc = (!doc.compatMode || doc.compatMode == 'CSS1Compat') ? doc.html : doc.body;
		page = {
			x: (event.pageX != null) ? event.pageX : event.clientX + doc.scrollLeft,
			y: (event.pageY != null) ? event.pageY : event.clientY + doc.scrollTop
		};
		client = {
			x: (event.pageX != null) ? event.pageX - win.pageXOffset : event.clientX,
			y: (event.pageY != null) ? event.pageY - win.pageYOffset : event.clientY
		};
		if ((/DOMMouseScroll|mousewheel/).test(type)){
			wheel = (event.wheelDelta) ? event.wheelDelta / 120 : -(event.detail || 0) / 3;
		}
		rightClick = (event.which == 3) || (event.button == 2);
		if ((/over|out/).test(type)){
			related = event.relatedTarget || event[(type == 'mouseover' ? 'from' : 'to') + 'Element'];
			var testRelated = function(){
				while (related && related.nodeType == 3) related = related.parentNode;
				return true;
			};
			var hasRelated = (Browser.firefox2) ? testRelated.attempt() : testRelated();
			related = (hasRelated) ? related : null;
		}
	} else if ((/gesture|touch/i).test(type)){
		this.rotation = event.rotation;
		this.scale = event.scale;
		this.targetTouches = event.targetTouches;
		this.changedTouches = event.changedTouches;
		var touches = this.touches = event.touches;
		if (touches && touches[0]){
			var touch = touches[0];
			page = {x: touch.pageX, y: touch.pageY};
			client = {x: touch.clientX, y: touch.clientY};
		}
	}

	return Object.append(this, {
		event: event,
		type: type,

		page: page,
		client: client,
		rightClick: rightClick,

		wheel: wheel,

		relatedTarget: document.id(related),
		target: document.id(target),

		code: code,
		key: key,

		shift: event.shiftKey,
		control: event.ctrlKey,
		alt: event.altKey,
		meta: event.metaKey
	});
});

Event.Keys = {
	'enter': 13,
	'up': 38,
	'down': 40,
	'left': 37,
	'right': 39,
	'esc': 27,
	'space': 32,
	'backspace': 8,
	'tab': 9,
	'delete': 46
};



Event.implement({

	stop: function(){
		return this.stopPropagation().preventDefault();
	},

	stopPropagation: function(){
		if (this.event.stopPropagation) this.event.stopPropagation();
		else this.event.cancelBubble = true;
		return this;
	},

	preventDefault: function(){
		if (this.event.preventDefault) this.event.preventDefault();
		else this.event.returnValue = false;
		return this;
	}

});


/*
---

name: Class

description: Contains the Class Function for easily creating, extending, and implementing reusable Classes.

license: MIT-style license.

requires: [Array, String, Function, Number]

provides: Class

...
*/

(function(){

var Class = this.Class = new Type('Class', function(params){
	if (instanceOf(params, Function)) params = {initialize: params};

	var newClass = function(){
		reset(this);
		if (newClass.$prototyping) return this;
		this.$caller = null;
		var value = (this.initialize) ? this.initialize.apply(this, arguments) : this;
		this.$caller = this.caller = null;
		return value;
	}.extend(this).implement(params);

	newClass.$constructor = Class;
	newClass.prototype.$constructor = newClass;
	newClass.prototype.parent = parent;

	return newClass;
});

var parent = function(){
	if (!this.$caller) throw new Error('The method "parent" cannot be called.');
	var name = this.$caller.$name,
		parent = this.$caller.$owner.parent,
		previous = (parent) ? parent.prototype[name] : null;
	if (!previous) throw new Error('The method "' + name + '" has no parent.');
	return previous.apply(this, arguments);
};

var reset = function(object){
	for (var key in object){
		var value = object[key];
		switch (typeOf(value)){
			case 'object':
				var F = function(){};
				F.prototype = value;
				object[key] = reset(new F);
			break;
			case 'array': object[key] = value.clone(); break;
		}
	}
	return object;
};

var wrap = function(self, key, method){
	if (method.$origin) method = method.$origin;
	var wrapper = function(){
		if (method.$protected && this.$caller == null) throw new Error('The method "' + key + '" cannot be called.');
		var caller = this.caller, current = this.$caller;
		this.caller = current; this.$caller = wrapper;
		var result = method.apply(this, arguments);
		this.$caller = current; this.caller = caller;
		return result;
	}.extend({$owner: self, $origin: method, $name: key});
	return wrapper;
};

var implement = function(key, value, retain){
	if (Class.Mutators.hasOwnProperty(key)){
		value = Class.Mutators[key].call(this, value);
		if (value == null) return this;
	}

	if (typeOf(value) == 'function'){
		if (value.$hidden) return this;
		this.prototype[key] = (retain) ? value : wrap(this, key, value);
	} else {
		Object.merge(this.prototype, key, value);
	}

	return this;
};

var getInstance = function(klass){
	klass.$prototyping = true;
	var proto = new klass;
	delete klass.$prototyping;
	return proto;
};

Class.implement('implement', implement.overloadSetter());

Class.Mutators = {

	Extends: function(parent){
		this.parent = parent;
		this.prototype = getInstance(parent);
	},

	Implements: function(items){
		Array.from(items).each(function(item){
			var instance = new item;
			for (var key in instance) implement.call(this, key, instance[key], true);
		}, this);
	}
};

})();


/*
---

name: Class.Extras

description: Contains Utility Classes that can be implemented into your own Classes to ease the execution of many common tasks.

license: MIT-style license.

requires: Class

provides: [Class.Extras, Chain, Events, Options]

...
*/

(function(){

this.Chain = new Class({

	$chain: [],

	chain: function(){
		this.$chain.append(Array.flatten(arguments));
		return this;
	},

	callChain: function(){
		return (this.$chain.length) ? this.$chain.shift().apply(this, arguments) : false;
	},

	clearChain: function(){
		this.$chain.empty();
		return this;
	}

});

var removeOn = function(string){
	return string.replace(/^on([A-Z])/, function(full, first){
		return first.toLowerCase();
	});
};

this.Events = new Class({

	$events: {},

	addEvent: function(type, fn, internal){
		type = removeOn(type);

		

		this.$events[type] = (this.$events[type] || []).include(fn);
		if (internal) fn.internal = true;
		return this;
	},

	addEvents: function(events){
		for (var type in events) this.addEvent(type, events[type]);
		return this;
	},

	fireEvent: function(type, args, delay){
		type = removeOn(type);
		var events = this.$events[type];
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
		var events = this.$events[type];
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
		for (type in this.$events){
			if (events && events != type) continue;
			var fns = this.$events[type];
			for (var i = fns.length; i--;) if (i in fns){
				this.removeEvent(type, fns[i]);
			}
		}
		return this;
	}

});

this.Options = new Class({

	setOptions: function(){
		var options = this.options = Object.merge.apply(null, [{}, this.options].append(arguments));
		if (this.addEvent) for (var option in options){
			if (typeOf(options[option]) != 'function' || !(/^on[A-Z]/).test(option)) continue;
			this.addEvent(option, options[option]);
			delete options[option];
		}
		return this;
	}

});

})();


/*
---
name: Slick.Parser
description: Standalone CSS3 Selector parser
provides: Slick.Parser
...
*/

;(function(){

var parsed,
	separatorIndex,
	combinatorIndex,
	reversed,
	cache = {},
	reverseCache = {},
	reUnescape = /\\/g;

var parse = function(expression, isReversed){
	if (expression == null) return null;
	if (expression.Slick === true) return expression;
	expression = ('' + expression).replace(/^\s+|\s+$/g, '');
	reversed = !!isReversed;
	var currentCache = (reversed) ? reverseCache : cache;
	if (currentCache[expression]) return currentCache[expression];
	parsed = {
		Slick: true,
		expressions: [],
		raw: expression,
		reverse: function(){
			return parse(this.raw, true);
		}
	};
	separatorIndex = -1;
	while (expression != (expression = expression.replace(regexp, parser)));
	parsed.length = parsed.expressions.length;
	return currentCache[parsed.raw] = (reversed) ? reverse(parsed) : parsed;
};

var reverseCombinator = function(combinator){
	if (combinator === '!') return ' ';
	else if (combinator === ' ') return '!';
	else if ((/^!/).test(combinator)) return combinator.replace(/^!/, '');
	else return '!' + combinator;
};

var reverse = function(expression){
	var expressions = expression.expressions;
	for (var i = 0; i < expressions.length; i++){
		var exp = expressions[i];
		var last = {parts: [], tag: '*', combinator: reverseCombinator(exp[0].combinator)};

		for (var j = 0; j < exp.length; j++){
			var cexp = exp[j];
			if (!cexp.reverseCombinator) cexp.reverseCombinator = ' ';
			cexp.combinator = cexp.reverseCombinator;
			delete cexp.reverseCombinator;
		}

		exp.reverse().push(last);
	}
	return expression;
};

var escapeRegExp = function(string){// Credit: XRegExp 0.6.1 (c) 2007-2008 Steven Levithan <http://stevenlevithan.com/regex/xregexp/> MIT License
	return string.replace(/[-[\]{}()*+?.\\^$|,#\s]/g, function(match){
		return '\\' + match;
	});
};

var regexp = new RegExp(
/*
#!/usr/bin/env ruby
puts "\t\t" + DATA.read.gsub(/\(\?x\)|\s+#.*$|\s+|\\$|\\n/,'')
__END__
	"(?x)^(?:\
	  \\s* ( , ) \\s*               # Separator          \n\
	| \\s* ( <combinator>+ ) \\s*   # Combinator         \n\
	|      ( \\s+ )                 # CombinatorChildren \n\
	|      ( <unicode>+ | \\* )     # Tag                \n\
	| \\#  ( <unicode>+       )     # ID                 \n\
	| \\.  ( <unicode>+       )     # ClassName          \n\
	|                               # Attribute          \n\
	\\[  \
		\\s* (<unicode1>+)  (?:  \
			\\s* ([*^$!~|]?=)  (?:  \
				\\s* (?:\
					([\"']?)(.*?)\\9 \
				)\
			)  \
		)?  \\s*  \
	\\](?!\\]) \n\
	|   :+ ( <unicode>+ )(?:\
	\\( (?:\
		(?:([\"'])([^\\12]*)\\12)|((?:\\([^)]+\\)|[^()]*)+)\
	) \\)\
	)?\
	)"
*/
	"^(?:\\s*(,)\\s*|\\s*(<combinator>+)\\s*|(\\s+)|(<unicode>+|\\*)|\\#(<unicode>+)|\\.(<unicode>+)|\\[\\s*(<unicode1>+)(?:\\s*([*^$!~|]?=)(?:\\s*(?:([\"']?)(.*?)\\9)))?\\s*\\](?!\\])|(:+)(<unicode>+)(?:\\((?:(?:([\"'])([^\\13]*)\\13)|((?:\\([^)]+\\)|[^()]*)+))\\))?)"
	.replace(/<combinator>/, '[' + escapeRegExp(">+~`!@$%^&={}\\;</") + ']')
	.replace(/<unicode>/g, '(?:[\\w\\u00a1-\\uFFFF-]|\\\\[^\\s0-9a-f])')
	.replace(/<unicode1>/g, '(?:[:\\w\\u00a1-\\uFFFF-]|\\\\[^\\s0-9a-f])')
);

function parser(
	rawMatch,

	separator,
	combinator,
	combinatorChildren,

	tagName,
	id,
	className,

	attributeKey,
	attributeOperator,
	attributeQuote,
	attributeValue,

	pseudoMarker,
	pseudoClass,
	pseudoQuote,
	pseudoClassQuotedValue,
	pseudoClassValue
){
	if (separator || separatorIndex === -1){
		parsed.expressions[++separatorIndex] = [];
		combinatorIndex = -1;
		if (separator) return '';
	}

	if (combinator || combinatorChildren || combinatorIndex === -1){
		combinator = combinator || ' ';
		var currentSeparator = parsed.expressions[separatorIndex];
		if (reversed && currentSeparator[combinatorIndex])
			currentSeparator[combinatorIndex].reverseCombinator = reverseCombinator(combinator);
		currentSeparator[++combinatorIndex] = {combinator: combinator, tag: '*'};
	}

	var currentParsed = parsed.expressions[separatorIndex][combinatorIndex];

	if (tagName){
		currentParsed.tag = tagName.replace(reUnescape, '');

	} else if (id){
		currentParsed.id = id.replace(reUnescape, '');

	} else if (className){
		className = className.replace(reUnescape, '');

		if (!currentParsed.classList) currentParsed.classList = [];
		if (!currentParsed.classes) currentParsed.classes = [];
		currentParsed.classList.push(className);
		currentParsed.classes.push({
			value: className,
			regexp: new RegExp('(^|\\s)' + escapeRegExp(className) + '(\\s|$)')
		});

	} else if (pseudoClass){
		pseudoClassValue = pseudoClassValue || pseudoClassQuotedValue;
		pseudoClassValue = pseudoClassValue ? pseudoClassValue.replace(reUnescape, '') : null;

		if (!currentParsed.pseudos) currentParsed.pseudos = [];
		currentParsed.pseudos.push({
			key: pseudoClass.replace(reUnescape, ''),
			value: pseudoClassValue,
			type: pseudoMarker.length == 1 ? 'class' : 'element'
		});

	} else if (attributeKey){
		attributeKey = attributeKey.replace(reUnescape, '');
		attributeValue = (attributeValue || '').replace(reUnescape, '');

		var test, regexp;

		switch (attributeOperator){
			case '^=' : regexp = new RegExp(       '^'+ escapeRegExp(attributeValue)            ); break;
			case '$=' : regexp = new RegExp(            escapeRegExp(attributeValue) +'$'       ); break;
			case '~=' : regexp = new RegExp( '(^|\\s)'+ escapeRegExp(attributeValue) +'(\\s|$)' ); break;
			case '|=' : regexp = new RegExp(       '^'+ escapeRegExp(attributeValue) +'(-|$)'   ); break;
			case  '=' : test = function(value){
				return attributeValue == value;
			}; break;
			case '*=' : test = function(value){
				return value && value.indexOf(attributeValue) > -1;
			}; break;
			case '!=' : test = function(value){
				return attributeValue != value;
			}; break;
			default   : test = function(value){
				return !!value;
			};
		}

		if (attributeValue == '' && (/^[*$^]=$/).test(attributeOperator)) test = function(){
			return false;
		};

		if (!test) test = function(value){
			return value && regexp.test(value);
		};

		if (!currentParsed.attributes) currentParsed.attributes = [];
		currentParsed.attributes.push({
			key: attributeKey,
			operator: attributeOperator,
			value: attributeValue,
			test: test
		});

	}

	return '';
};

// Slick NS

var Slick = (this.Slick || {});

Slick.parse = function(expression){
	return parse(expression);
};

Slick.escapeRegExp = escapeRegExp;

if (!this.Slick) this.Slick = Slick;

}).apply(/*<CommonJS>*/(typeof exports != 'undefined') ? exports : /*</CommonJS>*/this);


/*
---
name: Slick.Finder
description: The new, superfast css selector engine.
provides: Slick.Finder
requires: Slick.Parser
...
*/

;(function(){

var local = {},
	featuresCache = {},
	toString = Object.prototype.toString;

// Feature / Bug detection

local.isNativeCode = function(fn){
	return (/\{\s*\[native code\]\s*\}/).test('' + fn);
};

local.isXML = function(document){
	return (!!document.xmlVersion) || (!!document.xml) || (toString.call(document) == '[object XMLDocument]') ||
	(document.nodeType == 9 && document.documentElement.nodeName != 'HTML');
};

local.setDocument = function(document){

	// convert elements / window arguments to document. if document cannot be extrapolated, the function returns.
	var nodeType = document.nodeType;
	if (nodeType == 9); // document
	else if (nodeType) document = document.ownerDocument; // node
	else if (document.navigator) document = document.document; // window
	else return;

	// check if it's the old document

	if (this.document === document) return;
	this.document = document;

	// check if we have done feature detection on this document before

	var root = document.documentElement,
		rootUid = this.getUIDXML(root),
		features = featuresCache[rootUid],
		feature;

	if (features){
		for (feature in features){
			this[feature] = features[feature];
		}
		return;
	}

	features = featuresCache[rootUid] = {};

	features.root = root;
	features.isXMLDocument = this.isXML(document);

	features.brokenStarGEBTN
	= features.starSelectsClosedQSA
	= features.idGetsName
	= features.brokenMixedCaseQSA
	= features.brokenGEBCN
	= features.brokenCheckedQSA
	= features.brokenEmptyAttributeQSA
	= features.isHTMLDocument
	= features.nativeMatchesSelector
	= false;

	var starSelectsClosed, starSelectsComments,
		brokenSecondClassNameGEBCN, cachedGetElementsByClassName,
		brokenFormAttributeGetter;

	var selected, id = 'slick_uniqueid';
	var testNode = document.createElement('div');
	
	var testRoot = document.body || document.getElementsByTagName('body')[0] || root;
	testRoot.appendChild(testNode);

	// on non-HTML documents innerHTML and getElementsById doesnt work properly
	try {
		testNode.innerHTML = '<a id="'+id+'"></a>';
		features.isHTMLDocument = !!document.getElementById(id);
	} catch(e){};

	if (features.isHTMLDocument){

		testNode.style.display = 'none';

		// IE returns comment nodes for getElementsByTagName('*') for some documents
		testNode.appendChild(document.createComment(''));
		starSelectsComments = (testNode.getElementsByTagName('*').length > 1);

		// IE returns closed nodes (EG:"</foo>") for getElementsByTagName('*') for some documents
		try {
			testNode.innerHTML = 'foo</foo>';
			selected = testNode.getElementsByTagName('*');
			starSelectsClosed = (selected && !!selected.length && selected[0].nodeName.charAt(0) == '/');
		} catch(e){};

		features.brokenStarGEBTN = starSelectsComments || starSelectsClosed;

		// IE returns elements with the name instead of just id for getElementsById for some documents
		try {
			testNode.innerHTML = '<a name="'+ id +'"></a><b id="'+ id +'"></b>';
			features.idGetsName = document.getElementById(id) === testNode.firstChild;
		} catch(e){};

		if (testNode.getElementsByClassName){

			// Safari 3.2 getElementsByClassName caches results
			try {
				testNode.innerHTML = '<a class="f"></a><a class="b"></a>';
				testNode.getElementsByClassName('b').length;
				testNode.firstChild.className = 'b';
				cachedGetElementsByClassName = (testNode.getElementsByClassName('b').length != 2);
			} catch(e){};

			// Opera 9.6 getElementsByClassName doesnt detects the class if its not the first one
			try {
				testNode.innerHTML = '<a class="a"></a><a class="f b a"></a>';
				brokenSecondClassNameGEBCN = (testNode.getElementsByClassName('a').length != 2);
			} catch(e){};

			features.brokenGEBCN = cachedGetElementsByClassName || brokenSecondClassNameGEBCN;
		}
		
		if (testNode.querySelectorAll){
			// IE 8 returns closed nodes (EG:"</foo>") for querySelectorAll('*') for some documents
			try {
				testNode.innerHTML = 'foo</foo>';
				selected = testNode.querySelectorAll('*');
				features.starSelectsClosedQSA = (selected && !!selected.length && selected[0].nodeName.charAt(0) == '/');
			} catch(e){};

			// Safari 3.2 querySelectorAll doesnt work with mixedcase on quirksmode
			try {
				testNode.innerHTML = '<a class="MiX"></a>';
				features.brokenMixedCaseQSA = !testNode.querySelectorAll('.MiX').length;
			} catch(e){};

			// Webkit and Opera dont return selected options on querySelectorAll
			try {
				testNode.innerHTML = '<select><option selected="selected">a</option></select>';
				features.brokenCheckedQSA = (testNode.querySelectorAll(':checked').length == 0);
			} catch(e){};

			// IE returns incorrect results for attr[*^$]="" selectors on querySelectorAll
			try {
				testNode.innerHTML = '<a class=""></a>';
				features.brokenEmptyAttributeQSA = (testNode.querySelectorAll('[class*=""]').length != 0);
			} catch(e){};

		}

		// IE6-7, if a form has an input of id x, form.getAttribute(x) returns a reference to the input
		try {
			testNode.innerHTML = '<form action="s"><input id="action"/></form>';
			brokenFormAttributeGetter = (testNode.firstChild.getAttribute('action') != 's');
		} catch(e){};

		// native matchesSelector function

		features.nativeMatchesSelector = root.matchesSelector || /*root.msMatchesSelector ||*/ root.mozMatchesSelector || root.webkitMatchesSelector;
		if (features.nativeMatchesSelector) try {
			// if matchesSelector trows errors on incorrect sintaxes we can use it
			features.nativeMatchesSelector.call(root, ':slick');
			features.nativeMatchesSelector = null;
		} catch(e){};

	}

	try {
		root.slick_expando = 1;
		delete root.slick_expando;
		features.getUID = this.getUIDHTML;
	} catch(e) {
		features.getUID = this.getUIDXML;
	}

	testRoot.removeChild(testNode);
	testNode = selected = testRoot = null;

	// getAttribute

	features.getAttribute = (features.isHTMLDocument && brokenFormAttributeGetter) ? function(node, name){
		var method = this.attributeGetters[name];
		if (method) return method.call(node);
		var attributeNode = node.getAttributeNode(name);
		return (attributeNode) ? attributeNode.nodeValue : null;
	} : function(node, name){
		var method = this.attributeGetters[name];
		return (method) ? method.call(node) : node.getAttribute(name);
	};

	// hasAttribute

	features.hasAttribute = (root && this.isNativeCode(root.hasAttribute)) ? function(node, attribute) {
		return node.hasAttribute(attribute);
	} : function(node, attribute) {
		node = node.getAttributeNode(attribute);
		return !!(node && (node.specified || node.nodeValue));
	};

	// contains
	// FIXME: Add specs: local.contains should be different for xml and html documents?
	features.contains = (root && this.isNativeCode(root.contains)) ? function(context, node){
		return context.contains(node);
	} : (root && root.compareDocumentPosition) ? function(context, node){
		return context === node || !!(context.compareDocumentPosition(node) & 16);
	} : function(context, node){
		if (node) do {
			if (node === context) return true;
		} while ((node = node.parentNode));
		return false;
	};

	// document order sorting
	// credits to Sizzle (http://sizzlejs.com/)

	features.documentSorter = (root.compareDocumentPosition) ? function(a, b){
		if (!a.compareDocumentPosition || !b.compareDocumentPosition) return 0;
		return a.compareDocumentPosition(b) & 4 ? -1 : a === b ? 0 : 1;
	} : ('sourceIndex' in root) ? function(a, b){
		if (!a.sourceIndex || !b.sourceIndex) return 0;
		return a.sourceIndex - b.sourceIndex;
	} : (document.createRange) ? function(a, b){
		if (!a.ownerDocument || !b.ownerDocument) return 0;
		var aRange = a.ownerDocument.createRange(), bRange = b.ownerDocument.createRange();
		aRange.setStart(a, 0);
		aRange.setEnd(a, 0);
		bRange.setStart(b, 0);
		bRange.setEnd(b, 0);
		return aRange.compareBoundaryPoints(Range.START_TO_END, bRange);
	} : null ;

	root = null;

	for (feature in features){
		this[feature] = features[feature];
	}
};

// Main Method

var reSimpleSelector = /^([#.]?)((?:[\w-]+|\*))$/,
	reEmptyAttribute = /\[.+[*$^]=(?:""|'')?\]/,
	qsaFailExpCache = {};

local.search = function(context, expression, append, first){

	var found = this.found = (first) ? null : (append || []);
	
	if (!context) return found;
	else if (context.navigator) context = context.document; // Convert the node from a window to a document
	else if (!context.nodeType) return found;

	// setup

	var parsed, i,
		uniques = this.uniques = {},
		hasOthers = !!(append && append.length),
		contextIsDocument = (context.nodeType == 9);

	if (this.document !== (contextIsDocument ? context : context.ownerDocument)) this.setDocument(context);

	// avoid duplicating items already in the append array
	if (hasOthers) for (i = found.length; i--;) uniques[this.getUID(found[i])] = true;

	// expression checks

	if (typeof expression == 'string'){ // expression is a string

		/*<simple-selectors-override>*/
		var simpleSelector = expression.match(reSimpleSelector);
		simpleSelectors: if (simpleSelector) {

			var symbol = simpleSelector[1],
				name = simpleSelector[2],
				node, nodes;

			if (!symbol){

				if (name == '*' && this.brokenStarGEBTN) break simpleSelectors;
				nodes = context.getElementsByTagName(name);
				if (first) return nodes[0] || null;
				for (i = 0; node = nodes[i++];){
					if (!(hasOthers && uniques[this.getUID(node)])) found.push(node);
				}

			} else if (symbol == '#'){

				if (!this.isHTMLDocument || !contextIsDocument) break simpleSelectors;
				node = context.getElementById(name);
				if (!node) return found;
				if (this.idGetsName && node.getAttributeNode('id').nodeValue != name) break simpleSelectors;
				if (first) return node || null;
				if (!(hasOthers && uniques[this.getUID(node)])) found.push(node);

			} else if (symbol == '.'){

				if (!this.isHTMLDocument || ((!context.getElementsByClassName || this.brokenGEBCN) && context.querySelectorAll)) break simpleSelectors;
				if (context.getElementsByClassName && !this.brokenGEBCN){
					nodes = context.getElementsByClassName(name);
					if (first) return nodes[0] || null;
					for (i = 0; node = nodes[i++];){
						if (!(hasOthers && uniques[this.getUID(node)])) found.push(node);
					}
				} else {
					var matchClass = new RegExp('(^|\\s)'+ Slick.escapeRegExp(name) +'(\\s|$)');
					nodes = context.getElementsByTagName('*');
					for (i = 0; node = nodes[i++];){
						className = node.className;
						if (!(className && matchClass.test(className))) continue;
						if (first) return node;
						if (!(hasOthers && uniques[this.getUID(node)])) found.push(node);
					}
				}

			}

			if (hasOthers) this.sort(found);
			return (first) ? null : found;

		}
		/*</simple-selectors-override>*/

		/*<query-selector-override>*/
		querySelector: if (context.querySelectorAll) {

			if (!this.isHTMLDocument
				|| qsaFailExpCache[expression]
				//TODO: only skip when expression is actually mixed case
				|| this.brokenMixedCaseQSA
				|| (this.brokenCheckedQSA && expression.indexOf(':checked') > -1)
				|| (this.brokenEmptyAttributeQSA && reEmptyAttribute.test(expression))
				|| (!contextIsDocument //Abort when !contextIsDocument and...
					//  there are multiple expressions in the selector
					//  since we currently only fix non-document rooted QSA for single expression selectors
					&& expression.indexOf(',') > -1
				)
				|| Slick.disableQSA
			) break querySelector;

			var _expression = expression, _context = context;
			if (!contextIsDocument){
				// non-document rooted QSA
				// credits to Andrew Dupont
				var currentId = _context.getAttribute('id'), slickid = 'slickid__';
				_context.setAttribute('id', slickid);
				_expression = '#' + slickid + ' ' + _expression;
				context = _context.parentNode;
			}

			try {
				if (first) return context.querySelector(_expression) || null;
				else nodes = context.querySelectorAll(_expression);
			} catch(e) {
				qsaFailExpCache[expression] = 1;
				break querySelector;
			} finally {
				if (!contextIsDocument){
					if (currentId) _context.setAttribute('id', currentId);
					else _context.removeAttribute('id');
					context = _context;
				}
			}

			if (this.starSelectsClosedQSA) for (i = 0; node = nodes[i++];){
				if (node.nodeName > '@' && !(hasOthers && uniques[this.getUID(node)])) found.push(node);
			} else for (i = 0; node = nodes[i++];){
				if (!(hasOthers && uniques[this.getUID(node)])) found.push(node);
			}

			if (hasOthers) this.sort(found);
			return found;

		}
		/*</query-selector-override>*/

		parsed = this.Slick.parse(expression);
		if (!parsed.length) return found;
	} else if (expression == null){ // there is no expression
		return found;
	} else if (expression.Slick){ // expression is a parsed Slick object
		parsed = expression;
	} else if (this.contains(context.documentElement || context, expression)){ // expression is a node
		(found) ? found.push(expression) : found = expression;
		return found;
	} else { // other junk
		return found;
	}

	/*<pseudo-selectors>*//*<nth-pseudo-selectors>*/

	// cache elements for the nth selectors

	this.posNTH = {};
	this.posNTHLast = {};
	this.posNTHType = {};
	this.posNTHTypeLast = {};

	/*</nth-pseudo-selectors>*//*</pseudo-selectors>*/

	// if append is null and there is only a single selector with one expression use pushArray, else use pushUID
	this.push = (!hasOthers && (first || (parsed.length == 1 && parsed.expressions[0].length == 1))) ? this.pushArray : this.pushUID;

	if (found == null) found = [];

	// default engine

	var j, m, n;
	var combinator, tag, id, classList, classes, attributes, pseudos;
	var currentItems, currentExpression, currentBit, lastBit, expressions = parsed.expressions;

	search: for (i = 0; (currentExpression = expressions[i]); i++) for (j = 0; (currentBit = currentExpression[j]); j++){

		combinator = 'combinator:' + currentBit.combinator;
		if (!this[combinator]) continue search;

		tag        = (this.isXMLDocument) ? currentBit.tag : currentBit.tag.toUpperCase();
		id         = currentBit.id;
		classList  = currentBit.classList;
		classes    = currentBit.classes;
		attributes = currentBit.attributes;
		pseudos    = currentBit.pseudos;
		lastBit    = (j === (currentExpression.length - 1));

		this.bitUniques = {};

		if (lastBit){
			this.uniques = uniques;
			this.found = found;
		} else {
			this.uniques = {};
			this.found = [];
		}

		if (j === 0){
			this[combinator](context, tag, id, classes, attributes, pseudos, classList);
			if (first && lastBit && found.length) break search;
		} else {
			if (first && lastBit) for (m = 0, n = currentItems.length; m < n; m++){
				this[combinator](currentItems[m], tag, id, classes, attributes, pseudos, classList);
				if (found.length) break search;
			} else for (m = 0, n = currentItems.length; m < n; m++) this[combinator](currentItems[m], tag, id, classes, attributes, pseudos, classList);
		}

		currentItems = this.found;
	}

	// should sort if there are nodes in append and if you pass multiple expressions.
	if (hasOthers || (parsed.expressions.length > 1)) this.sort(found);

	return (first) ? (found[0] || null) : found;
};

// Utils

local.uidx = 1;
local.uidk = 'slick-uniqueid';

local.getUIDXML = function(node){
	var uid = node.getAttribute(this.uidk);
	if (!uid){
		uid = this.uidx++;
		node.setAttribute(this.uidk, uid);
	}
	return uid;
};

local.getUIDHTML = function(node){
	return node.uniqueNumber || (node.uniqueNumber = this.uidx++);
};

// sort based on the setDocument documentSorter method.

local.sort = function(results){
	if (!this.documentSorter) return results;
	results.sort(this.documentSorter);
	return results;
};

/*<pseudo-selectors>*//*<nth-pseudo-selectors>*/

local.cacheNTH = {};

local.matchNTH = /^([+-]?\d*)?([a-z]+)?([+-]\d+)?$/;

local.parseNTHArgument = function(argument){
	var parsed = argument.match(this.matchNTH);
	if (!parsed) return false;
	var special = parsed[2] || false;
	var a = parsed[1] || 1;
	if (a == '-') a = -1;
	var b = +parsed[3] || 0;
	parsed =
		(special == 'n')	? {a: a, b: b} :
		(special == 'odd')	? {a: 2, b: 1} :
		(special == 'even')	? {a: 2, b: 0} : {a: 0, b: a};

	return (this.cacheNTH[argument] = parsed);
};

local.createNTHPseudo = function(child, sibling, positions, ofType){
	return function(node, argument){
		var uid = this.getUID(node);
		if (!this[positions][uid]){
			var parent = node.parentNode;
			if (!parent) return false;
			var el = parent[child], count = 1;
			if (ofType){
				var nodeName = node.nodeName;
				do {
					if (el.nodeName != nodeName) continue;
					this[positions][this.getUID(el)] = count++;
				} while ((el = el[sibling]));
			} else {
				do {
					if (el.nodeType != 1) continue;
					this[positions][this.getUID(el)] = count++;
				} while ((el = el[sibling]));
			}
		}
		argument = argument || 'n';
		var parsed = this.cacheNTH[argument] || this.parseNTHArgument(argument);
		if (!parsed) return false;
		var a = parsed.a, b = parsed.b, pos = this[positions][uid];
		if (a == 0) return b == pos;
		if (a > 0){
			if (pos < b) return false;
		} else {
			if (b < pos) return false;
		}
		return ((pos - b) % a) == 0;
	};
};

/*</nth-pseudo-selectors>*//*</pseudo-selectors>*/

local.pushArray = function(node, tag, id, classes, attributes, pseudos){
	if (this.matchSelector(node, tag, id, classes, attributes, pseudos)) this.found.push(node);
};

local.pushUID = function(node, tag, id, classes, attributes, pseudos){
	var uid = this.getUID(node);
	if (!this.uniques[uid] && this.matchSelector(node, tag, id, classes, attributes, pseudos)){
		this.uniques[uid] = true;
		this.found.push(node);
	}
};

local.matchNode = function(node, selector){
	if (this.isHTMLDocument && this.nativeMatchesSelector){
		try {
			return this.nativeMatchesSelector.call(node, selector.replace(/\[([^=]+)=\s*([^'"\]]+?)\s*\]/g, '[$1="$2"]'));
		} catch(matchError) {}
	}
	
	var parsed = this.Slick.parse(selector);
	if (!parsed) return true;

	// simple (single) selectors
	var expressions = parsed.expressions, reversedExpressions, simpleExpCounter = 0, i;
	for (i = 0; (currentExpression = expressions[i]); i++){
		if (currentExpression.length == 1){
			var exp = currentExpression[0];
			if (this.matchSelector(node, (this.isXMLDocument) ? exp.tag : exp.tag.toUpperCase(), exp.id, exp.classes, exp.attributes, exp.pseudos)) return true;
			simpleExpCounter++;
		}
	}

	if (simpleExpCounter == parsed.length) return false;

	var nodes = this.search(this.document, parsed), item;
	for (i = 0; item = nodes[i++];){
		if (item === node) return true;
	}
	return false;
};

local.matchPseudo = function(node, name, argument){
	var pseudoName = 'pseudo:' + name;
	if (this[pseudoName]) return this[pseudoName](node, argument);
	var attribute = this.getAttribute(node, name);
	return (argument) ? argument == attribute : !!attribute;
};

local.matchSelector = function(node, tag, id, classes, attributes, pseudos){
	if (tag){
		var nodeName = (this.isXMLDocument) ? node.nodeName : node.nodeName.toUpperCase();
		if (tag == '*'){
			if (nodeName < '@') return false; // Fix for comment nodes and closed nodes
		} else {
			if (nodeName != tag) return false;
		}
	}

	if (id && node.getAttribute('id') != id) return false;

	var i, part, cls;
	if (classes) for (i = classes.length; i--;){
		cls = node.getAttribute('class') || node.className;
		if (!(cls && classes[i].regexp.test(cls))) return false;
	}
	if (attributes) for (i = attributes.length; i--;){
		part = attributes[i];
		if (part.operator ? !part.test(this.getAttribute(node, part.key)) : !this.hasAttribute(node, part.key)) return false;
	}
	if (pseudos) for (i = pseudos.length; i--;){
		part = pseudos[i];
		if (!this.matchPseudo(node, part.key, part.value)) return false;
	}
	return true;
};

var combinators = {

	' ': function(node, tag, id, classes, attributes, pseudos, classList){ // all child nodes, any level

		var i, item, children;

		if (this.isHTMLDocument){
			getById: if (id){
				item = this.document.getElementById(id);
				if ((!item && node.all) || (this.idGetsName && item && item.getAttributeNode('id').nodeValue != id)){
					// all[id] returns all the elements with that name or id inside node
					// if theres just one it will return the element, else it will be a collection
					children = node.all[id];
					if (!children) return;
					if (!children[0]) children = [children];
					for (i = 0; item = children[i++];){
						var idNode = item.getAttributeNode('id');
						if (idNode && idNode.nodeValue == id){
							this.push(item, tag, null, classes, attributes, pseudos);
							break;
						}
					} 
					return;
				}
				if (!item){
					// if the context is in the dom we return, else we will try GEBTN, breaking the getById label
					if (this.contains(this.root, node)) return;
					else break getById;
				} else if (this.document !== node && !this.contains(node, item)) return;
				this.push(item, tag, null, classes, attributes, pseudos);
				return;
			}
			getByClass: if (classes && node.getElementsByClassName && !this.brokenGEBCN){
				children = node.getElementsByClassName(classList.join(' '));
				if (!(children && children.length)) break getByClass;
				for (i = 0; item = children[i++];) this.push(item, tag, id, null, attributes, pseudos);
				return;
			}
		}
		getByTag: {
			children = node.getElementsByTagName(tag);
			if (!(children && children.length)) break getByTag;
			if (!this.brokenStarGEBTN) tag = null;
			for (i = 0; item = children[i++];) this.push(item, tag, id, classes, attributes, pseudos);
		}
	},

	'>': function(node, tag, id, classes, attributes, pseudos){ // direct children
		if ((node = node.firstChild)) do {
			if (node.nodeType == 1) this.push(node, tag, id, classes, attributes, pseudos);
		} while ((node = node.nextSibling));
	},

	'+': function(node, tag, id, classes, attributes, pseudos){ // next sibling
		while ((node = node.nextSibling)) if (node.nodeType == 1){
			this.push(node, tag, id, classes, attributes, pseudos);
			break;
		}
	},

	'^': function(node, tag, id, classes, attributes, pseudos){ // first child
		node = node.firstChild;
		if (node){
			if (node.nodeType == 1) this.push(node, tag, id, classes, attributes, pseudos);
			else this['combinator:+'](node, tag, id, classes, attributes, pseudos);
		}
	},

	'~': function(node, tag, id, classes, attributes, pseudos){ // next siblings
		while ((node = node.nextSibling)){
			if (node.nodeType != 1) continue;
			var uid = this.getUID(node);
			if (this.bitUniques[uid]) break;
			this.bitUniques[uid] = true;
			this.push(node, tag, id, classes, attributes, pseudos);
		}
	},

	'++': function(node, tag, id, classes, attributes, pseudos){ // next sibling and previous sibling
		this['combinator:+'](node, tag, id, classes, attributes, pseudos);
		this['combinator:!+'](node, tag, id, classes, attributes, pseudos);
	},

	'~~': function(node, tag, id, classes, attributes, pseudos){ // next siblings and previous siblings
		this['combinator:~'](node, tag, id, classes, attributes, pseudos);
		this['combinator:!~'](node, tag, id, classes, attributes, pseudos);
	},

	'!': function(node, tag, id, classes, attributes, pseudos){ // all parent nodes up to document
		while ((node = node.parentNode)) if (node !== this.document) this.push(node, tag, id, classes, attributes, pseudos);
	},

	'!>': function(node, tag, id, classes, attributes, pseudos){ // direct parent (one level)
		node = node.parentNode;
		if (node !== this.document) this.push(node, tag, id, classes, attributes, pseudos);
	},

	'!+': function(node, tag, id, classes, attributes, pseudos){ // previous sibling
		while ((node = node.previousSibling)) if (node.nodeType == 1){
			this.push(node, tag, id, classes, attributes, pseudos);
			break;
		}
	},

	'!^': function(node, tag, id, classes, attributes, pseudos){ // last child
		node = node.lastChild;
		if (node){
			if (node.nodeType == 1) this.push(node, tag, id, classes, attributes, pseudos);
			else this['combinator:!+'](node, tag, id, classes, attributes, pseudos);
		}
	},

	'!~': function(node, tag, id, classes, attributes, pseudos){ // previous siblings
		while ((node = node.previousSibling)){
			if (node.nodeType != 1) continue;
			var uid = this.getUID(node);
			if (this.bitUniques[uid]) break;
			this.bitUniques[uid] = true;
			this.push(node, tag, id, classes, attributes, pseudos);
		}
	}

};

for (var c in combinators) local['combinator:' + c] = combinators[c];

var pseudos = {

	/*<pseudo-selectors>*/

	'empty': function(node){
		var child = node.firstChild;
		return !(child && child.nodeType == 1) && !(node.innerText || node.textContent || '').length;
	},

	'not': function(node, expression){
		return !this.matchNode(node, expression);
	},

	'contains': function(node, text){
		return (node.innerText || node.textContent || '').indexOf(text) > -1;
	},

	'first-child': function(node){
		while ((node = node.previousSibling)) if (node.nodeType == 1) return false;
		return true;
	},

	'last-child': function(node){
		while ((node = node.nextSibling)) if (node.nodeType == 1) return false;
		return true;
	},

	'only-child': function(node){
		var prev = node;
		while ((prev = prev.previousSibling)) if (prev.nodeType == 1) return false;
		var next = node;
		while ((next = next.nextSibling)) if (next.nodeType == 1) return false;
		return true;
	},

	/*<nth-pseudo-selectors>*/

	'nth-child': local.createNTHPseudo('firstChild', 'nextSibling', 'posNTH'),

	'nth-last-child': local.createNTHPseudo('lastChild', 'previousSibling', 'posNTHLast'),

	'nth-of-type': local.createNTHPseudo('firstChild', 'nextSibling', 'posNTHType', true),

	'nth-last-of-type': local.createNTHPseudo('lastChild', 'previousSibling', 'posNTHTypeLast', true),

	'index': function(node, index){
		return this['pseudo:nth-child'](node, '' + index + 1);
	},

	'even': function(node){
		return this['pseudo:nth-child'](node, '2n');
	},

	'odd': function(node){
		return this['pseudo:nth-child'](node, '2n+1');
	},

	/*</nth-pseudo-selectors>*/

	/*<of-type-pseudo-selectors>*/

	'first-of-type': function(node){
		var nodeName = node.nodeName;
		while ((node = node.previousSibling)) if (node.nodeName == nodeName) return false;
		return true;
	},

	'last-of-type': function(node){
		var nodeName = node.nodeName;
		while ((node = node.nextSibling)) if (node.nodeName == nodeName) return false;
		return true;
	},

	'only-of-type': function(node){
		var prev = node, nodeName = node.nodeName;
		while ((prev = prev.previousSibling)) if (prev.nodeName == nodeName) return false;
		var next = node;
		while ((next = next.nextSibling)) if (next.nodeName == nodeName) return false;
		return true;
	},

	/*</of-type-pseudo-selectors>*/

	// custom pseudos

	'enabled': function(node){
		return !node.disabled;
	},

	'disabled': function(node){
		return node.disabled;
	},

	'checked': function(node){
		return node.checked || node.selected;
	},

	'focus': function(node){
		return this.isHTMLDocument && this.document.activeElement === node && (node.href || node.type || this.hasAttribute(node, 'tabindex'));
	},

	'root': function(node){
		return (node === this.root);
	},
	
	'selected': function(node){
		return node.selected;
	}

	/*</pseudo-selectors>*/
};

for (var p in pseudos) local['pseudo:' + p] = pseudos[p];

// attributes methods

local.attributeGetters = {

	'class': function(){
		return this.getAttribute('class') || this.className;
	},

	'for': function(){
		return ('htmlFor' in this) ? this.htmlFor : this.getAttribute('for');
	},

	'href': function(){
		return ('href' in this) ? this.getAttribute('href', 2) : this.getAttribute('href');
	},

	'style': function(){
		return (this.style) ? this.style.cssText : this.getAttribute('style');
	},
	
	'tabindex': function(){
		var attributeNode = this.getAttributeNode('tabindex');
		return (attributeNode && attributeNode.specified) ? attributeNode.nodeValue : null;
	},

	'type': function(){
		return this.getAttribute('type');
	}

};

// Slick

var Slick = local.Slick = (this.Slick || {});

Slick.version = '1.1.5';

// Slick finder

Slick.search = function(context, expression, append){
	return local.search(context, expression, append);
};

Slick.find = function(context, expression){
	return local.search(context, expression, null, true);
};

// Slick containment checker

Slick.contains = function(container, node){
	local.setDocument(container);
	return local.contains(container, node);
};

// Slick attribute getter

Slick.getAttribute = function(node, name){
	return local.getAttribute(node, name);
};

// Slick matcher

Slick.match = function(node, selector){
	if (!(node && selector)) return false;
	if (!selector || selector === node) return true;
	local.setDocument(node);
	return local.matchNode(node, selector);
};

// Slick attribute accessor

Slick.defineAttributeGetter = function(name, fn){
	local.attributeGetters[name] = fn;
	return this;
};

Slick.lookupAttributeGetter = function(name){
	return local.attributeGetters[name];
};

// Slick pseudo accessor

Slick.definePseudo = function(name, fn){
	local['pseudo:' + name] = function(node, argument){
		return fn.call(node, argument);
	};
	return this;
};

Slick.lookupPseudo = function(name){
	var pseudo = local['pseudo:' + name];
	if (pseudo) return function(argument){
		return pseudo.call(this, argument);
	};
	return null;
};

// Slick overrides accessor

Slick.override = function(regexp, fn){
	local.override(regexp, fn);
	return this;
};

Slick.isXML = local.isXML;

Slick.uidOf = function(node){
	return local.getUIDHTML(node);
};

if (!this.Slick) this.Slick = Slick;

}).apply(/*<CommonJS>*/(typeof exports != 'undefined') ? exports : /*</CommonJS>*/this);


/*
---

name: Element

description: One of the most important items in MooTools. Contains the dollar function, the dollars function, and an handful of cross-browser, time-saver methods to let you easily work with HTML Elements.

license: MIT-style license.

requires: [Window, Document, Array, String, Function, Number, Slick.Parser, Slick.Finder]

provides: [Element, Elements, $, $$, Iframe, Selectors]

...
*/

var Element = function(tag, props){
	var konstructor = Element.Constructors[tag];
	if (konstructor) return konstructor(props);
	if (typeof tag != 'string') return document.id(tag).set(props);

	if (!props) props = {};

	if (!(/^[\w-]+$/).test(tag)){
		var parsed = Slick.parse(tag).expressions[0][0];
		tag = (parsed.tag == '*') ? 'div' : parsed.tag;
		if (parsed.id && props.id == null) props.id = parsed.id;

		var attributes = parsed.attributes;
		if (attributes) for (var i = 0, l = attributes.length; i < l; i++){
			var attr = attributes[i];
			if (props[attr.key] != null) continue;

			if (attr.value != null && attr.operator == '=') props[attr.key] = attr.value;
			else if (!attr.value && !attr.operator) props[attr.key] = true;
		}

		if (parsed.classList && props['class'] == null) props['class'] = parsed.classList.join(' ');
	}

	return document.newElement(tag, props);
};

if (Browser.Element) Element.prototype = Browser.Element.prototype;

new Type('Element', Element).mirror(function(name){
	if (Array.prototype[name]) return;

	var obj = {};
	obj[name] = function(){
		var results = [], args = arguments, elements = true;
		for (var i = 0, l = this.length; i < l; i++){
			var element = this[i], result = results[i] = element[name].apply(element, args);
			elements = (elements && typeOf(result) == 'element');
		}
		return (elements) ? new Elements(results) : results;
	};

	Elements.implement(obj);
});

if (!Browser.Element){
	Element.parent = Object;

	Element.Prototype = {'$family': Function.from('element').hide()};

	Element.mirror(function(name, method){
		Element.Prototype[name] = method;
	});
}

Element.Constructors = {};



var IFrame = new Type('IFrame', function(){
	var params = Array.link(arguments, {
		properties: Type.isObject,
		iframe: function(obj){
			return (obj != null);
		}
	});

	var props = params.properties || {}, iframe;
	if (params.iframe) iframe = document.id(params.iframe);
	var onload = props.onload || function(){};
	delete props.onload;
	props.id = props.name = [props.id, props.name, iframe ? (iframe.id || iframe.name) : 'IFrame_' + String.uniqueID()].pick();
	iframe = new Element(iframe || 'iframe', props);

	var onLoad = function(){
		onload.call(iframe.contentWindow);
	};

	if (window.frames[props.id]) onLoad();
	else iframe.addListener('load', onLoad);
	return iframe;
});

var Elements = this.Elements = function(nodes){
	if (nodes && nodes.length){
		var uniques = {}, node;
		for (var i = 0; node = nodes[i++];){
			var uid = Slick.uidOf(node);
			if (!uniques[uid]){
				uniques[uid] = true;
				this.push(node);
			}
		}
	}
};

Elements.prototype = {length: 0};
Elements.parent = Array;

new Type('Elements', Elements).implement({

	filter: function(filter, bind){
		if (!filter) return this;
		return new Elements(Array.filter(this, (typeOf(filter) == 'string') ? function(item){
			return item.match(filter);
		} : filter, bind));
	}.protect(),

	push: function(){
		var length = this.length;
		for (var i = 0, l = arguments.length; i < l; i++){
			var item = document.id(arguments[i]);
			if (item) this[length++] = item;
		}
		return (this.length = length);
	}.protect(),

	unshift: function(){
		var items = [];
		for (var i = 0, l = arguments.length; i < l; i++){
			var item = document.id(arguments[i]);
			if (item) items.push(item);
		}
		return Array.prototype.unshift.apply(this, items);
	}.protect(),

	concat: function(){
		var newElements = new Elements(this);
		for (var i = 0, l = arguments.length; i < l; i++){
			var item = arguments[i];
			if (Type.isEnumerable(item)) newElements.append(item);
			else newElements.push(item);
		}
		return newElements;
	}.protect(),

	append: function(collection){
		for (var i = 0, l = collection.length; i < l; i++) this.push(collection[i]);
		return this;
	}.protect(),

	empty: function(){
		while (this.length) delete this[--this.length];
		return this;
	}.protect()

});



(function(){

// FF, IE
var splice = Array.prototype.splice, object = {'0': 0, '1': 1, length: 2};

splice.call(object, 1, 1);
if (object[1] == 1) Elements.implement('splice', function(){
	var length = this.length;
	splice.apply(this, arguments);
	while (length >= this.length) delete this[length--];
	return this;
}.protect());

Elements.implement(Array.prototype);

Array.mirror(Elements);

/*<ltIE8>*/
var createElementAcceptsHTML;
try {
	var x = document.createElement('<input name=x>');
	createElementAcceptsHTML = (x.name == 'x');
} catch(e){}

var escapeQuotes = function(html){
	return ('' + html).replace(/&/g, '&amp;').replace(/"/g, '&quot;');
};
/*</ltIE8>*/

Document.implement({

	newElement: function(tag, props){
		if (props && props.checked != null) props.defaultChecked = props.checked;
		/*<ltIE8>*/// Fix for readonly name and type properties in IE < 8
		if (createElementAcceptsHTML && props){
			tag = '<' + tag;
			if (props.name) tag += ' name="' + escapeQuotes(props.name) + '"';
			if (props.type) tag += ' type="' + escapeQuotes(props.type) + '"';
			tag += '>';
			delete props.name;
			delete props.type;
		}
		/*</ltIE8>*/
		return this.id(this.createElement(tag)).set(props);
	}

});

})();

Document.implement({

	newTextNode: function(text){
		return this.createTextNode(text);
	},

	getDocument: function(){
		return this;
	},

	getWindow: function(){
		return this.window;
	},

	id: (function(){

		var types = {

			string: function(id, nocash, doc){
				id = Slick.find(doc, '#' + id.replace(/(\W)/g, '\\$1'));
				return (id) ? types.element(id, nocash) : null;
			},

			element: function(el, nocash){
				$uid(el);
				if (!nocash && !el.$family && !(/^(?:object|embed)$/i).test(el.tagName)){
					Object.append(el, Element.Prototype);
				}
				return el;
			},

			object: function(obj, nocash, doc){
				if (obj.toElement) return types.element(obj.toElement(doc), nocash);
				return null;
			}

		};

		types.textnode = types.whitespace = types.window = types.document = function(zero){
			return zero;
		};

		return function(el, nocash, doc){
			if (el && el.$family && el.uid) return el;
			var type = typeOf(el);
			return (types[type]) ? types[type](el, nocash, doc || document) : null;
		};

	})()

});

if (window.$ == null) Window.implement('$', function(el, nc){
	return document.id(el, nc, this.document);
});

Window.implement({

	getDocument: function(){
		return this.document;
	},

	getWindow: function(){
		return this;
	}

});

[Document, Element].invoke('implement', {

	getElements: function(expression){
		return Slick.search(this, expression, new Elements);
	},

	getElement: function(expression){
		return document.id(Slick.find(this, expression));
	}

});



if (window.$$ == null) Window.implement('$$', function(selector){
	if (arguments.length == 1){
		if (typeof selector == 'string') return Slick.search(this.document, selector, new Elements);
		else if (Type.isEnumerable(selector)) return new Elements(selector);
	}
	return new Elements(arguments);
});

(function(){

var collected = {}, storage = {};
var formProps = {input: 'checked', option: 'selected', textarea: 'value'};

var get = function(uid){
	return (storage[uid] || (storage[uid] = {}));
};

var clean = function(item){
	var uid = item.uid;
	if (item.removeEvents) item.removeEvents();
	if (item.clearAttributes) item.clearAttributes();
	if (uid != null){
		delete collected[uid];
		delete storage[uid];
	}
	return item;
};

var camels = ['defaultValue', 'accessKey', 'cellPadding', 'cellSpacing', 'colSpan', 'frameBorder', 'maxLength', 'readOnly',
	'rowSpan', 'tabIndex', 'useMap'
];
var bools = ['compact', 'nowrap', 'ismap', 'declare', 'noshade', 'checked', 'disabled', 'readOnly', 'multiple', 'selected',
	'noresize', 'defer', 'defaultChecked'
];
 var attributes = {
	'html': 'innerHTML',
	'class': 'className',
	'for': 'htmlFor',
	'text': (function(){
		var temp = document.createElement('div');
		return (temp.textContent == null) ? 'innerText' : 'textContent';
	})()
};
var readOnly = ['type'];
var expandos = ['value', 'defaultValue'];
var uriAttrs = /^(?:href|src|usemap)$/i;

bools = bools.associate(bools);
camels = camels.associate(camels.map(String.toLowerCase));
readOnly = readOnly.associate(readOnly);

Object.append(attributes, expandos.associate(expandos));

var inserters = {

	before: function(context, element){
		var parent = element.parentNode;
		if (parent) parent.insertBefore(context, element);
	},

	after: function(context, element){
		var parent = element.parentNode;
		if (parent) parent.insertBefore(context, element.nextSibling);
	},

	bottom: function(context, element){
		element.appendChild(context);
	},

	top: function(context, element){
		element.insertBefore(context, element.firstChild);
	}

};

inserters.inside = inserters.bottom;



var injectCombinator = function(expression, combinator){
	if (!expression) return combinator;

	expression = Object.clone(Slick.parse(expression));

	var expressions = expression.expressions;
	for (var i = expressions.length; i--;)
		expressions[i][0].combinator = combinator;

	return expression;
};

Element.implement({

	set: function(prop, value){
		var property = Element.Properties[prop];
		(property && property.set) ? property.set.call(this, value) : this.setProperty(prop, value);
	}.overloadSetter(),

	get: function(prop){
		var property = Element.Properties[prop];
		return (property && property.get) ? property.get.apply(this) : this.getProperty(prop);
	}.overloadGetter(),

	erase: function(prop){
		var property = Element.Properties[prop];
		(property && property.erase) ? property.erase.apply(this) : this.removeProperty(prop);
		return this;
	},

	setProperty: function(attribute, value){
		attribute = camels[attribute] || attribute;
		if (value == null) return this.removeProperty(attribute);
		var key = attributes[attribute];
		(key) ? this[key] = value :
			(bools[attribute]) ? this[attribute] = !!value : this.setAttribute(attribute, '' + value);
		return this;
	},

	setProperties: function(attributes){
		for (var attribute in attributes) this.setProperty(attribute, attributes[attribute]);
		return this;
	},

	getProperty: function(attribute){
		attribute = camels[attribute] || attribute;
		var key = attributes[attribute] || readOnly[attribute];
		return (key) ? this[key] :
			(bools[attribute]) ? !!this[attribute] :
			(uriAttrs.test(attribute) ? this.getAttribute(attribute, 2) :
			(key = this.getAttributeNode(attribute)) ? key.nodeValue : null) || null;
	},

	getProperties: function(){
		var args = Array.from(arguments);
		return args.map(this.getProperty, this).associate(args);
	},

	removeProperty: function(attribute){
		attribute = camels[attribute] || attribute;
		var key = attributes[attribute];
		(key) ? this[key] = '' :
			(bools[attribute]) ? this[attribute] = false : this.removeAttribute(attribute);
		return this;
	},

	removeProperties: function(){
		Array.each(arguments, this.removeProperty, this);
		return this;
	},

	hasClass: function(className){
		return this.className.clean().contains(className, ' ');
	},

	addClass: function(className){
		if (!this.hasClass(className)) this.className = (this.className + ' ' + className).clean();
		return this;
	},

	removeClass: function(className){
		this.className = this.className.replace(new RegExp('(^|\\s)' + className + '(?:\\s|$)'), '$1');
		return this;
	},

	toggleClass: function(className, force){
		if (force == null) force = !this.hasClass(className);
		return (force) ? this.addClass(className) : this.removeClass(className);
	},

	adopt: function(){
		var parent = this, fragment, elements = Array.flatten(arguments), length = elements.length;
		if (length > 1) parent = fragment = document.createDocumentFragment();

		for (var i = 0; i < length; i++){
			var element = document.id(elements[i], true);
			if (element) parent.appendChild(element);
		}

		if (fragment) this.appendChild(fragment);

		return this;
	},

	appendText: function(text, where){
		return this.grab(this.getDocument().newTextNode(text), where);
	},

	grab: function(el, where){
		inserters[where || 'bottom'](document.id(el, true), this);
		return this;
	},

	inject: function(el, where){
		inserters[where || 'bottom'](this, document.id(el, true));
		return this;
	},

	replaces: function(el){
		el = document.id(el, true);
		el.parentNode.replaceChild(this, el);
		return this;
	},

	wraps: function(el, where){
		el = document.id(el, true);
		return this.replaces(el).grab(el, where);
	},

	getPrevious: function(expression){
		return document.id(Slick.find(this, injectCombinator(expression, '!~')));
	},

	getAllPrevious: function(expression){
		return Slick.search(this, injectCombinator(expression, '!~'), new Elements);
	},

	getNext: function(expression){
		return document.id(Slick.find(this, injectCombinator(expression, '~')));
	},

	getAllNext: function(expression){
		return Slick.search(this, injectCombinator(expression, '~'), new Elements);
	},

	getFirst: function(expression){
		return document.id(Slick.search(this, injectCombinator(expression, '>'))[0]);
	},

	getLast: function(expression){
		return document.id(Slick.search(this, injectCombinator(expression, '>')).getLast());
	},

	getParent: function(expression){
		return document.id(Slick.find(this, injectCombinator(expression, '!')));
	},

	getParents: function(expression){
		return Slick.search(this, injectCombinator(expression, '!'), new Elements);
	},

	getSiblings: function(expression){
		return Slick.search(this, injectCombinator(expression, '~~'), new Elements);
	},

	getChildren: function(expression){
		return Slick.search(this, injectCombinator(expression, '>'), new Elements);
	},

	getWindow: function(){
		return this.ownerDocument.window;
	},

	getDocument: function(){
		return this.ownerDocument;
	},

	getElementById: function(id){
		return document.id(Slick.find(this, '#' + ('' + id).replace(/(\W)/g, '\\$1')));
	},

	getSelected: function(){
		this.selectedIndex; // Safari 3.2.1
		return new Elements(Array.from(this.options).filter(function(option){
			return option.selected;
		}));
	},

	toQueryString: function(){
		var queryString = [];
		this.getElements('input, select, textarea').each(function(el){
			var type = el.type;
			if (!el.name || el.disabled || type == 'submit' || type == 'reset' || type == 'file' || type == 'image') return;

			var value = (el.get('tag') == 'select') ? el.getSelected().map(function(opt){
				// IE
				return document.id(opt).get('value');
			}) : ((type == 'radio' || type == 'checkbox') && !el.checked) ? null : el.get('value');

			Array.from(value).each(function(val){
				if (typeof val != 'undefined') queryString.push(encodeURIComponent(el.name) + '=' + encodeURIComponent(val));
			});
		});
		return queryString.join('&');
	},

	destroy: function(){
		var children = clean(this).getElementsByTagName('*');
		Array.each(children, clean);
		Element.dispose(this);
		return null;
	},

	empty: function(){
		Array.from(this.childNodes).each(Element.dispose);
		return this;
	},

	dispose: function(){
		return (this.parentNode) ? this.parentNode.removeChild(this) : this;
	},

	match: function(expression){
		return !expression || Slick.match(this, expression);
	}

});

var cleanClone = function(node, element, keepid){
	if (!keepid) node.setAttributeNode(document.createAttribute('id'));
	if (node.clearAttributes){
		node.clearAttributes();
		node.mergeAttributes(element);
		node.removeAttribute('uid');
		if (node.options){
			var no = node.options, eo = element.options;
			for (var i = no.length; i--;) no[i].selected = eo[i].selected;
		}
	}

	var prop = formProps[element.tagName.toLowerCase()];
	if (prop && element[prop]) node[prop] = element[prop];
};

Element.implement('clone', function(contents, keepid){
	contents = contents !== false;
	var clone = this.cloneNode(contents), i;

	if (contents){
		var ce = clone.getElementsByTagName('*'), te = this.getElementsByTagName('*');
		for (i = ce.length; i--;) cleanClone(ce[i], te[i], keepid);
	}

	cleanClone(clone, this, keepid);

	if (Browser.ie){
		var co = clone.getElementsByTagName('object'), to = this.getElementsByTagName('object');
		for (i = co.length; i--;) co[i].outerHTML = to[i].outerHTML;
	}
	return document.id(clone);
});

var contains = {contains: function(element){
	return Slick.contains(this, element);
}};

if (!document.contains) Document.implement(contains);
if (!document.createElement('div').contains) Element.implement(contains);



[Element, Window, Document].invoke('implement', {

	addListener: function(type, fn){
		if (type == 'unload'){
			var old = fn, self = this;
			fn = function(){
				self.removeListener('unload', fn);
				old();
			};
		} else {
			collected[$uid(this)] = this;
		}
		if (this.addEventListener) this.addEventListener(type, fn, !!arguments[2]);
		else this.attachEvent('on' + type, fn);
		return this;
	},

	removeListener: function(type, fn){
		if (this.removeEventListener) this.removeEventListener(type, fn, !!arguments[2]);
		else this.detachEvent('on' + type, fn);
		return this;
	},

	retrieve: function(property, dflt){
		var storage = get($uid(this)), prop = storage[property];
		if (dflt != null && prop == null) prop = storage[property] = dflt;
		return prop != null ? prop : null;
	},

	store: function(property, value){
		var storage = get($uid(this));
		storage[property] = value;
		return this;
	},

	eliminate: function(property){
		var storage = get($uid(this));
		delete storage[property];
		return this;
	}

});

/*<ltIE9>*/
if (window.attachEvent && !window.addEventListener) window.addListener('unload', function(){
	Object.each(collected, clean);
	if (window.CollectGarbage) CollectGarbage();
});
/*</ltIE9>*/

})();

Element.Properties = {};



Element.Properties.style = {

	set: function(style){
		this.style.cssText = style;
	},

	get: function(){
		return this.style.cssText;
	},

	erase: function(){
		this.style.cssText = '';
	}

};

Element.Properties.tag = {

	get: function(){
		return this.tagName.toLowerCase();
	}

};

/*<ltIE9>*/
(function(maxLength){
	if (maxLength != null) Element.Properties.maxlength = Element.Properties.maxLength = {
		get: function(){
			var maxlength = this.getAttribute('maxLength');
			return maxlength == maxLength ? null : maxlength;
		}
	};
})(document.createElement('input').getAttribute('maxLength'));
/*</ltIE9>*/

/*<!webkit>*/
Element.Properties.html = (function(){

	var tableTest = Function.attempt(function(){
		var table = document.createElement('table');
		table.innerHTML = '<tr><td></td></tr>';
	});

	var wrapper = document.createElement('div');

	var translations = {
		table: [1, '<table>', '</table>'],
		select: [1, '<select>', '</select>'],
		tbody: [2, '<table><tbody>', '</tbody></table>'],
		tr: [3, '<table><tbody><tr>', '</tr></tbody></table>']
	};
	translations.thead = translations.tfoot = translations.tbody;

	var html = {
		set: function(){
			var html = Array.flatten(arguments).join('');
			var wrap = (!tableTest && translations[this.get('tag')]);
			if (wrap){
				var first = wrapper;
				first.innerHTML = wrap[1] + html + wrap[2];
				for (var i = wrap[0]; i--;) first = first.firstChild;
				this.empty().adopt(first.childNodes);
			} else {
				this.innerHTML = html;
			}
		}
	};

	html.erase = html.set;

	return html;
})();
/*</!webkit>*/


/*
---

name: Element.Style

description: Contains methods for interacting with the styles of Elements in a fashionable way.

license: MIT-style license.

requires: Element

provides: Element.Style

...
*/

(function(){

var html = document.html;

Element.Properties.styles = {set: function(styles){
	this.setStyles(styles);
}};

var hasOpacity = (html.style.opacity != null);
var reAlpha = /alpha\(opacity=([\d.]+)\)/i;

var setOpacity = function(element, opacity){
	if (!element.currentStyle || !element.currentStyle.hasLayout) element.style.zoom = 1;
	if (hasOpacity){
		element.style.opacity = opacity;
	} else {
		opacity = (opacity * 100).limit(0, 100).round();
		opacity = (opacity == 100) ? '' : 'alpha(opacity=' + opacity + ')';
		var filter = element.style.filter || element.getComputedStyle('filter') || '';
		element.style.filter = reAlpha.test(filter) ? filter.replace(reAlpha, opacity) : filter + opacity;
	}
};

Element.Properties.opacity = {

	set: function(opacity){
		var visibility = this.style.visibility;
		if (opacity == 0 && visibility != 'hidden') this.style.visibility = 'hidden';
		else if (opacity != 0 && visibility != 'visible') this.style.visibility = 'visible';

		setOpacity(this, opacity);
	},

	get: (hasOpacity) ? function(){
		var opacity = this.style.opacity || this.getComputedStyle('opacity');
		return (opacity == '') ? 1 : opacity;
	} : function(){
		var opacity, filter = (this.style.filter || this.getComputedStyle('filter'));
		if (filter) opacity = filter.match(reAlpha);
		return (opacity == null || filter == null) ? 1 : (opacity[1] / 100);
	}

};

var floatName = (html.style.cssFloat == null) ? 'styleFloat' : 'cssFloat';

Element.implement({

	getComputedStyle: function(property){
		if (this.currentStyle) return this.currentStyle[property.camelCase()];
		var defaultView = Element.getDocument(this).defaultView,
			computed = defaultView ? defaultView.getComputedStyle(this, null) : null;
		return (computed) ? computed.getPropertyValue((property == floatName) ? 'float' : property.hyphenate()) : null;
	},

	setOpacity: function(value){
		setOpacity(this, value);
		return this;
	},

	getOpacity: function(){
		return this.get('opacity');
	},

	setStyle: function(property, value){
		switch (property){
			case 'opacity': return this.set('opacity', parseFloat(value));
			case 'float': property = floatName;
		}
		property = property.camelCase();
		if (typeOf(value) != 'string'){
			var map = (Element.Styles[property] || '@').split(' ');
			value = Array.from(value).map(function(val, i){
				if (!map[i]) return '';
				return (typeOf(val) == 'number') ? map[i].replace('@', Math.round(val)) : val;
			}).join(' ');
		} else if (value == String(Number(value))){
			value = Math.round(value);
		}
		this.style[property] = value;
		return this;
	},

	getStyle: function(property){
		switch (property){
			case 'opacity': return this.get('opacity');
			case 'float': property = floatName;
		}
		property = property.camelCase();
		var result = this.style[property];
		if (!result || property == 'zIndex'){
			result = [];
			for (var style in Element.ShortStyles){
				if (property != style) continue;
				for (var s in Element.ShortStyles[style]) result.push(this.getStyle(s));
				return result.join(' ');
			}
			result = this.getComputedStyle(property);
		}
		if (result){
			result = String(result);
			var color = result.match(/rgba?\([\d\s,]+\)/);
			if (color) result = result.replace(color[0], color[0].rgbToHex());
		}
		if (Browser.opera || (Browser.ie && isNaN(parseFloat(result)))){
			if ((/^(height|width)$/).test(property)){
				var values = (property == 'width') ? ['left', 'right'] : ['top', 'bottom'], size = 0;
				values.each(function(value){
					size += this.getStyle('border-' + value + '-width').toInt() + this.getStyle('padding-' + value).toInt();
				}, this);
				return this['offset' + property.capitalize()] - size + 'px';
			}
			if (Browser.opera && String(result).indexOf('px') != -1) return result;
			if ((/^border(.+)Width|margin|padding/).test(property)) return '0px';
		}
		return result;
	},

	setStyles: function(styles){
		for (var style in styles) this.setStyle(style, styles[style]);
		return this;
	},

	getStyles: function(){
		var result = {};
		Array.flatten(arguments).each(function(key){
			result[key] = this.getStyle(key);
		}, this);
		return result;
	}

});

Element.Styles = {
	left: '@px', top: '@px', bottom: '@px', right: '@px',
	width: '@px', height: '@px', maxWidth: '@px', maxHeight: '@px', minWidth: '@px', minHeight: '@px',
	backgroundColor: 'rgb(@, @, @)', backgroundPosition: '@px @px', color: 'rgb(@, @, @)',
	fontSize: '@px', letterSpacing: '@px', lineHeight: '@px', clip: 'rect(@px @px @px @px)',
	margin: '@px @px @px @px', padding: '@px @px @px @px', border: '@px @ rgb(@, @, @) @px @ rgb(@, @, @) @px @ rgb(@, @, @)',
	borderWidth: '@px @px @px @px', borderStyle: '@ @ @ @', borderColor: 'rgb(@, @, @) rgb(@, @, @) rgb(@, @, @) rgb(@, @, @)',
	zIndex: '@', 'zoom': '@', fontWeight: '@', textIndent: '@px', opacity: '@'
};



Element.ShortStyles = {margin: {}, padding: {}, border: {}, borderWidth: {}, borderStyle: {}, borderColor: {}};

['Top', 'Right', 'Bottom', 'Left'].each(function(direction){
	var Short = Element.ShortStyles;
	var All = Element.Styles;
	['margin', 'padding'].each(function(style){
		var sd = style + direction;
		Short[style][sd] = All[sd] = '@px';
	});
	var bd = 'border' + direction;
	Short.border[bd] = All[bd] = '@px @ rgb(@, @, @)';
	var bdw = bd + 'Width', bds = bd + 'Style', bdc = bd + 'Color';
	Short[bd] = {};
	Short.borderWidth[bdw] = Short[bd][bdw] = All[bdw] = '@px';
	Short.borderStyle[bds] = Short[bd][bds] = All[bds] = '@';
	Short.borderColor[bdc] = Short[bd][bdc] = All[bdc] = 'rgb(@, @, @)';
});

})();


/*
---

name: Element.Event

description: Contains Element methods for dealing with events. This file also includes mouseenter and mouseleave custom Element Events.

license: MIT-style license.

requires: [Element, Event]

provides: Element.Event

...
*/

(function(){

Element.Properties.events = {set: function(events){
	this.addEvents(events);
}};

[Element, Window, Document].invoke('implement', {

	addEvent: function(type, fn){
		var events = this.retrieve('events', {});
		if (!events[type]) events[type] = {keys: [], values: []};
		if (events[type].keys.contains(fn)) return this;
		events[type].keys.push(fn);
		var realType = type,
			custom = Element.Events[type],
			condition = fn,
			self = this;
		if (custom){
			if (custom.onAdd) custom.onAdd.call(this, fn);
			if (custom.condition){
				condition = function(event){
					if (custom.condition.call(this, event)) return fn.call(this, event);
					return true;
				};
			}
			realType = custom.base || realType;
		}
		var defn = function(){
			return fn.call(self);
		};
		var nativeEvent = Element.NativeEvents[realType];
		if (nativeEvent){
			if (nativeEvent == 2){
				defn = function(event){
					event = new Event(event, self.getWindow());
					if (condition.call(self, event) === false) event.stop();
				};
			}
			this.addListener(realType, defn, arguments[2]);
		}
		events[type].values.push(defn);
		return this;
	},

	removeEvent: function(type, fn){
		var events = this.retrieve('events');
		if (!events || !events[type]) return this;
		var list = events[type];
		var index = list.keys.indexOf(fn);
		if (index == -1) return this;
		var value = list.values[index];
		delete list.keys[index];
		delete list.values[index];
		var custom = Element.Events[type];
		if (custom){
			if (custom.onRemove) custom.onRemove.call(this, fn);
			type = custom.base || type;
		}
		return (Element.NativeEvents[type]) ? this.removeListener(type, value, arguments[2]) : this;
	},

	addEvents: function(events){
		for (var event in events) this.addEvent(event, events[event]);
		return this;
	},

	removeEvents: function(events){
		var type;
		if (typeOf(events) == 'object'){
			for (type in events) this.removeEvent(type, events[type]);
			return this;
		}
		var attached = this.retrieve('events');
		if (!attached) return this;
		if (!events){
			for (type in attached) this.removeEvents(type);
			this.eliminate('events');
		} else if (attached[events]){
			attached[events].keys.each(function(fn){
				this.removeEvent(events, fn);
			}, this);
			delete attached[events];
		}
		return this;
	},

	fireEvent: function(type, args, delay){
		var events = this.retrieve('events');
		if (!events || !events[type]) return this;
		args = Array.from(args);

		events[type].keys.each(function(fn){
			if (delay) fn.delay(delay, this, args);
			else fn.apply(this, args);
		}, this);
		return this;
	},

	cloneEvents: function(from, type){
		from = document.id(from);
		var events = from.retrieve('events');
		if (!events) return this;
		if (!type){
			for (var eventType in events) this.cloneEvents(from, eventType);
		} else if (events[type]){
			events[type].keys.each(function(fn){
				this.addEvent(type, fn);
			}, this);
		}
		return this;
	}

});

Element.NativeEvents = {
	click: 2, dblclick: 2, mouseup: 2, mousedown: 2, contextmenu: 2, //mouse buttons
	mousewheel: 2, DOMMouseScroll: 2, //mouse wheel
	mouseover: 2, mouseout: 2, mousemove: 2, selectstart: 2, selectend: 2, //mouse movement
	keydown: 2, keypress: 2, keyup: 2, //keyboard
	orientationchange: 2, // mobile
	touchstart: 2, touchmove: 2, touchend: 2, touchcancel: 2, // touch
	gesturestart: 2, gesturechange: 2, gestureend: 2, // gesture
	focus: 2, blur: 2, change: 2, reset: 2, select: 2, submit: 2, //form elements
	load: 2, unload: 1, beforeunload: 2, resize: 1, move: 1, DOMContentLoaded: 1, readystatechange: 1, //window
	error: 1, abort: 1, scroll: 1 //misc
};

var check = function(event){
	var related = event.relatedTarget;
	if (related == null) return true;
	if (!related) return false;
	return (related != this && related.prefix != 'xul' && typeOf(this) != 'document' && !this.contains(related));
};

Element.Events = {

	mouseenter: {
		base: 'mouseover',
		condition: check
	},

	mouseleave: {
		base: 'mouseout',
		condition: check
	},

	mousewheel: {
		base: (Browser.firefox) ? 'DOMMouseScroll' : 'mousewheel'
	}

};



})();

/*!
 * kael.me.core.js - based on mootools(http://mootools.net) compact javascript framework.
 * @author  Kael Zhang[i@kael.me]

 * @copyright:
 * - All rights reserved.
 * - Copyright (c) 2009 - 2011 [Kael Zhang](http://kael.me).
 */
 
 
/**
 * corek
 * mt.js -> km.js -> lang.js -> loader.js -> web.js -> config.js
 *
 */

/**
 * @module core
 */

;(function(host, K, undef){

var seed = host && host[K] || {},
        
    // no operation
    NOOP = function(){}, EMPTY = '',


    /**
	 * copy all properties in the supplier to the receiver
	 * @param r {Object} receiver
	 * @param s {Object} supplier
	 * @param or {Boolean} whether override the existing property in the receiver
	 * @param cl {Array} copy list, an array of selected properties
	 */
	mix = function (r, s, or, cl) {
		if (!s || !r) return r;
		var i = 0, c, len;
		or = or || or === undef;
	
		if (cl && (len = cl.length)) {
			for (; i < len; i++) {
				c = cl[i];
				if ( (c in s) && (or || !(c in r) ) ) {
					r[c] = s[c];
				}
			}
		} else {
			for (c in s) {
				if (or || !(c in r)) {
					r[c] = s[c];
				}
			}
		}
		return r;
	},
	
		
// actually, K must be an object, or override it
K = host[K] = seed;
	
mix(K, {
	
	// @const
	__HOST: K.__HOST || host,
	// _app_methods: ['namespace'],


	mix: mix,

    /**
     * deprecated mootools methods

     * @deprecated
     * $chk:
     * $defined:     removed, please simply use "obj !== undefined" instead
     * $arguments:   uesless! removed
     * $empty:       useless, use "function(){}" instead, no querying for scope chain
     * $clear:       useless, use clearTimeout or clearInterval instead
     */

    // if debug mode is off, KM.log & KM.error will do nothing
	log: NOOP,
    error: NOOP,

    /**
     * Creates specified namespace if it doesn't exist 

     * <code>
     *    KM.namespace('widget.Logger'); // returns KM.widget.Logger
     *    KM.namespace('KM.widget.Logger'); // returns KM.widget.Logger
     * </code>

     * @return {Object} current app namespace
     */
    namespace: function(){
        var args = arguments, self = this, h = self.__HOST,
            root = null,

            i = 0, i_len = args.length,
            j, j_len,

            ns;
            
        for(; i < i_len; i ++ ){
            ns = (EMPTY + args[i]).split('.');
			root = self;
            j_len = ns.length;

            for(j = (h[ns[0]] === self ? 1 : 0); j < j_len; j ++){
                root[ns[j]] = root[ns[j]] || {};
                root = root[ns[j]];
            }
        }

        return root;
    },

    /**
     * create application based on KM; or KM-lize objects 
     * @param name {String || Object}
     
    app: function(name) {
        var isStr = K.isString(name),
            app = isStr ? host[name] || { } : name;

        mix(app, this, true, K._app_methods);

        isStr && (host[name] = app);

        return app;
    },
    */

    // load 'log' module to switch debug-mode on
    _debugOn: function(){
        // K.provide('log', function(K){ K.log('debug module attached') });
        
        console.log('debug mode on');
        K._Config.debug = true;
    }
    
});

})(this, 'KM');



KM.namespace('UA', '_Config');


/**
 * 2 do:


 * change log:
 * 2011-04-19  Kael: 迁移 KM.type 到 lang.js
 * 2011-04-01  Kael Zhang: 优化type的方法，为mootools的typeOf创建adapter
 * 2010-12-30  Kael Zhang: 分离 @adaptor 至 /core/lang.js
 * 2010-12-13  Kael Zhang: 修正KM.data()的一个取值错误
 * 2010-12-03  Kael Zhang: 分离 KM.log 模块的逻辑到 /core/debug.js：加载debug.js，会自动装载KM.log与KM.error方法
 * 2010-10-09  Kael Zhang: 创建文件
 *//**
 * @module  lang
 
 * - language enhancement for javascript
 * - adapter for mootools
 */

;(function(K){
	
// bind the this pointer of a function	
function bind_method(fn, bind){
	return function(){
		return fn.apply(bind, arguments);
	}
};

/**
 * transform functions that have the signature fn(key, value)
 * to 
 * functions that could accept object arguments
 * @adapter
 */
function batch_setter(fn){
	return fn.overloadSetter();
};


/**
 * memoize static result of a complicated method to save time
 */
function memoizeMethod(fn){
	var stack = {};
	
	return function(){
		var arg = array_slice.call(arguments).join('~^_^~');
	
		return (arg in stack) ? stack[arg] : (stack[arg] = fn.apply(null, arguments));
	}
};


/**
 * transform constructor functions to functions that could change a method of a instance or singleton 
 */
function overload_for_instance_method(fn){
	var self = this;

	return function(methodname, instance){
		var arg = arguments;
	
		return K.isFunction(methodname) ?
			fn.apply(self, arg)
		:	instance[methodname] = fn.call(instance, instance[methodname], instance);
	};
};


function toQueryString(obj, splitter){
	var key, ret = [];
	
	for(key in obj){
		ret.push(key + '=' + obj[key]);
	}
	
	return ret.join(splitter || '&');
};



var	array_slice = Array.prototype.slice,

	/**
	 * a simple and faster typeOf method, and an adapter for mootools
	 * @adapter
	 */
	type = function(){
	
		/**
		 * @param useOrigin {Boolean} use origin method (of mootools)
		 */
		function _type(obj, useOrigin){
			return !useOrigin && type_map[ toString.call(obj) ] || adapter(obj);
		};
	
		var type_map = {},
			_K = K,
		
			// adapter for mootools 1.3
			adapter = typeOf,
			toString = Object.prototype.toString;
	
		'Boolean Number String Function Array Date RegExp Object'.split(' ').each(function(name){
			var nl = name.toLowerCase();
		
			type_map[ '[object ' + name + ']' ] = nl;
			
			_K['is' + name] = function(o){
				return _type(o) === nl;
			}
		});
	
		return _type;
	}();
 

K.mix(K, {
		  
	/**
	 * @adapter 
	 * ----------------------------------------------------------------------------------------------- /
	 * encapsulation for mootools.core
	 */
			
	/**
	 * Never use KM._type to test for a certain type in your javascript for business, 
	 * since the returned string may be subject to change in a future version
	 
	 * use KM.isXXX instead
	 */
	_type: type,
	 
	merge: Object.merge, // Object.merge
	
	random: Number.random, // Number.random
	
	now: function(){
		return + new Date;
	},
	
	
	lambda: Function.from,
	
	
	/**
	 * language enhancement 
	 * --------------------------------------------------------------------------------------------- */
	 
	
	/**
	 * bind 'this' pointer for a function
	 * or bind a method for a constructor
	 * @usage:
	 * <code>
	   1. KM.bind(myFunction, {a:1});
	   2. KM.bind('method', {a:1, method: function(){ alert(this.a) }});
	 
	 * </code>
	 * 
	 */
	bind: function(fn, bind){
		return K.isFunction(fn) ?
			bind_method(fn, bind)
		:
			(bind[fn] = bind_method(bind[fn], bind));
	},
	
	/**
	 * method to encapsulate the delayed function
	 */
	delay: function(fn, delay, isInterval){
		var timer;
	
		return {
			start: function(){
				this.cancel();
				return timer = isInterval ? setInterval(fn, delay) : setTimeout(fn, delay);
			},
			cancel: function(){
				isInterval ? clearInterval(timer) : clearTimeout(timer);
				return this;
			}
		}
	},
	
	/**
	 * 
	 */
	each: function(obj, fn, stop){
		
	},
	
	makeArray: function(obj){
		return K.isArray(obj) ? obj : [obj];
	},
	
	toQueryString: function(obj, splitter){
		return K.isObject(obj) ? toQueryString(obj, splitter) : obj;
	},
	
	
	/**
	 * OOP Enhancement 
	 * --------------------------------------------------------------------------------------------- */
	 
	 
	/**
	 * overload a setter function or a setter method of a instance
	 */
	_overloadSetter: overload_for_instance_method( batch_setter ),
	
	/**
	 * 
	 */
	_overloadInstanceMethod: overload_for_instance_method,
	
	/**
	 * lazy execute the initialization method before the real method called
	 *
	 * @example
	 * if KM.Overlay::show is the public api to show the overlay
	 * but it has a initialization method, which we want to be called just before the overlay shows, not the very moment when the instance of KM.Overlay created,
	 * so,
	 * we apply:
	 * initialization method 	-> KM.Overlay::show
	 * real show method 		-> KM.Overlay::_show
	 * and then:
	 *
	 * @usage
		 <code>
		 	KM._lazyInit('show', '_show', KM.Overlay.prototype);
		 </code>
	 */
	_lazyInit: function(init_method_name, real_method_name, belong){
		var init = belong[init_method_name],
			real = belong[real_method_name];
			
		belong[init_method_name] = function(){
			init.call(this);
			real.apply(this, arguments);
			
			belong[init_method_name] = real;
		};
		
		delete belong[real_method_name];
	},
	
	/**
	 @usage
		 <code>
			funcion myMethod(string){....}
			var memoizedMyMethod = KM._memoize(myMethod);
		 </code>
	 */
	_memoize: overload_for_instance_method( memoizeMethod )

});


})(KM);

/**
 * TODO:


 * change log:
 * 2011-06-09  Kael:
 * - 增加 KM.each 
 * 2011-04-19  Kael:
 * - 增加 lazyInit 方法，修正 overloadInstanceMethod 的一个bug
 * - 增加 类型判断方法，将 KM._type 从主要api中移除
 * 2011-04-15  Kael:
 * - 增加 overloadSetter的adapter, 为普通函数与instance的方法，重构 overload 和 bind 的实现
 * 2011-04-1   Kael Zhang: 去除lang中的domready方法，增加KM.bind
 * 2010-12-31  Kael Zhang:
 * - 迁移domready方法由mt.js到lang.js，修改部分实现。
 * - 迁移data和delay方法至此
 *//**
 * @module  web
 * methods for browsers and business requirement
 
 * - domready
 * - data storage
 */

;(function(K, undef){

// --- method for KM.data ----------------------- *\
function setData(data){
	data && K.mix(stored_data, data);
};

function cloneData(){
	return K.merge({}, stored_data);
};

function getData(name){
	return stored_data[name];
};
// --- /method for KM.data ----------------------- *\


/**
 * get the readable location object of current page 
 */
function getCurrentLocation(){
	var L, H;

	// IE may throw an exception when accessing
	// a field from document.location if document.domain has been set
	// ref:
	// stackoverflow.com/questions/1498788/reading-window-location-after-setting-document-domain-in-ie6
	try {
		L = DOC.location;
		H = L.href;
	} catch(e) {
	
		// Use the href attribute of an A element
		// since IE will modify it given document.location
		H = DOC.createElement('a');
		H.href = EMPTY;
		H = H.href;
		
		L = parseLocation(H);
	}
	
	return L;
};

/**
 * parse a link to location object
 */
function parseLocation(H){
	var E = nullOrEmpty, port;

	H = H.match(REGEX_URL);
	
	port = H[3];
	
	return {
		href: 		H[0],
		protocol:	H[1],
		host:		H[2] + (port ? ':' + port : EMPTY),
		hostname:	H[2],
		port:		E( port ),
		pathname:	E( H[4] ),
		search:		E( H[5] ),
		hash:		E( H[6] )
	};
};


function nullOrEmpty(str){
	return str || EMPTY;
};

	// @const
var WIN = K.__HOST,
	DOC = WIN.document,
	EMPTY = '',
	_Browser = Browser,
	ua = navigator.userAgent,
	REGEX_WEBKIT = /webkit[ \/]([\w.]+)/i,
	
	// @type {Object}
	stored_data = {},

    is_domready = false,
	is_domready_binded = false,
    is_loaded = false,
	
    readyList = [],
    
    /* 
    REGEX_URL = /^
    	([\w\+\.\-]+:)		// protocol
    	\/\/
    	([^\/?#:]+)			// domain
    (?::
    	(\d+)				// port
    )?
    	(/[^?#]*)?			// pathname
    	(\?[^?#]*)?			// search
    	(#.*)?				// hash
    $/
    */
    
    REGEX_URL = /^([\w\+\.\-]+:)\/\/([^\/?#:]+)(?::(\d+))?(\/[^?#]*)?(\?[^#]*)?(#.*)?$/;
    

K.mix(K, {
	
	/**
	 * @module  data
	
	 * @setter
	 * @getter
	
	 * @usage:
	 * 1. KM.data()                     returns the shadow copy of the current data stack
	 * 2. KM.data('abc')                returns the data named 'abc'
	 * 3. KM.data('abc', 123)           set the value of 'abc' as 123
	 * 4. KM.data({abc: 123, edf:456})  batch setter
	 */
	data: function(name, value){
		var type = K._type(name),
			empty_obj = {},
			is_getter, ret;
		
		if(name === undef){
			ret = cloneData(); // get: return shadow copy
			is_getter = true;
	
		}else if(type === 'string'){
			if(value === undef){
				ret = getData(name); // get: return the value of name
				is_getter = true;
			}else{
				empty_obj[name] = value;
				setData(empty_obj) // set
			}
	
		}else if(type === 'object'){
			setData(name); // set
		}
	
		return is_getter ? ret : K;
	},
	
	isDomReady: function(){
		return is_domready;
	},
	
	isLoaded: function(){
		return is_loaded;
	},
	
	/**
	 * the entire entry for domready event
	 * window.addEvent('domready', fn) has been carried here, and has no more support
	 * @param fn {Function} the function to be executed when dom is ready
	 */
	ready: function(fn){
		// delay the initialization of binding domready, making page render faster
		is_domready_binded || bind_domready();
		
		if(is_domready){
			fn.call(WIN, this);
		}else{
			readyList.push(fn);
		}
	},
	
	/**
	 * @param href {String}
	 * @returns
	 *	- if href undefined, returns the current location
	 *	- if href is a string, returns the parsed loaction
	 */
	getLocation: function(href){
		return href ?
			parseLocation(href)
		:	getCurrentLocation();
	}

});


/**
 * user agent

 @type KM.UA.<browser> {Number} major version of current browser, default to undefined
 - KM.UA.ie
 - KM.UA.firefox
 - KM.UA.opera
 - KM.UA.webkit
 
 @type KM.UA.version {String} full string version, example: 534.30 // webkit, maybe chrome 12 dev

 */
['ie', 'firefox', 'opera'].each(function(name){
	var B = _Browser;

	K.UA[name]  = B[name] ? B.version : undef;
});


(function(UA){
	var m = ua.match(REGEX_WEBKIT);
	
	if(m){
		UA.webkit = parseInt( m[1] );
		UA.fullversion = m[1];
	}else{
		UA.fullversion = String(_Browser.version);
	}
})(K.UA);



/**
 * load event
 */
WIN.addEvent('load', function(){
	is_loaded = true;
});


/**
 * Custom domready event
 * @private
 * ----------------------------------------------------------------------------------------------------------- */

function domready(){

	// fire domready only once
	if(!is_domready){
		is_domready = true;
		fire_domready();
	}
}

function fire_domready(){
	var self = this,
		r = readyList, fn;
		
	if(r){	
		for(var i = 0, len = r.length; i < len; i ++){
			fn = r[i]
			fn && fn.call(WIN, K);
		}

		r.length = 0;
		readyList = null;
	}
};

function bind_domready(){
	var COMPLETE = 'complete', doc = DOC,
		doScroll = doc.documentElement.doScroll,
		eventType = doScroll ? 'onreadystatechange' : 'DOMContentLoaded';
		
	is_domready_binded = true;
	
	// Catch cases where ready() is called after the
	// browser event has already occurred.
	if(doc.readyState === COMPLETE) return domready();
	
	function ready(){
		doc.removeListener(eventType, ready).removeListener('load', ready)
		domready();
	}
	
	doc.addListener(eventType, ready);
	
	// A fallback to load
	// and make sure that domready event fires before load event registered by user
	doc.addListener('load', ready);
	
	if(doScroll){
		var not_framed = false;
		
		try {
			not_framed = win.frameElement == null;
		} catch(e) {}
		
		if(not_framed){
			
			// use conditional function declaration, poll_scroll will not be declared in firefox, that it will save memory
			function poll_scroll(){
				try {
					// doScroll technique by Diego Perini http://javascript.nwbox.com/IEContentLoaded/
					doScroll('left');
					ready();
				} catch(ex) {
					setTimeout(poll_scroll, 10);
				}
			}
			poll_scroll();
		}
	}
}

})(KM);

/**
 * TODO:

 * change log:
 * 2011-06-12  Kael:
 * - fix a bug about the regular expression of location pattern that more than one question mark should be allowed in search query
 
 * 2011-04-26  Kael:
 * - 封装 mootools.Browser
 * - 移除 ua.chrome, ua.safari, 增加 ua.webkit
 * - 修改 ua[browser] 的值
 * 2011-04-12  Kael Zhang:
 * - 修正domready一个不触发的bug
 * - 增加获取location的方法，为了兼容IE6可能出现的bug（当设置了document.domain）
 * 2010-12-31  Kael Zhang:
 * - 迁移domready方法由mt.js到lang.js，修改部分实现。
 * - 迁移data和delay方法至此
 *//**
 * @module  	loader
 * @author  	Kael Zhang[i@kael.me]
 * @version		2.1.4
 
 * @include
 * - static resource loader
 * - a commonjs module loader
 * - interface for business configuration
 
 * @implements
 * - CommonJS::Modules/Wrappings						>> http://kael.me/-cmw
 * - CommonJS::Modules/Wrappings-Explicit-Dependencies	>> http://kael.me/-cmwed
 */

;(function(K, undef){

/**
 * stack, config or flag for modules
 * @define
 */
var	_mods = {},
	_script_map = {},
	_config = {},
	_last_pkg_or_anonymous_mod = null,
	_pending_script = null,
	
	_allow_undefined_mod = true,
	
	// fix onload event on script in ie6-9
	use_interactive = K.UA.ie < 10,
	interactive_script = null,
	
	warning,
	
/**
 * @const
 */
	REGEX_FILE_TYPE = /\.(\w+)$/i,

	/**
	 * http://....../name.min.v2.6.7.334.js
		 /
		 	\b(\w+)						-> name
		 	(?:\.min)?					-> .min
		 	(?:							
		 		\.v						-> .v
		 		((?:\d+\.)*\d+)			-> 2.6.7.334
		 	)?
		 	
		 	(\.js)?						-> .js
		 $/i
	 */
	// REGEX_MODULENAME_SPLITTER = /\b(\w+)(?:\.min)?(?:\.v(?:\d+\.)*\d+)?(\.js)?$/i,
	REGEX_NO_NEED_EXTENSION = /\.(?:js|css)$|#|\?/i,
	REGEX_IS_CSS = /\.css[$#?]/i,
	// REGEX_MODULE_NAME = /\b(\w+)(?:\.min)?$/i,
	REGEX_PATH_CLEANER = /(?:\.min)\.v(?:\d+\.)*\d+/i,
	REGEX_FACTORY_DEPS_PARSER =  /\brequire\b\s*\(\s*['"]([^'"]*)/g,
	
	NOOP = function(){}, // no operation
	
	WIN = K.__HOST,
	DOC = WIN.document,
	HEAD = DOC.getElementsByTagName('head')[0],
	LOC = K.getLocation(),
	
	/**
	 * module status
	 * @enum {Number}
	 * @const
	 */	
	STATUS = {
		// the module's uri has been specified, 
		DEFINING	: 1,
	
		// the module's source uri is downloading or executing
		LOADING		: 2,
		
		// the module has been explicitly defined. 
		DEFINED 	: 3,
		
		// being analynizing and requiring the module's dependencies 
		REQUIRING 	: 4,
		
		// the module's factory function are ready to be executed
		// the module's denpendencies are set as STATUS.READY
		READY 		: 5 //,
		
		// the module already has exports
		// the module has been initialized, i.e. the module's factory function has been executed
		// ATTACHED  	: 6
	},
	
/**
 * static resource loader
 * meta functions for assets
 * --------------------------------------------------------------------------------------------------- */
	
	asset = {
		css: function(uri, callback){
			var node = DOC.createElement('css');
			
			node.href = uri;
			node.rel = 'stylesheet';
			
			callback && assetOnload.css(node, callback);
			
			// insert new CSS in the end of <head> to maintain priority
			HEAD.appendChild(node);
			
			return node;
		},
		
		js: function(uri, callback){
			var node = DOC.createElement('script');
			
			node.src = uri;
			node.async = true;
			
			callback && assetOnload.js(node, callback);
			
			_pending_script = uri;
			HEAD.insertBefore(node, HEAD.firstChild);
			_pending_script = null;
			
			return node;
		},
		
		img: function(uri, callback){
			var node = DOC.createElement('img'),
				delay = setTimeout;

			callback && ['load', 'abort', 'error'].each(function(name){
			
				node['on' + name] = function(){
					node = node.onload = node.onabort = node.onerror = null;
					
					setTimeout(function(){
						callback.call(node, name);
					}, 0);
				};
			});
	
			node.src = uri;
			
			if (callback && node.complete){
				setTimeout( function(){
					callback.call(node, 'load');
				}, 0);
			}
			
			return node;
		}
	}, // end asset
	
	// @this {Element}
	assetOnload = {
		js: ( DOC.createElement('script').readyState ?
				function(node, callback){
			    	node.onreadystatechange = function(){
			        	var rs = node.readyState;
			        	if (rs === 'loaded' || rs === 'complete'){
			            	node.onreadystatechange = null;
			            	
			            	callback.call(this);
			        	}
			    	};
				} 
			:
				function(node, callback){
					if(callback){
						node.addEventListener('load', callback, false);
						// node.addEventListener('error', function(){}, false);
					}
				}
		),
		
		css: ( DOC.createElement('css').attachEvent ?
				function(node, callback){
					node.attachEvent('onload', callback);
				}
			:	
				// ECMAScript 3+
				function CSSPoll(node, callback){
					var is_loaded = false,
						sheet = node['sheet'];
					
					if(sheet){
						if(K.UA.webkit){
							is_loaded = true;
						
						}else{
							try {
								if(sheet.cssRules) {
									is_loaded = true;
								}
							} catch (ex) {
								if (ex.name === 'NS_ERROR_DOM_SECURITY_ERR') {
									is_loaded = true;
								}
							}
						}
					}
				
				    if (is_loaded) {
				    	setTimeout(function(){
				    		callback.call(node);
				    	}, 0);
				    }else {
						setTimeout(function(){
							CSSPoll(node, callback);
						}, 0);
				    }
	  			}
  		)
  	}; // end assetOnload


/**
 * method to load a resource file
 * @param {String} uri uri of resource
 * @param {Function} callback callback function
 * @param {String=} type the explicitily assigned type of the resource, 
 	can be 'js', 'css', or 'img'. default to 'img'. (optional) 
 */
function loadSrc(uri, callback, type){
	var extension = type || uri.match(REGEX_FILE_TYPE)[1];
	
	return extension ?
		( asset[ extension.toLowerCase() ] || asset.img )(uri, callback)
		: null;
};


/**
 * module loader
 * --------------------------------------------------------------------------------------------------- */
 
/**
 API Design:
 Module Define: >>>>>>>>>>>>>>>>>>>>>>>
 
 {1.} 
 define a module with a module id, 
 specially for defining modules in inline script
 never define a non-anonymous module in a non-package file
 
	 1.1
	 with factory function
	 
	 KM.define(
	 	'moduleA|1.10.3', 
	 	
	 	// @param K {Object} KM
	 	// @param require {Function}
	 	function(K, require, exports){
		 	var B = require('moduleB');
		 	
		 	// readonly
		 	// a shadow copy
		 	B.__DATA => {
		 	
		 		// dependencies will be dynamically analysised
		 		// after the module's first requirement 
		 		dependencies: ['moduleC', 'moduleB'],
		 		uri: 'http://....js'
		 	}
		 	
		 	1.1.1: 
		 	exports.method1 = f1(B);
		 	exports.method2 = f2(B);
		 	
		 	1.1.2: 
		 	return {
		 		method1: f1(B),
		 		method2: f2(B)
		 	}	
	 	}
	 );
	 
	 1.2
	 with exports object
	 
	 KM.define('moduleA', {
	 	method1: ....,
	 	method2: ....
	 });
	 
	 1.3
	 with explicit dependencies,
	 in this case, KM module loader will not parse the factory function to fetch them
	 
	 KM.define('moduleA', ['moduleB'], function(){
	 	...
	 });

 {2.}
 define a module's uri - for a version ctrl system, such as main-site
 esp for inline declarations
 
	 2.1 normal
	 KM.define('moduleA', 'http://......./A.js');
	 KM.define('moduleA', '/pack/A.js');
	 
	 2.2 with version
	 KM.define('moduleA|version', 'http://.../A.js');
	 
	 2.3 direct define a uri
	 KM.define('http://.../A.js');
	 
 
 ## 3. anonymous module will be executed right now
 ## 3. configuration, before any module has been defined
 
 {3.} 
 anonymous module definition
 for defining a module in a module file
 
 if define a anonymous in a javascript file, the module will be related to the module name of {2.}
 
	 3.1
	 KM.define({
	 	options1: ...
	 })
	 
	 3.2
	 KM.define(function(K){
	 	return {
	 		options1:
	 	}
	 });
 */

/**
 * method to define a module
 * @public
 * @method KM.define
 
 * @param {String} name module name
 * @param {Array=.<String>} dependencies array of module names
 * @param {String|Function|Object} factory
 * 		{String} 	the uri of a (packaged) module(s)
 *  	{Function} 	the factory of a module
 *  	{Object} 	module exports
 */
function define(name, dependencies, factory){
	var version;

	// overload and tidy arguments >>>
	if(!K.isString(name)){  				// -> define(dependencies, factory);
		factory = dependencies;
		dependencies = name;
		name = undef;
	}
	
	if(!K.isArray(dependencies)){ 			// -> define(factory);
		if(dependencies){
			factory = dependencies;
		}
		dependencies = undef;
	}
	
	// @convention:
	// 1. in this case, KM.define must not be called in a module file
	// 2. in this case, if you define([name, ] dependencies, uri), dependencies will be no use
	if(K.isString(factory)){				// -> define(alias, uri);
		factory = absolutizeURI(factory);
	}
	
	// split name and version
	if(name){
		name = name.split('|');
		version = name[1] || '';
		name = name[0];
	
		if(arguments.length === 1){			// -> define(uri);
			factory = absolutizeURI(name);
			name = '';
		}
	}
	
	_define(name, version, dependencies, factory);
};


/**
 * method for inner use
 * @private
 * @param {String|Undefined} name
 		{String}
 			=== '': in the case that only defining module uri
 			!== '': module identifier 
 		{Undefined} anonymous module definition - the module has no explicit identifier
 * @param {Number=} version version of the custom module. (optional)
 * @param {Array=.<String>} depandencies
 * @param {Function|Object|String} factory 
 * @param {Boolean=} isImplicit whether is implicit definition. (optional)
 		if true, _define is not called by users, but the loader itself.
 */
function _define(name, version, dependencies, factory, isImplicit){
	/**	
	 * @type {Object}
	 * restore mod data {
		 	version:	{String=}	version
		 	status:		{Number}	module status
		 	uri:		{String}	source uri of module
		 	isCSS:		{Boolean=}	whether is css module
		 	
		 	// either of two
		 	factory:	{function}	factory function
		 	exports:	{Object}	module exports
		 }
	 */
	var mod = {}, 
		name_with_ver, ver, pkg, path_info, identifier,
		existed, existed_ver,
		active_script_uri;
	
	/**
	 * get module object 
	 */
	if(name){
		// mod.name = name;
		pkg = _last_pkg_or_anonymous_mod;
		
		// modules defined in packages will be treated as explicit-defined modules
		// if(pkg){
		//	isImplicit = true;
		// }
		
		if(version){
			name_with_ver = name + '|' + version;
			mod.version = version;
		}
	
	// anonymous module define
	}else if(name !== ''){
		
		// via Kris Zyp
		// Ref: http://kael.me/-iikz
		if (use_interactive) {
			
			// > In IE, if the script is not in the cache, when define() is called you 
			// > can iterate through the script tags and the currently executing one will 
			// > have a script.readyState == "interactive" 
			active_script_uri = getInteractiveScript();
				
			active_script_uri = active_script_uri.src	
				
				// > In IE, if the script is in the cache, it actually executes *during* 
				// > the DOM insertion of the script tag, so you can keep track of which 
				// > script is being requested in case define() is called during the DOM 
				// > insertion.			
				|| _pending_script;
	    }
	    
	    if(!active_script_uri){
	    	// if fetching interactive script failed, so fall back to normal ways
	    	_last_pkg_or_anonymous_mod = mod;
	    }else{
	    	mod = getMod( generateModulePath(active_script_uri).i );
	    }
	}
	
	switch(K._type(factory)){
		
		// @convention:
		// in this case, this module must not be defined in a module file
		// # and the uri must be absolute uri
		case 'string':
			mod.status = STATUS.DEFINING;
			path_info = generateModulePath(factory);
			mod.uri = generateModuleURI(path_info.u, factory);
			identifier = path_info.i;
			
			if(REGEX_IS_CSS.test(factory)){
				mod.isCSS = true;
			}
			
			break;
			
		case 'function':
			mod.factory = factory;
			
			// if dependencies is explicitly defined, loader will never parse them from the factory function
			// so, to define a standalone module, you can set dependencies as []
			if(!dependencies){
				dependencies = parseDependencies(factory);
			}
			
			if(dependencies.length){
				mod.status = STATUS.DEFINED;
				
				// only if defined with factory function, can a module has dependencies
				// TODO:
				// enable dependencies for other types of definitions ?
				mod.dependencies = dependencies;
			}else{
				mod.status = STATUS.READY;
			}
			
			break;
			
		case 'object':
			mod.exports = factory;
			
			// tidy module data, when fetching interactive script succeeded
			active_script_uri && tidyModuleData(mod);
			break;
			
		default:
			new LoaderError('Unexpected factory type for '
				+ ( name ? 'module "' + name + '"' : 'anonymous module' ) 
				+ ': ' + K._type(factory)
			);
	}
	
	/**
	 * version comparison only occurs when defining a custom module
	 * if you directly provide a library module, it will always be the latest version
	 * but someday, you wanna use a module and its relevant old tagged version simultaniously in ONE page,
	 * you could do something like this:
	 
	 <code>
	 	KM.define('validator|1.0', 'http://kael.me/lib/form/validator.js');
	 	KM.define('validator|2.0', 'http://kael.me/lib/2.0/form/validator.js');
	 	
	 	KM.provide(['validator', 'validator|1.0', 'validator|2.0'], function(K, v, v1, v2){
	 		v === v2; // true
	 		v1; // validator 1.0
	 		v2;	// validator 2.0 
	 	});
	 </code>
	 */
	if(!isImplicit){
		name_with_ver && memoizeMod(name_with_ver, mod);
		
		if(name){
			existed = getMod(name);
			
			if( // module doesn't exists
				!existed ||
				
				// the existed module has no version
				!(existed_ver = existed.version) ||
				
				// current module is newer than the existed one
				version && versionCompare(version, existed_ver)
			){
				memoizeMod(name, mod);
			}
		}
	}
	
	if(pkg){
		path_info = generateModulePath( moduleNameToURI(name, _config.defaultDir) );
		identifier = path_info.i;
		
		// modules defined in packages are treated as library module
		if(!mod.exports){
			mod.uri = generateModuleURI(path_info.u);
		}
	}
	
	if(identifier){
		memoizeMod(identifier, mod);
	}
	
	// internal use
	return mod;
};


/**
 Module Load: >>>>>>>>>>>>>>>>>>>>>>>
 will immediately attach a module into the environment
 -> STATUS.ATTACHED
 
 {1.}
 provide a module without callback
 will make a module or modules ready to use, and attach all requirements
 -> STATUS.READY
 
 KM.provide('moduleA');
 KM.provide(['moduleA', 'moduleB'])
 
 
 {2.}
 provide a module with callback
 
 KM.provide('moduleA', function(K, A){});
 KM.provide(['moduleA', 'moduleB'], function(K, A, B){});
 
 
 ARGUMENTS:
 if module name is a source uri, it will define a module before the actions above
	 
 */
 
/**
 * method to load a module
 * @public
 * @param {Array.<String>} dependencies
 * @param {Function=} callback (optional)
 */
function provide(dependencies, callback){
	dependencies = K.makeArray(dependencies);
	
	_provide(dependencies, callback, {});
}; 

/**
 * @private
 * @param {Object} env environment for cyclic detecting and generating the uri of child modules
 	{
 		r: {String} the uri that its child dependent modules referring to
 		p: {String} the uri of the parent dependent module
 	}
 * @param {Boolean=} noCallbackArgs whether callback method need arguments, for inner use
 */
function _provide(dependencies, callback, env, noCallbackArgs){
	var counter = dependencies.length,
		args = [K],
		arg_counter = 0,
		cb;
		
	if(K.isFunction(callback)){
		cb = noCallbackArgs ?
			callback
		: 
			function(){
				var real_arg = []
				callback.apply(null, args);
			};
	}
		
	if(counter === 0){
		cb && cb();
	}else{
		foreach(dependencies, function(dep, i, undef){
			var mod = getOrDefine(dep, env.r),
				arg_index = mod.isCSS ? 0 : ++ arg_counter;
			
			if(isCyclic(env, mod.uri)){
				warning('cyclic dependency detected!');
			}
		
			provideOne(mod, function(){
				if(cb){
					-- counter;
				
					if(!noCallbackArgs && arg_index){
						args[arg_index] = createRequire(env)(dep);
					}
					
					if(counter === 0){
						cb();
					}
				}
			}, {r: mod.uri, p: env});
		});
	}
};

// @private
function getOrDefine(name, referenceURI, noWarn, undef){
	var mod, uri, warn;
		
	if(!referenceURI){
		// check for explicitly defined module
		mod = getMod(name);
		warn = !noWarn && !_allow_undefined_mod && !mod;
	}
	
	if(!mod){
		uri = moduleNameToURI(name, referenceURI);
		mod = getMod(generateModulePath(uri).i);
		
		if(!mod){
			warn = warn && !mod;
			mod = _define(name, undef, undef, uri, referenceURI);
		}
	}
	
	warn && warning('module ' + name + ' has not explicitly defined!');
	
	return mod;
};


/**
 * @method provideOne(for inner use)
 * method to provide a module, push its status to at least STATUS.ready
 */
function provideOne(mod, callback, env){
	var status = mod.status;
	
	function cb(){
		var ready = STATUS.READY;
		if(mod.status < ready){
			mod.status = ready;
		}
		
		callback();	
	};
	
	// provideOne method won't initialize the module or execute the factory function
	if(mod.exports || status === STATUS.READY){
		return callback();
		
	}else if(status === STATUS.REQUIRING){
		mod.pending.push(cb);
	
	}else if(status === STATUS.DEFINED){
		mod.status = STATUS.REQUIRING;
		mod.pending = [cb];
		
		_provide(mod.dependencies, function(){
			var m = mod;
			foreach(m.pending, function(c){
				c();
			});
			
			m.pending.length = 0;
			delete m.pending;
		}, env, true);
		
	}else if(status < STATUS.DEFINED){
		loadModuleSrc(mod, function(){
			var last = _last_pkg_or_anonymous_mod;
			
			// CSS dependency
			if(mod.isCSS){
				mod.status = STATUS.ready;
				delete mod.uri;
			
			// handle with anonymous module define
			}else if(last && mod.status === STATUS.LOADING){
				
				if(last.status < STATUS.DEFINED){
					new LoaderError('mod with no factory detected in a module file');
				}
				
				K.mix(mod, last);
				_last_pkg_or_anonymous_mod = null;
				
				// when after loading a library module, 
				// and IE didn't fire onload event during the insertion of the script node
				tidyModuleData(mod);
			}
			
			provideOne(mod, cb, env);
		});
	}
};


/**
 * specify the environment for every id that required in the current module
 * including
 * - reference uri which will be set as the current module's uri 
 */
function createRequire(envMod){
	function require(id){
		var mod = getOrDefine(id, envMod.uri, true);
		
		// if(!mod || mod.status < STATUS.READY){
		// 	new LoaderError('Module "' + id + '" is not defined, or has not attached');
		// }
		
		return mod.exports || generateExports(mod);
	};
	
	return require;
};


function generateExports(mod){
	var exports = {},
		ret;
		
	if(mod.status === STATUS.READY && K.isFunction(mod.factory) ){
		ret = mod.factory(K, createRequire(mod), exports);
		
		if(ret){
			exports = ret;
		}
		
		mod.exports = exports;
		tidyModuleData(mod);
	}
		
	return exports;
};


function tidyModuleData(mod){
	if(mod.exports){
		// free
		// however, to keep the code clean, 
		// tidy the data of a module at the final stage instead of at each intermediate process
		if(mod.dependencies){
			mod.dependencies.length = 0;
			delete mod.dependencies;
		}
		
		delete mod.factory;
		delete mod.uri;
		delete mod.status;
	}
	
	return mod;
};


/**
 Package Define >>>>>>>>
 
 dir structure:
 | - form /
 |    | - validator
 |    | - placeholder
 |    | - html5-detect
 |
 | - remote /
 |    | - ajax
 |    | - jsonp
 |
 | - mix.js
      
 if we define a package-module
 KM.define('mixed', 'http://....../mixed.js');
 
 we could define the package structure in the TOP of form.js:
 
 KM._pkg('form/validator', 'form/placeholder', 'form/html5-detect', 'remote/ajax');
 ---- this is how to deal with the ever changing of module path
 
 KM.define('form/validator', ...);
 KM.define('form/placeholder', ...);
 KM.define('form/html5-detect', ...);
 KM.define('form/ajax', ...);
 
 then, if we require the package 'mixed', code could be like below:
 
 {1.}
 KM.define('review-form', function(K, require, exports){
 	var mixed = require('mixed');
 	
 	// mixed with have 4 methods:
 	// mixed.validator
 	// mixed.placeholder
 	// mixed['html-detect']
 	// mixed.ajax
 });
 
 {2.}
 KM.provide('mixed', function(K, mixed){
 	// new mixed.validator(...);
 	// new mixed.placeholder(...);
 });
 
 @note:
 when packaged, the uri source of a module is changed, 
 so we define its former dir by the declaration of KM.pkg 
 
 */
 
/**
 * define a package
 * @public
 */
function definePackage(){
	var members = arguments;

	if(members.length){
		var U;
		
		_last_pkg_or_anonymous_mod = _define(U, U, members, function(K, require, exports){
			foreach(members, function(member){
				exports[member.match(/\b\w+$/i)[0]] = require(member);
			});
		});
	}
};


/**
 Module View: >>>>>>>>>>>>>>>>>>>>>>>>
 display all modules that declared, with their informations, including attach status
 => {
 		moduleA: {},
 		moduleB: {}
 	}
 */
function showAllModules(){
	console.log('allmods:', Object.clone(_mods));
};


/**
 * load a script and remove script node after loaded
 * @param {String} uri
 * @param {Function} callback
 * @param {!String.<'css', 'js'>} type the type of the source to load
 */
function loadScript(uri, callback, type){
	var node,
		cb = type === 'css' ? callback : function(){
			callback.call(node);
	
			if(!isDebugMode()){
				try {
					if(node.clearAttributes) {
						node.clearAttributes();
					}else{
						for(var p in node){
							delete node[p];
						}
					}
				} catch (e) {}
				
				HEAD.removeChild(node);
			}
			node = null;
		};
	
	node = asset[ type ](uri, cb);
};


/**
 * load the module’s resource file
 * always load a script file no more than once
 */
function loadModuleSrc(mod, callback){
	var uri = mod.uri,
		script = _script_map[uri],
		LOADED = 1;
        
    if (!script) {
        script = _script_map[uri] = [callback];
        mod.status = STATUS.LOADING;
        
        loadScript(uri, function(){
        	var m = mod;
        		
        	foreach(script, function(s){
        		s.call(m);
        	});
        	
        	// _script_map[uri] = LOADED;
        	
        	// the logic of loader ensures that, once a uri completes loading, it will never be requested 
        	delete _script_map[uri];
        }, mod.isCSS ? 'css' : 'js');
        
    // } else if (script === LOADED) {
    //    callback.call(mod);  
    } else {
        script.push(callback);
    }	
};


/**
 * module tools
 * --------------------------------------------------------------------------------------------------- */

function moduleNameToURI(name, referenceURI){
	var no_need_extension = REGEX_NO_NEED_EXTENSION.test(name);
	return absolutizeURI(name + (no_need_extension ? '' : '.js'), referenceURI);
};

// memoize the result of analysisModuleName 
// analysisModuleName = K._memoize(analysisModuleName);

/**
 * generate the path of a module, the path will be the identifier to determine whether a module is loaded or defined
 * @param {String} uri the absolute uri of a module. no error detection
 */
function generateModulePath(uri){
	var path_for_uri = uri,
		path_for_identifier = uri;

	if(_config.enableCDN){
		var loc = K.getLocation(uri);
		path_for_uri = loc.pathname + loc.search;
		path_for_identifier = loc.pathname;
	}

	return {
		u: path_for_uri,
		i: path_for_identifier.replace(REGEX_PATH_CLEANER, '')
	};
};

generateModulePath = K._memoize(generateModulePath);


function generateModuleURI(path, absoluteURI){
	var config = _config;
	return config.enableCDN ? config.CDNHasher(path) + path : absoluteURI || path;
};


/**
 * get a module by id
 */
function getMod(id, version){
	return _mods[id + (version ? '|' + version : '' )];
};


function memoizeMod(id, mod){
	_mods[id] = mod;
};


function isCyclic(env, uri) {
	return uri && ( env.r === uri || env.p && isCyclic(env.p, uri) );
};


/**
 * parse dependencies from a factory function
 */
function parseDependencies(factory){
	return parseAllSubMatches(removeComments(String(factory)), REGEX_FACTORY_DEPS_PARSER);
};


function getInteractiveScript() {
	if (interactive_script && interactive_script.readyState === 'interactive') {
		return interactive_script;
	}
	
	// KM loader only insert scripts into head
	var scripts = HEAD.getElementsByTagName('script'),
		script,
		i = 0,
		len = scripts.length;
	
	for (; i < len; i++) {
		script = scripts[i];
			if (script.readyState === 'interactive') {
			return (interactive_script = script);
		}
	}
	
	return null;
};


function isDebugMode(){
	return K._Config.debug;
};


/**
 * custom error type
 */
function LoaderError(message){
	throw {
		message:	message,
		toString:	function(){
			return 'KM Loader: ' + message;
		}
	};
};

warning = WIN.console && console.warn ?
	function(msg){
		console.warn('KM Loader: ' + msg);
	}
:	NOOP;


/**
 * data santitizer
 * --------------------------------------------------------------------------------------------------- */

/**
 * parse all sub matches of a string according to a regular expression
 */
function parseAllSubMatches(string, regex){
	var ret = [], match;
	
	if(regex.global){
		while(match = regex.exec(string)){
			ret = ret.concat( match.slice(1) );
		}
	}else{
		match = string.match(regex);
		if(match){
			ret = match.slice(1);
		}
	}
	
	return ret;
};


/**
 * simply remove comments from the factory function
 * http://is.gd/qEf8pH
 */
function removeComments(code){
	return code
		.replace(/(?:^|\n|\r)\s*\/\*[\s\S]*?\*\/\s*(?:\r|\n|$)/g, '\n')
        .replace(/(?:^|\n|\r)\s*\/\/.*(?:\r|\n|$)/g, '\n');
};

 
/**
 * compare two version, such as a.b.c.d
 * @returns {Boolean} whether v1 is newer
 */
function versionCompare(v1, v2){
    v1 = v1.split('.');
    v2 = v2.split('.');
    
    var len = Math.max(v1.length, v2.length) - 1,
    	i = 0,
    	ret = 0;
    	
    do{
    	ret = ( v1[len] || 0 ) - ( v2[len] || 0 );
    
    }while(len -- && ret === 0);
    
    return result >= 0;
};


/**
 * the reference uri for a certain module is the module's uri
 */
function absolutizeURI(uri, referenceURI){
	referenceURI = referenceURI || _config.defaultDir;

	var ret;
	
	// absolute uri
    if (isAbsoluteURI(uri)) {
    	ret = uri;
    }
    // relative uri
    else if (uri.indexOf('./') === 0 || uri.indexOf('../') === 0) {
		ret = realpath(getDir(referenceURI) + uri);
    }
    // root uri
    else if (uri.indexOf('/') === 0) {
    	// for inner use, referenceURI is always a absolute uri
    	// so we can get its host
    	ret = getHost(referenceURI) + uri;
    }
    
    else {
    	ret = _config.defaultDir + uri;
    }
	
	return ret;	
};


function isAbsoluteURI(uri){
	return uri && uri.indexOf('://') !== -1;
};


/**
 * Canonicalize path.
 
 * realpath('a/b/c') ==> 'a/b/c'
 * realpath('a/b/../c') ==> 'a/c'
 * realpath('a/b/./c') ==> '/a/b/c'
 * realpath('a/b/c/') ==> 'a/b/c/'
 * # realpath('a//b/c') ==> 'a/b/c' ?
 * realpath('a//b/c') ==> 'a//b/c'   - for 'a//b/c' is a valid uri
 * by Frank Wang -> http://jsperf.com/memoize
 */
function realpath(path) {
	var old = path.split('/'),
		ret = [];
		
	foreach(old, function(part, i){
		if (part === '..') {
			if (ret.length === 0) {
			  	new LoaderError('Invalid module path: ' + path);
			}
			ret.pop();
			
		} else if (part !== '.') {
			ret.push(part);
		}
	});
	
	return ret.join('/');
};


/**
 * get the current directory from the location
 *
 * http://jsperf.com/regex-vs-split/2
 * vs: http://jsperf.com/regex-vs-split
 */
function getDir(uri){
	var s = uri.match(/.*(?=\/.*$)/);
    return (s ? s[0] : '.') + '/';
};


function getHost(uri){
	var s = uri.match(/^\w+:\/\/[^/]+/); /* coda highlight error */ 
	return s[0];
};


/**
 * @lang
 * ---------------------------------------------------------------------------------- */

function foreach(array, fn){
	var i = 0,
		len = array.length;
		
	for(; i < len; i ++){
		fn(array[i], i);
	}
};


/**
 * @public
 * ---------------------------------------------------------------------------------- */

// load a static source
K.load = loadSrc;

if(K.define){
	return;
}

// define a module
K._define = define; 

// attach a module
K._provide = provide;

// define a package
// this method will be used by package builder, not developers, except testing cases
K._pkg = definePackage;

K._allMods = showAllModules;

K._loaderConfig = function(config){
	var config = K.mix(_config, config || {}),
		page_root,
		
		// TODO:
		// whether should have a default value
		base = config.base || '/';
		
	/**
	 @type {Object} config
	 {
	 	base: 				{String} root "path" of module library
	 	allowUndefinedMod: 	{Boolean}
	 	enableCDN:			{Boolean}
	 	CDNHasher: 			{Function}
	 }
	 */
	
	// exec only once
	K._loaderConfig = NOOP;
	
	// initialize
	if(!config.enableCDN || !config.CDNHasher){
		page_root = getHost(LOC.href);
		
		config.CDNHasher = function(){
			return page_root;
		};
	}
	
	if(isAbsoluteURI(base)){
		config.defaultDir = base;
		config.base = getDir( K.getLocation(base).pathname );
	}else{
		config.defaultDir = config.CDNHasher() + base;
		config.base = base;
	}
	
	_allow_undefined_mod = config.allowUndefinedMod;
};


K.define = K.provide = function(){
	K._loaderConfig();
};

// bind initialization method to public methods
K._lazyInit('define',  '_define',  K);
K._lazyInit('provide', '_provide', K);

// temp method for testing
K._get = function(name){
	return _mods[name];
};

})(KM);

/**
 * change log:
 2011-06-15  Kael:
 - fix a bug, in ie6 on virtual machine, that the module could not load successfully, 
 	if onload event fired during insertion of the script node(interactive script fetched) 
 
 2011-06-14  Kael:
 - TODO[06-08].A
 - add more annotations
 
 2011-06-12  Kael:
 - TODO[06-08].B
 
 2011-06-10  Kael:
 - add assetOnload.css
 - add support for css dependencies: TODO[05-17].H
 - add support for resources with search query
 - if module uri has a location.search and location.hash, it wont be fulfilled width the extension of '.js' any more
 
 TODO:
 - A?. default configurations
 - B?. Loader Class support: to create various loader instances with different configurations
 
 2011-06-08  Kael:
 - tidy the status data of modules
 - modules defined in package files will be treated as library modules
 
 TODO:
 - √ A. [issue] when no cdn, package modules don't properly saved in {_mods}: 
 		the module identifier should not be a pathname but absolute uri
 - √ B. tidy the logic about configuration, such as managing default settings, checking.
 
 2011-06-07  Kael:
 - fix a syntax exception when defining anonymous module in ie6-9
 
 2011-06-05  Kael:
 - TODO[05-27].A
 
 2011-05-27  Kael:
 - fix a bug of implicit module definition
 - fix a bug that the callback isn't able to be called when the module is already being providing
 
 TODO:
 - √ A. [issue] implicitly defined module dont properly saved as absolute uri
 
 2011-05-26  Kael:
 - TODO[05-17].C
 
 2011-05-25  Kael: 95%!
 - optimize call chain. create private methods with no type-detecting for arguments
 - module path will include location.search
 - config.enableCDN will affect module path
 - support modules with multiple versions
 - complete cdn auto delivery TODO[05-17].E2
 - remove analysisModuleName method
 - complete all functionalities relevant with package definition TODO[05-17].G
 
 2011-05-24  Kael:
 - require and define methods in inline docs and in module file will be different
 - TODO[05-17]['A', 'D', 'E1', 'B']
 - adjust annotations for advanced mode of closure compiler
 
 TODO:
 - √ optimize and cache dependent modules and module infos
 - test TODO[05-17].B
 
 milestone 2.0 ---------------------------
 
 2011-05-20  Kael:
 - redesign the realization of modules, 
   distinguish the 2 different ways to define a module - on page or in a module file
 - redesign require method
 - add config for CDNHasher
 
 2011-05-19  Kael:
 - # remove lazy quantifier from the regexp to match comments
 	choose lazy match afterwards
 
 2011-05-18  Kael:
 - remove comments before parsing dependencies from factory function
 
 milestone 1.0 ---------------------------
 
 2011-05-17  Kael:
 - memoize the result of analysisModuleName
 - santitize the logic of providing a module, split provideOne off from provide
 - complete basic work flow
 
 TODO:
 - √ B. cyclic dependency detection
 - √ A. reference path for the inside of each module
 - √ C. fix scriptonload on ie6-9
 - √ D. tidy module data, remove no-more unnecessary properties
 - √ E. enable the support to cdn
 		- √ avoid duplicate request
 		- √ cdn frequency adjustion ?
 - # F. detecting potential invocation errors
 		- change 'exports' object
 		- define non-anonymous module in a module file
 - H. support css dependencies
 - √ Z. debug-release mode switching
 		- debug: 
 			- √ maintain the script nodes which attached into the document
 			- print dependency tree
 		- release: 
 			- √ remove script nodes
 			- √ warn, if a module's uri has not been specified
 - √ G. package association
 
 2011-05-10  Kael:
 - create main function of provide
 - add a new api, KM.pkg to define a package
 
 2011-05-02  Kael:
 - create main function of define
 
 2011-04-03  Kael: basic api design
 
 *//**
 * @module  config
 * global configurations:
 * - loader config
 * - evironment config
 */
 



;(function(K){


function CDNHasher(evidence){
	function hashToNumber(s){
		return (s || '').length % 3 + 1;
	};
	
	return 'http://i' + hashToNumber(evidence) + '.dpfile.com';
};
	

K._loaderConfig(K.mix({
	baseRequire: 		KM,
	
	// root path of module files
	base: 				'/js/kael.me/src/',
	
	enableCDN:			false,
	// @return: the domain of either cdn server
	CDNHasher:			CDNHasher,
	
	allowUndefinedMod: 	true
}, window.__loaderConfig));


// you can set current href as http://abc.com/#!/debug/on to switch debug-mode on
var href = K.getLocation().href,
	index_marker = href.indexOf('#!/');
	
index_marker !== -1 && href.indexOf('debug/on') > index_marker && K._debugOn();


})(KM);