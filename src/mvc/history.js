/**
 * Kael.Me history
 * @author  Kael Zhang[i@kael.me]
 *
 * @module  history
 *
 * An enhanced handler for window.history, including:
 * - management for ajax history, location hashes
 * - APIs for new HTML5 pushState and replaceState
 * - batch binders for elements
 */
 
KM.define(function(K, undef){
 
var WIN = K.__HOST,
	DOC = WIN.document,
	location = WIN.location,
	default_options = {
		// method to execute, if hash change to #, 
		noHash: 	null,
		
		// if refresh === true, and !noHash, window will reload
		reload: 	true,
		
		iframeID: 	'km_history-iframe'
	},
	
	HASH_PREFIX = '!/',
	HASH_IDENTIFIER = '#' + HASH_PREFIX,
	
	// 12	-> true
	// 1.2	-> true
	// 0.2	-> true	
	// .12	-> true
	// 12.	-> false
	REGEX_NUMBER = /^(?:\d*\.)?\d+$/,
	
	handler,
	meta;
	
	
handler = {
	
	// stack to store ajax methods
	// @private
	_module: {},
	
	// register modules
	// @param {regular expression|object} match_: a string to match the hash
	//		or the object which contains some sets of these three parameters
	// @param {function} method: method to executed if the regex matched
	
	//		Ajax API for method:	if ajax exists in the method, you can set this ajax request as method.ajax

	// @param {mixed} pointer: the 'this' pointer in the method
	register: function(match_, method){
		var self = this;
		
		self._module[match_] = method;
		
		return self;
	},
	
	// KM.Handler begin processsing
	// start method must executed once and only once
	start: function(options){
		var self = this;
		
		if(!self.conf) self.config(options);
		
		self.hash = self._getHash();
		
		// set current hash to '', if there's no hash at the beginning
		if(!self.hash) self._setHistory('');
		else{
			self._factory(self.hash) && self._setHistory(self.hash);
		}
		
		// start watching
		self._watcher.periodical(100, self);
		
		// self.start will be nothing but return self
		self.start = K.lambda(self);
		
		self.started = true;
		
		return self;
	},
	
	
	// apply specific method for certain browser.
	// after configuration, we will never concern user agent any more
	// initialization
	config: function(options){
		var conf, self = handler;
		
		options && K.mix(default_options, options);
		
		// is ie && ( version < 8 || (not IE8 standard mode, ie7 or quirks mode) )
		if(K.UA.ie && (DOC.documentMode === undef || DOC.documentMode < 8)){
			conf = 'ie';
		
		// webkit 419 or earlier
		}else if(K.UA.webkit <= 419){
			conf = 'safari';
			
		}else{
			 conf = 'normal';
		}
		
		// generate history stack for each different browsers
		self._history = self._history[conf].call(null, self); if(!self._history) delete self._history;
		
		self._setHistory = K.bind(self._setHistory[conf], self);
		self._getHistory = K.bind(self._getHistory[conf], self);
		
		self.conf = conf;
		
		// executed only once
		self.config = K.lambda(self);
		
		return self;
	},

	
	// @private
	_setHash: function(hash){
		location.hash = hash ? HASH_PREFIX + hash : '';
	},
	
	
	// @method: get the current hash, or get the hash from a specific url
	// @private
	
	// Use location.href instead of location.hash which is already
    // URL-decoded, which creates problems if the state value
    // contained special characters...
	//		----- YUI 2.8.1
	_getHash: function(url) {
		url = url || K.getLocation().href;
		
		var index = url.indexOf(HASH_IDENTIFIER);
		
        return index >= 0 ? url.substr(index + HASH_IDENTIFIER.length) : '';
    },
	
	
	// @private
	_watcher: function(){
		// History bug of IE or Safari might to be fixed, 
		// so that maybe someday, we would not need to use this._getHistory method and KM.Handler would still work
		var newHash = this._getHash();
		
		// So, check the hash first
		if(newHash !== this.hash
		|| 
			( (newHash = this._getHistory()) || true ) 
		&& 
			newHash !== this.hash
		){
			this.hash = newHash;
			
			// only if the current hash matched one of the modules, that we save it into KM.Handler._history
			return this._factory(newHash) && this._setHistory(newHash);
		}	
	},
	
	
	// apply hash with defined module
	// @private
	// @param {string} hash: location.hash with the format as:
	
	// @example:
	//    1. hash == 'module/param1=123,param2=234' 	-> arg = {param1:123, param2: 234};
	//    2. hash == 'module/123' 						-> arg = 123;
	//    todo: 
	//    3. hash == 'module/123,234,345' 				-> arg = [123, 234, 345];
	_factory: function(hash){
		if(hash){
			var index = hash.indexOf('/'),
				arg, 
				module,
				self = this;
				
			if(index !== -1){
				
				// convert query string to object
				arg = queryStringToArguments(hash.substr(index + 1));
				hash = hash.substr(0, index);
			}
			
			module = self._module[hash];
			
			if(module){
				
				// Ajax API, if the latter ajax request is processing, cancel it
				// @example module_function = function(){
				//		arguments.callee.ajax = new Request({...}).send();	
				//	}
				self.latterModule && self.latterModule.ajax && self.latterModule.ajax.cancel();
				
				self.latterModule = module;
				
				module.apply(null, arg);
				
				return true;
			}
			
		// deal with no hash, this may be triggered by history back
		}else{
			
			var option = default_options;
			
			if(K.isFunction(option.noHash)){
				option.noHash();
			}else if(option.reload){
				location.assign(K.getLocation().pathname);
			}
		}
		
		return;
	}
};



meta = {
	// method to convert normal hyperLinks to ajax event triggers
	// this is 
	
	// @param {MT selector} selector: mootools Kelectors, work with $$
	// @param {boolean} live whether use live event
	
	// method to generate a containter to restore ajax history
	// @return: the containter to restore ajax history 
	_history: {
		
		// @return: the history iframe document for ie
		ie: function(){
			var iframe = default_options.iframeID,
			
				// every time clicking on the backward and forward button, 
				// the document of the iframe will change, 
				// we should try to fetch the new one 
				getIframeDocument = function(){
					return iframe.contentWindow.document;
				},
				
				iframeDocument;
				
			delete default_options.iframeID;
			
			new Element('div', {
				styles: KM._style.ZERO_PANEL,
				
				// dont't use mootools method to create iframe in order to prevent potential problems
				html: '<iframe src="javascript:false;" id="' + iframe + '"></iframe>'
				
			}).inject(DOC.body);
			
			iframe = $(iframe);
			
			iframeDocument = getIframeDocument();
			
			iframeDocument.open(); 
			iframeDocument.close();
			
			return getIframeDocument;
		},
		
		safari: function(){
			// restore the original history.length when KM.Handler initializing
			this.initLength = history.length;
			
			return [];
		},
		
		normal: K.lambda(false)
	},
	
	
	// set history
	// @private
	_setHistory: {
		ie: function(hash){
			var self = handler,
				DOC = self._history();
			
			// actually, we create a new iframe document
			DOC.open();
			
			DOC.write('<html><body id="J_ajax-history">' + hash + '</body></html>');
			
			DOC.close();
			
			// still set top.location hash for ie
			// so that visitors will get links for current status of the page
			self._setHash(hash);
			return self;
		},
		
		// On Safari 1.x or 2.0, the only way to observe a back/forward operation is to watch history.length
		safari: function(hash){
			var self = handler;
		
			// if history.length - this.initLength < 0, this._history will convert to object type
			//		for most time, this will not happen;
			self._history[history.length - self.initLength] = hash;
			
			self._setHash(hash);
			return self;
		},
		
		normal: function(hash){
			var self = handler;
		
			self._setHash(hash);
			return self;
		}	
	},
	
	// @private
	_getHistory: {
		ie: function(){
			var elem = handler._history().getElementById('J_ajax-history');
			
			return elem ? elem.innerText : '';	
		},
		
		safari: function(){
			return handler._history[history.length - this.initLength];
		},
		
		normal: function(){
			return handler._getHash();
		}
	}
};



/**
 * tools
 * ------------------------------------------------------------------- */


// 1. '123' 					-> [ 123 ];
// 2. '123,234,345' 			-> [ 123, 234, 345 ];
// 3. 'param1=123,param2=234' 	-> [ { param1:123, param2: 234} ];
function queryStringToArguments(query){
	var ret,
		args,
		SPLITTER_OBJECT_KEY_VALUE = '=';
	
	query = String(query);
	
	if(query || query === ''){
		args = _splitNClean(query);
		
		// 1, 2
		if( query.indexOf(SPLITTER_OBJECT_KEY_VALUE) == -1){
			ret = args;
		
		// 2
		}else{
			ret = {};
			
			args.forEach(function(i){
				i = i.split(SPLITTER_OBJECT_KEY_VALUE);
				
				if(i.length === 2 && i[0]){
					ret[i[0]] = i[1];
				}
			});
			
			ret = [ret];
		}
	}else{
		ret = [];
	}
	
	return ret;
};

/**
 * split a string into an array and trim every item
 * convert string of numbers to Numbers
 */
function _splitNClean(string){
	var ret = [];

	string.split(',').forEach(function(s){
		s = s.trim();
		
		(s || s === '') && ret.push(REGEX_NUMBER.test(s) ? Number(s) : s);
	});
	
	return ret;
};



K._overloadSetter('register', handler);

return {
	register: 	handler.register,
	start:		handler.start,
	push:		handler.push,
	
};

});

/**
 change log:
 
 2011-11-18  Kael:
 
 
 2011-04-28  Kael:
 TODO
 A. support pushState and replaceState
 
 2011-04-26  Kael:
 - refractor several methods, KM.history will tidy Number-type arguments
 
 2011-01-01  Kael Zhang:
 - modulize, optimize scope chain
 - no more dependence on Mootools.Hash
 
 2010-03-03  Kael Zhang: separate methods for cross-browser support, no more detect user agent whenever fetch ajax history
 
 2010-01-20  Kael Zhang: create document, main functionalities
 
 */