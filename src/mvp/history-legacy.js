/**
 * holyfill of html5 history state manager for non-html5-pushState-enabled browsers
 * author  Kael Zhang
 
 * of support with:
 	- back and forward button of browsers
 	- cross browser, even with IE6,7
 	- pushState and replaceState
 	- popstate event
 	- fixed hash history of IE6,7 and old Safari
 
 * ex: 
 * data						html5 browsers					fallback
 
   {page: 7}				/page/7							/!#/page/7
   {a:1, b:[2,3]}			/a/1/b/2_3						/!#/a/1&b/2,3				
   {a:1, b:{c:1,d:2}}		/a/1/b/c1d2						/!#/a/1&b/c=1,d=2
 *
 */
KM.define(['./converter' /* , 'mvp/state' */ ], function(K, require){


var

Converter		= require('./converter'),
// State			= require('mvp/state'),

WIN 			= K.__HOST,
HIS 			= WIN.history,
history_state;

 
/**
 * for old browsers
 * imitate history.pushState and store history data with location.hash
 */
  
var 

UNDEF,
DOC 		= WIN.document,
location 	= WIN.location,

HASH_PREFIX 				= '!',
HASH_IDENTIFIER 			= '#' + HASH_PREFIX,
ID_NEURON_HISTORY_IE 		= '_neuron-history',
ID_NEURON_HISTORY_IFRAME 	= '_neuron-history-iframe',

// 12	-> true
// 1.2	-> true
// 0.2	-> true	
// .12	-> true
// 12.	-> false
REGEX_NUMBER = /^(?:\d*\.)?\d+$/,

/**
 * meta functions
 */
meta = {
	
	// method to generate a containter to store ajax history
	// @return: the containter to restore ajax history 
	_history: {
		
		// @return {Window} the history iframe document for ie
		// the change of location.hash will not be applied to the history stack of IE6-7,
		// so observe the change of location.hash, and imitate it with iframes
		ie: function(){
		
			// every time clicking on the backward and forward button of browsers, 
			// the document of the iframe will change, 
			// we should try to fetch the new one
			function getIframeDocument(){
				return iframe.contentWindow.document;
			};
			
			$.create('div').html('<iframe src="javascript:false;" id="' + ID_NEURON_HISTORY_IFRAME + '"></iframe>').inject(DOC.body)
			
			iframe = DOC.getElementById(ID_NEURON_HISTORY_IFRAME);
			
			var iframeDocument = getIframeDocument();
			
			iframeDocument.open(); 
			iframeDocument.close();
			
			return getIframeDocument;
		}
		
		/*,
		
		safari: function(){
			// restore the original history.length when KM.Handler initializing
			handler.initLength = history.length;
			
			return [];
		}
		*/
	},
	
	
	// set history
	// @private
	_setHistory: {
		ie: function(hash){
			var self = handler,
				doc = self._history();
			
			// actually, we create a new iframe document
			doc.open();
			doc.write('<html><body id="' + ID_NEURON_HISTORY_IE + '">' + hash + '</body></html>');
			doc.close();
			
			// still set top.location hash for ie
			// so that visitors will get links for current status of the page
			self._setHash(hash);
			return self;
		},
		
		/*
		// On Safari 1.x or 2.0, the only way to observe a back/forward operation is to watch history.length
		safari: function(hash){
			var self = handler;
		
			// if history.length - this.initLength < 0, this._history will convert to object type
			//		for most time, this will not happen;
			self._history[history.length - self.initLength + 1] = hash;
			
			self._setHash(hash);
			return self;
		},
		*/
		
		normal: function(hash){
			var self = handler;
		
			self._setHash(hash);
			return self;
		}	
	},
	
	// @private
	// @returns {string}
	_getHistory: {
		ie: function(){
			var elem = handler._history().getElementById(ID_NEURON_HISTORY_IE);
			
			return elem ? elem.innerText : '';	
		},
		
		/*
		safari: function(){
		
			// always returns a string
			return handler._history[history.length - handler.initLength] || false;
		},
		*/
		
		normal: function(){
			return handler._getHash();
		}
	}
},


handler = {
	
	// apply specific method for certain browser.
	// after configuration, we will never concern user agent any more
	// initialization
	_config: function(){
		var conf, self = handler, meta_history;
		
		// options && K.mix(default_options, options);
		
		// is ie && ( version < 8 || (not IE8 standard mode, ie7 or quirks mode) )
		if(K.UA.ie && (DOC.documentMode === UNDEF || DOC.documentMode < 8)){
			conf = 'ie';
		
		// webkit 419 or earlier
		// }else if(K.UA.webkit <= 419){
		//	conf = 'safari';
			
		}else{
			 conf = 'normal';
		}
		
		// conf = 'safari';
		
		// generate history stack for each different browsers
		if(meta_history = meta._history[conf]){
			self._history = meta_history();
		}else{
			delete self._history;
		}
		
		self._setHistory = meta._setHistory[conf];
		self._getHistory = meta._getHistory[conf];
		
		self.conf = conf;
		
		// executed only once
		self._config = function(){};
		
		return self;
	},

	
	/** 
	 * set current hash
	 * @private
	 */
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
	
	/**
	 * polling method
	 * @private
	 */
	_watcher: function(){	
		var self = handler,
		
			// History bug of IE or Safari might to be fixed, 
			// so that maybe someday, 
			// we would not need to use this._getHistory or this._checkHistory method and Handler would still work
			newHash = self._getHash();
		
		// So, check the hash first
		if(newHash !== self.hash){
			self.hash = newHash;
			
		}else if(!self._checkHistory()){
			return;
		}
		
		self.fire('popstate', {state: Converter.toObject(self.hash)});
	},
	
	/** 
	 * @private
	 * @returns {boolean}
	 */
	_checkHistory: function(){
		var self = handler,
			newHistory = self._getHistory(),
			changed = newHistory !== self.hash
				
				// if newHistory === false, the new history is not pushed by mvc/history module
				// for earlier webkit browsers, the corresponding history info. would be unavailable
				&& newHistory !== false;
			
		if(changed){
			self.hash = newHistory;
			
			self._setHash(newHistory);
		}
		
		return changed;
	},

	// begin processsing
	// start method could be only executed once
	start: function(){
		var self = handler,
			hash = self._getHash();
		
		// if(!self.conf) self.config(options);
		self._config();
	
		// set current hash to '', if there's no hash at the beginning
		self._setHistory(hash || '');
		
		if(!hash){
			self.hash = '';
		}
		
		// start watching
		setInterval(function(){
			self._watcher();
		}, 90);
		
		self.fire('start');
		
		return self;
	},
	
	
	/**
	 * @param {string} url url will be no use
	 */
	push: function(data, title, url){
		handler._setHistory(
		
			// set `self.hash`, preventing firing `'popstate'` event
			handler.hash = Converter.toQuery(data)
		);
		
		handler.fire('pushstate', {state: data});
	}
};

return handler;

});


/**
 change log:
 
 2011-11-22  Kael:
 - complete methods to mutually convert from object to query or from query to object
 
 2011-11-18  Kael:
 - refractor and migrate to Neuron
 - mvc/history will no longer register modules
 - mvc/history will only deal with state-related matters
 
 2011-04-26  Kael:
 - refractor several methods, KM.history will tidy Number-type arguments
 
 2011-01-01  Kael Zhang:
 - modulize, optimize scope chain
 - no more dependence on Mootools.Hash
 
 2010-03-03  Kael Zhang: separate methods for cross-browser support, no more detect user agent whenever fetch ajax history
 
 2010-01-20  Kael Zhang: create document, main functionalities
 
 */