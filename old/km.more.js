/*! ------------------------------------------------------------ *\
 * Kael.Me.more.js - register public methods
 * @author	Kael Zhang
 * @build	20100706 22:49
\* ------------------------------------------------------------- */

/**
 *	Rules: (esp. for mootools)
 *		1. never implement Object
 */


/**
 * initialize data for certain page, and apply settings from cookie
 */
KM.page = {
	query: {
		id: 1
	},
	
	cookie: {},
	
	setting: {},
	
	// @param {object} query: params which ajax request needed
	// @param {object} setting: options, will be overrided by user cookie
	init: function(cookie, query, setting){
		KM.cookie = $extend(this.cookie, cookie);
		KM.query = $extend(this.query, query);
		KM.setting = $extend(this.setting, setting);
		
		KM.loading.init({
			top: '#top-toggle',
			comment: '#comForm'
		});
		
		delete this.cookie;
		delete this.query;
		delete this.setting;
	}
};


/**
 * Kael.Me Cookie
 * encapsulation for cookies
 */
KM.Cookie = {
};


/**
 * management for loading gif animation
 */
KM.loading = {
	dom: {},
	init: function(setting){
		var dom;
		
		for(var key in setting){
			dom = $j(setting[key] + ' .loading');
			if(dom) this.dom[key] = dom;
		}
	},
	
	show: function(where){
		this.dom[where] && this.dom[where].show();
	},
	
	hide: function(where){
		this.dom[where] && this.dom[where].hide();
	}
};


KM._style = {
	HIDDEN_PANEL: {
		position: 'absolute',
		visibility: 'hidden'
	},
	
	ZERO_PANEL: {
		width: 1,
		height: 1,
		position: 'absolute',
		visibility: 'hidden',
		left: 0,
		top: 0
	},
	
	ZERO: {
		width: 0,
		height: 0,
		overflow: 'none'
	},
	
	OVERLAY: {
		position: 'absolute',
		left: 0,
		top: 0,
		width: '100%',
		height: '100%'
	}
	
};


/**
 * Kael.Me Bind:
 * abstract CLASS, will bind class method which begins with '_'(underscore)
 
 * @constructor
 * @interface
 * @abstract
 */
KM.Bind = new Class({
	setBind: function(){
		for(var method in this){
			if((/^_/).test(method)){
				this[method.substr(1)] = this[method].bind(this);
				delete this[method];
			}
		}
		return this;
	}
});



/**
 * Show the tip panels 
 * @constructor
 * @require: KM.Element.implement.exactPosition
 * @implement: KM.Bind
 */
KM.Tip = new Class({
	Implements: [Options, KM.Bind],
	options: {
		adjust: {
			x: 'TRIGGER+10', // for x, we can use 'TIP' for the width of the tip element, 'TRIGGER' for trigger's width
			y: 10 // similarly for y
		},
		
		openEvent: 'mouseenter',
		closeEvent: 'mouseleave',
		
		
		// whether check positioning
		fitScreen: true,	
		// whether check the position after the first positioning
		alwaysCheck: false,
		
		// minimun z-index
		zIndex: 200
		
	},
	
	initialize: function(trigger, tip, options){
		this.setOptions(options).setBind();
		
		trigger = $(trigger);
		tip = $(tip);
		
		if(!trigger || !tip) return delete this.options;
		
		this.trigger = trigger;
		this.tip = tip.setStyles(KM._style.HIDDEN_PANEL).inject(document.body);
		
		var trigger_zIndex = this.trigger.getStyle('zIndex');
		
		if(!trigger_zIndex || trigger_zIndex === 'auto') trigger_zIndex = this.options.zIndex;
		else trigger_zIndex ++;

		
		this.tip.setStyle('zIndex', trigger_zIndex);
		
		this.bind();
	},
	
	bind: function(){
		this.trigger.addEvent(this.options.openEvent, this.open);
		this.trigger.addEvent(this.options.closeEvent, this.close);

		if(this.options.alwaysCheck){
			var self = this;
				reset_settled = function(){
					self.settled = false;
				};
			
			window.addEvents({
				'resize': reset_settled,
				'scroll': reset_settled
			});
		}
	},
	
	getAdjust: function(){
		
		// cache the result
		if(!this.adjust){
			var aj = this.options.adjust,
				size = this.getSize(),
				
				// replace the 'TRIGGER' and 'TIP' to real number
				positive_decode = function(query, axis){
					return KM.string.multiCheck(query, ['TIP', 'TRIGGER'], [size.tip[axis], size.trigger[axis]]);
				},
				
				negative_decode = function(query, axis){
					return KM.string.multiCheck(query, ['TRIGGER', 'TIP'], [size.tip[axis], size.trigger[axis]]);
				},
				
				// calculate the value of options.adjust.x(/y)
				positive_result = function(value, axis){
					return $type(value) === 'number' ? value : positive_decode(value, axis).sum() + value.toNum();
				},
				
				negative_result = function(value, axis){
					return - ($type(value) === 'number' ? value : negative_decode(value, axis).sum() + value.toNum());
				};
				
				
			this.adjust = {
				
				// if positive adjust makes the tip out of the current, it will check the negative adjust
				// if the latter is better, adjust.neg will be chosen,
				// otherwise, we use adjust.pos however
				pos: {
					x: positive_result(aj.x, 'x'),
					y: positive_result(aj.y, 'y')
				},
				
				neg: {
					x: negative_result(aj.x, 'x'),
					y: negative_result(aj.y, 'y')
				}
			}
		}
		
		return this.adjust;
		
	},
	
	getSize: function(){
		
		// cache the result
		if(!this.size){
			this.size = {
				trigger: this.trigger.getSize(),
				tip: this.tip.getSize()
			}
		}
		
		return this.size;
	},
	
	position: function(){
		var trigger_position = this.trigger.exactPosition(),
			adjust = this.getAdjust(),
			size = this.getSize(),
			window_size = document.getSize(),
			
			// temp parameter
			relative_position = document.getScroll(),
			
			final_position,
			final_class,
			remove_class,
			check;
			
		relative_position = {
			x: trigger_position.x - relative_position.x,
			y: trigger_position.y - relative_position.y
		};
			
		check = function(adjust_module){
			var final = {
				x: relative_position.x + adjust_module.x,
				y: relative_position.y + adjust_module.y
			}
			
			return [
				final.x < 0, 
				final.y < 0, 
				final.x + size.tip.x > window_size.x,
				final.y + size.tip.y > window_size.y
				
			].map(function(item_){
				return item_ ? 0 : 1;					
			}).sum();
		};
		
		// check, adjust.x and adjust.y, which is better?
		final_position = check(adjust.pos);
		
		if(this.options.fitScreen && final_position < 4 && check(adjust.neg) > final_position){
			final_position = adjust.neg;
			final_class = 'J_list-tip-neg';
			remove_class = 'J_list-tip-pos';
			
		}else{
			final_position = adjust.pos;
			final_class = 'J_list-tip-pos';
			remove_class = 'J_list-tip-neg';
		}
		
			
		this.tip.setStyles({
			left: final_position.x + trigger_position.x,
			top: final_position.y + trigger_position.y
		})
		.addClass(final_class)
		.removeClass(remove_class);
		
		this.settled = true;
	
	},
	
	_open: function(){
		this.tip.setStyle('visibility', 'visible');
		
		!this.settled && this.position();
		
		return this;
	},
	
	_close: function(){
		this.tip.setStyle('visibility', 'hidden');
		
		return this;
	}
});


KM.Tip.extend({
	
	// for bulk initialization
	assign: function(trigger, tip, options){
		trigger = $$(trigger);
		tip = $$(tip);
		
		for(var i = 0, len = trigger.length; i < len; i ++){
			new KM.Tip(trigger[i], tip[i], options);
		}
	}
});


/**
 * Kael.Me Global Event Handler
 * manage global event, and record current version
 */
KM.globalEvent = (function(){
	var version = {};
	
	return {
		register: function(type){
			// var ver;
			
			if($type(type) !== 'string' || version[type]) return;
			
			version[type] = 1;
			
			window.addEvent(type, function(){
				++ version[type];
			});	
		},
	
		reset: function(type){
			if($type(type) !== 'string') return;
			
			delete version[type];
		},
		
		ver: function(type){
			return version[type];
		}
	}
	
})();


/**
 * Kael.Me popup method
 * @require KM.globalEvent;
 */
KM.popup = {
	init: function(){
		this.panel = new Element('div', {'class': 'J_list-pop'}).inject(document.body);
		
		this.applyCont = this.applyCont.bind(this);
		
		var self = this,
			panelFx = new Fx.Morph(this.panel, {duration: 200, onComplete: this.applyCont, transition: Fx.Transitions.Cubic.easeOut});
		
		this.fx = {
			start: function(panelDes, imgDes){
				self.imgFx.start(imgDes);
				panelFx.start(panelDes);	
			},
			
			cancel: function(){
				self.imgFx.cancel();
				panelFx.cancel();
			}
		}
		
		this.show = this.show.bind(this);
		this.hide = this.hide.bind(this);
		
		KM.globalEvent.register('resize');
		
		return this;
	},
	
	getData: function(ele){
		var ret = ele.retrieve('J_popup-data'),
			global_version = KM.globalEvent.ver('resize');
		
		if(!ret || global_version && ele.retrieve('J_resize-ver') !== global_version){
			var cont = ele.getElement('.list-cont'),
				img = ele.getElement('.list-title');
				
			ret = {
				// content
				c	: cont,
				
				// image
				i	: img,
				
				// element coordinates
				ec	: ele.exactCoordinates(),
				
				// element css width
				ew	: ele.getStyle('width').toInt(),
				
				// element css height
				eh	: ele.getStyle('height').toInt(),
				
				// image css height
				ih	: img.getStyle('height').toInt(),
				
				// content offset height
				ch	: cont.getSize().y,
				
				// image fx
				fx	: new Fx.Tween(img, {property: 'height', duration: 200, transition: Fx.Transitions.Cubic.easeOut})
			}
			
			ele.store('J_popup-data', ret);
			ele.store('J_resize-ver', global_version);
		}
		
		return ret;
	},
	
	show: function(ele){
		if(this.shown) this.hide();
		
		this.shown = true;
		
		// get data sprite
		var s = this.getData(ele),
			extra,
			scroll_y = window.getScroll().y,
			win_height = window.getSize().y;
		
		this.ele = ele;
		this.cont = s.c;
		this.img = s.i;
		this.imgFx = s.fx;
		
		this.panel.setStyles({
			top: s.ec.top,
			left: s.ec.left,
			visibility: 'visible'
		});
		
		s.i.setStyle('height', s.ih).inject(this.panel);
		
		// top extra
		// there will be 10px padding inside the window for so that to keep it nice
		extra = scroll_y + 20 - s.ec.top; // scroll_y - 5 - ( ele_coor.top - 15 )
		
		if(extra > 0){
			this.fx.start({top: scroll_y + 5, left: s.ec.left - 15, minHeight: s.ch + cont_height, width: s.ew + 30}, s.ih + 10);
		}else{
			
			// ele_coor.bottom + cont_height + 10(img go 10px higher) - 15(panel go upward 10px) - (scroll_y + win_height - 5)			
			extra = s.ec.bottom + s.ch - scroll_y - win_height; 
			if(extra > 0){
				extra = s.ec.top - extra;
			}else{
				extra = s.ec.top
			}
			
			this.fx.start({top: extra - 15, left: s.ec.left - 15, minHeight: s.eh + s.ch, width: s.ew + 30}, s.ih + 10);
			
		}
	
	},
	
	hide: function(){
		// set default style
		this.panel.setStyles({
			'visibility': 'hidden',
			'width': '',
			'height': ''
		});
		
		this.img.inject(this.ele).setStyle('height', '');
		this.cont.inject(this.ele);
		
		this.fx.cancel();
		
		this.shown = false;
	},
	
	applyCont: function(){
		this.cont.inject(this.panel);
		// this.panel.removeEvents();
	},
	
	// @param {DOM Selector} selector
	// @param {boolean} live whether use live Event
	assign: function(selector, live){
		var self = this;
		
		if(live){
			
			KM.live(selector, 'mouseenter', function(e, ele){
				self.show(ele);
			});	
		}else{
			selector = $$(selector);
			
			selector.each(function(ele){
				var _t = self;
								   
				ele.addEvent('mouseenter', function(){
					_t.show(ele);
				});
				
				_t.getData(ele);
			});
		}
		
		
		this.panel.addEvent('mouseleave', function(){
			self.hide();
		});
	}
}


// @return current root url excluding location.hash
KM.urlRoot = function(){
	var l = location;
	return [l.protocol, '//', l.host, l.pathname, l.search].join('');
}



/**
 * Kael.Me Ajax Handler
 * management for ajax history, location hashes, function register
 
 * @require KM.string.queryConvert
 */
KM.handler = {
	
	options: {
		// method to execute, if hash change to #, 
		noHash: null,
		
		// if refresh === true, and !noHash, window will reload
		reload: true,
		
		iframeID: 'J_history-iframe'
	},
	
	// stack to store ajax methods
	// @private
	_module: new Hash(),
	
	// register modules
	// @param {regular expression|object} match_: a string to match the hash
	//		or the object which contains some sets of these three parameters
	// @param {function} method: method to executed if the regex matched
	
	//		Ajax API for method:	if ajax exists in the method, you can set this ajax request as method.ajax

	// @param {mixed} pointer: the 'this' pointer in the method
	register: function(match_, method, pointer){
		if($type(match_) === 'object'){
			for(var key in match_){
				arguments.callee(key, match_[key].method, match_[key].pointer);
			}	
		}else{
			this._module.set(match_, method.bind(pointer) );
		}
		
		return this;
	},
	
	// KM.Handler begin processsing
	// start method must executed once and only once
	start: function(options){
		if(!this.conf) this.config(options);
		
		this.hash = this._getHash();
		
		// set current hash to '#', if there's no hash at the beginning
		if(!this.hash) this._setHistory('');
		else{
			this._factory(this.hash) && this._setHistory(this.hash);
		}
		
		// start watching
		this._watcher.periodical(100, this);
		
		// this.start will be nothing but return this
		this.start = $lambda(this);
		
		this.started = true;
		
		return this;
	},
	
	
	// apply specific method for certain browser
	// initialization
	config: function(options){		
		this.options = $extend(this.options, options || {});
		
		var conf;
		
		// is ie && ( version < 8 || (not IE8 standard mode, ie7 or quirks mode) )
		if(Browser.Engine.trident && (typeof document.documentMode === 'undefined' || document.documentMode < 8)){
			conf = 'ie';
		
		// webkit 419 or earlier
		}else if(Browser.Engine.webkit === 419){
			conf = 'safari';
			
		}else{
			 conf = 'normal';
		}
		
		// generate history stack for each different browsers
		this._history = this._history[conf].run(null, this); if(!this._history) delete this._history;
		
		this._setHistory = this._setHistory[conf].bind(this);
		this._getHistory = this._getHistory[conf].bind(this);
		
		this.conf = conf;
		
		// executed only once
		this.config = $lambda(this);
		
		return this;
	},
	
	// method to convert normal hyperLinks to ajax event triggers
	// this is 
	
	// @param {MT selector} selector: mootools Selectors, work with $$
	// @param {boolean} live whether use live event
//	bind: function(selector, live){
//		if(live){
//		}
//	},
	
	// method to generate a containter to restore ajax history
	// @return: the containter to restore ajax history 
	_history: {
		
		// @return: the history iframe document for ie
		ie: function(){
			var iframe = this.options.iframeID,
			
				// every time clicking on the backward and forward button, 
				// the document of the iframe will change, 
				// we should try to fetch the new one 
				getIframeDocument = function(){
					return iframe.contentWindow.document;
				},
				
				iframeDocument;
				
			delete this.options.iframeID;
			
			new Element('div', {
				styles: KM._style.ZERO_PANEL,
				
				// dont't use mootools method to create iframe in order to prevent potential problems
				html: '<iframe src="javascript:false;" id="' + iframe + '"></iframe>'
				
			}).inject(document.body);
			
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
		
		normal: $lambda(false)
	},
	
	// set history
	// @private
	_setHistory: {
		ie: function(hash){
			var doc = this._history();
			
			// actually, we create a new iframe document
			doc.open();
			
			doc.write('<html><body id="J_ajax-history">' + hash + '</body></html>');
			
			doc.close();
			
			// still set top.location hash for ie
			// so that visitors will get links for current status of the page
			window.location.hash = hash;
			return this;
		},
		
		// On Safari 1.x or 2.0, the only way to observe a back/forward operation is to watch history.length
		safari: function(hash){
			// if history.length - this.initLength < 0, this._history will convert to object type
			//		for most time, this will not happen;
			this._history[history.length - this.initLength] = hash;
			
			window.location.hash = hash;
			return this;
		},
		
		normal: function(hash){
			window.location.hash = hash;
			return this;
		}
		
	},
	
	// @private
	_getHistory: {
		ie: function(){
			
			var elem = this._history().getElementById('J_ajax-history');
			
			return elem ? elem.innerText : '';	
		},
		
		safari: function(){
			return this._history[history.length - this.initLength];
		},
		
		normal: function(){
			return this._getHash();
		}
	},
	
	
	// @method: get the current hash, or get the hash from a specific url
	// @private
	
	// Use location.href instead of location.hash which is already
    // URL-decoded, which creates problems if the state value
    // contained special characters...
	//		----- YUI 2.8.1
	_getHash: function(url) {
		url = url || window.location.href;
		
		var index = url.indexOf('#');
		
        return index >= 0 ? url.substr(index + 1) : '';
    },
	
	
	// @private
	_watcher: function(){
		// History bug of IE or Safari might to be fixed, 
		// so that maybe someday, we would not need to use this._getHistory method and KM.Handler would still work
		var newHash = this._getHash();
		
		// So, check the hash first
		if(newHash !== this.hash || 
			((newHash = this._getHistory()) || true) && newHash !== this.hash 
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
	//    1. hash == 'module/param=123&param2=234' -> arg = {param:123, param2: 234};
	//    2. hash == 'module/123' -> arg = 123;
	_factory: function(hash){
		if(hash){
			var index = hash.indexOf('/'),
				arg, 
				module;
				
			if(index !== -1){
				
				// convert query string to object
				arg = KM.string.queryConvert(hash.substr(index + 1));
				hash = hash.substr(0, index);
			}
			
			module = this._module.get(hash);
			
			if(module){
				
				// Ajax API, if the latter ajax request is processing, cancel it
				// @example module_function = function(){
				//		arguments.callee.ajax = new Request({...}).send();	
				//	}
				this.latterModule && this.latterModule.ajax && this.latterModule.ajax.cancel();
				
				this.latterModule = module;
				
				arg ? module(arg) : module();
				return true;
			}
			
		// deal with no hash, this may be triggered by history back
		}else{
			
			var option = this.options;
			
			if($type(option.noHash) === 'function'){
				option.noHash();
			}else if(option.reload){
				location.href = KM.urlRoot();
			}
		}
		
		return;
	}
};


/**
 * package for Request.JSON, with timeout, and optimized error event for Json
 */
KM.Request = new Class({
	Implements: [Options, Events],
	
	options: {
		url: null,
		method: 'post',  // default to 'post'
		data: null,
		headers: {},
		
		timeout: 30000,
		
		onRequest: $empty,
		onSuccess: $empty,
		onError: $empty

	},
	
	// @param {object} options: Mootools.Request options
	initialize: function(options) {
		this.setOptions(options);
		
		// options exclude:
		//		async, always be true;
		//		evalScripts, always be false;
		//
		var _options = {
			url: this.options.url,
			method: this.options.method,
			data: this.options.data,
			headers: this.options.headers
		};
		
		_options.onRequest = this.request.bind(this);
		_options.onSuccess = this.success.bind(this);
		_options.onFailure = _options.onException = _options.onCancel = this.error.bind(this);

		return this.create(_options);
	},
	
	create: function(options){
		this.ajax = new Request.JSON(options);
		this.ajax.headers.extend({ 'Accept': 'application/json, */*' });
		
		return this;
	},
	
	error: function() {
		$clear(this.timer);
		this.fireEvent('error');
		return this;
	},
	
	success: function(responseJSON, responseText) {
		$clear(this.timer);
		
		// if this.options.onSuccess != $empty;
		if (this.$events.success) {
			
			// package responseJSON for Kael.Me
			// make sure that responseJSON will never be empty, if 'success' event fired
			if(!responseJSON || responseJSON.code && responseJSON.code > 299){
				this.fireEvent('error');
			}else{
				this.fireEvent('success', [responseJSON, responseText]);
			}
		}

		return this;
	},
	
	request: function() {
		this.fireEvent('request');
		return this;
	},
	
	send: function(options) {
		this.timer = setTimeout(function() { this.ajax.cancel(); } .bind(this), this.options.timeout);
		this.ajax.send(options);
	}
});


/** 
 * Kael.Me live event
 * modified from mootools live event, and optimized performance
 
 * KM.live
 * KM.die
 */
(function(kael_me_namespace) {
	var _guid = 1,
		_fns = {},
		
		_liveHandler = function(event) {
			var eventTarget = $(event.target), 
				type = event.type,
				
				fns = _fns[type],
				fn,
				
				matchedElements = [],
				stop = true,
				
				len,
				
				i = 0,
				
				elem,
				
				closest = _closest,
				
				closestElement;
				
			// Make sure we avoid non-left-click bubbling in Firefox (#3861) --- jQuery
			if (!fns || !fns.length || event.liveFired === this || event.rightClick ) {
				return;
			}

			event.liveFired = this;
			
			// live event will be triggered a lot,
			// for performance, use for loop instead of mootools each method
			for(len = fns.length; i < len; i ++){
				fn = fns[i];
				
				closestElement = closest(fn.selector, eventTarget);

				if (closestElement && 
					
					// 'mouseenter' and 'mouseleave' require additional checking
					!(
						fn._related && 
						
						// $$(if fn.selector) contains relatedTarget, current event is not 'mouseenter' or 'mouseleave'
						closest(closestElement, event.relatedTarget) 
					)
				
				){
					matchedElements.push({
						elem: closestElement.elem,
						order: closestElement.distance,
						
						target: eventTarget,
						fn: fn
						 
					});
				}
				
			}
			
			len = matchedElements.length;
	
			if (len) {
				
				// sort the functions, so that they will be executed by bubble order
				matchedElements.sort(function(a, b) {
					return a.order - b.order;
				});
				
				for(i = 0; i < len; i ++){
					elem = matchedElements[i];
					
					// fireEvents
					// if there's one method returned false, stop live event <type>
					if (elem.fn(event, elem.elem) === false){
						stop = false;
					}
				}
			}
			
			return stop;
		},
		
		
		// @param {DOM selector || DOM element} selector
		// @param {DOM element} element
		
		// @return {
		//		elem: the first ancestor element that matches the selector
		//		distance: the DOM distance between elem and the element
		// }		
		
		// or false if no match found
		_closest = function(selector, element) {
			if(!element) return;
			
			var parents = $$(selector), 
			
				currentElement = element, 
				
				distance = 0;
			
			if (!parents.length) return;
	
			while (currentElement && !_isBody(currentElement)) {
				
				if (parents.contains(currentElement)) {
					return {distance: distance, elem: currentElement};
				}
				
				currentElement = currentElement.getParent();
				
				++ distance;
			}

			return;
		},

		_isBody = function(element) {
			return (/^(?:body|html)$/i).test(element.tagName);
		};
		
		// @param {string} selector selector of live event must be string
		// @param {string} type
		_addLiveEvent = function(selector, type, fn) {
			// $$(selector).length may be 0, the elements which match the selector might not be inserted into DOM yet
			if($type(selector) !== 'string') return;
			
			var fns,
				
				// so that, we won't add 'selector' in fn
				fn_wrap = function() { return fn.apply(this, arguments) },
				
				len,
				
				saved_fn,
				
				passed = true;
				
			if(type === 'mouseenter'){
				fn_wrap._related = true;
				type = 'mouseover';
				
			}else if(type === 'mouseleave'){
				fn_wrap._related = true;
				type = 'mouseout';
			}
			
			// save different type seperately, save time
			fns = _fns[type] || ( _fns[type] = [] );
			
			len = fns.length;
				
			fn_wrap.guid = fn.guid = fn.guid || _guid ++;
			
			fn_wrap.selector = selector;
			
			if(len){
				
				// we have judged len at 'if' just now, do first
				do{
					saved_fn = fns[--len];
					
					// rules: NEVER let user bind 'mouseover' and 'mouseenter' to one same element simultaneously
					// the same to 'mouseout' and 'mouseleave'
					if(saved_fn.guid === fn_wrap.guid || saved_fn.selector === fn_wrap.selector){
						passed = false;
						
						// break, and save time
						break;
					}
					
				}while(len);
				
				passed && fns.push(fn_wrap);

			}else{
				fns.push(fn_wrap);
			}
			
			document.addEvent(type, _liveHandler);
		},
		
		_removeLiveEvent =  function(selector, type, fn) {
			if($type(selector) !== 'string') return;
			
			var fns = _fns[type];
			
			if (!fns || !fns.length) return;
			
			_fns = fns.filter(function(_func) {
				return !(_func.selector === selector && (fn ? _func.guid === fn.guid : true));
			});
		};
		
	kael_me_namespace.live = _addLiveEvent;
	kael_me_namespace.die = _removeLiveEvent;
		
})(KM);


/**
 * Kael.Me Overlay
 * method to create a overlay with specified coordinates, or just fit a certain element
 * @constructor
 * @require: KM.Bind
 */
KM.Overlay = new Class({
					   
	Implements: Options,
	
	options: {
		className: 'J_overlay',
		type: 'div',
		opacity: .7,
		zIndex: 900
	},
	
	// @param {DOM selector || DOM element || object} coordinates
	initialize: function(coordinates, options){
		if($type(coordinates) === 'string' || $type(coordinates) === 'element'){
			coordinates = $(coordinates);
			if(!coordinates) return;
			
			this.getCoor = function(){
				return coordinates.exactCoordinates();
			}
			
		}else{
			this.getCoor = $type(coordinates) === 'object' ? 
				function(){ return coordinates; }
			:
				function(){ return {width: '100%', height: '100%'} }
		}
		
		
		this.setOptions(options);
	},
	
	hide: function(){
		this.element.setStyle('visibility', 'hidden');
	},
	
	show: function(){
		var options = this.options;
		
		if(this.element){
			this.element.setStyles($extend( {position:'absolute', opacity: options.opacity, zIndex: options.zIndex }, this.getCoor() )).setStyle('visibility', 'visible');
		}else{

			this.element = new Element(options.type, {
				'class': options.className, 
				styles: $extend( {position:'absolute', opacity: options.opacity, zIndex: options.zIndex }, this.getCoor() )
			}).inject(document.body);
		}
	},
	
	destroy: function(){
		this.element.destroy();
		delete this.element;
	}
	
	
});


/**
 * Kael.Me Hover and Slide Ctrl
 * @constructor
 * @require: KM.Bind
 */
KM.HoverSlide = new Class({
	Implements: [Options, KM.Bind],

	options:{
//		oc: openCtrl,
		oe: 'mouseenter',
//		cc: closeCtrl,
		ce: 'mouseleave',
//		
//		ds: des,
//		di: direction,
//		io: initOffset,

		ac: 'hover',	// activeClass,
		po: 0,			// positive,
		of: 0,			// offset,
		ao: false,		// open automatically
		fx:{
			duration: 300,	// animation duration
			link: 'cancel'	// will cancel the precedence fx, and start a new one
			// fps: 50,
			// transition: Fx.Transitions.Sine.easeOut
		}
	},

	initialize: function( options ){
		this.setBind().setOptions( options );
		
		var _options = this.options;
		
		// oc and cc default to ds
		_options.oc = _options.oc || _options.ds;
		_options.cc = _options.cc || _options.ds;
		
		_options.oc = $j( _options.oc );
		_options.cc = $j( _options.cc );
		_options.ds = $j( _options.ds ).show();
		
		this.init();
		this.bind();
		
		if( _options.ao ) this.open();
		
		this.destroy();
	},
	
	init: function(){
		var _options = this.options;
		
		if( _options.di === 'left' || _options.di === 'right' ) 
			var journey = _options.po * _options.ds.getStyle('width').toInt();
		else var journey = _options.po * _options.ds.getStyle('height').toInt();
		
		_options.of = _options.of + journey;
		
		this.onSlide = false;
		this.toOpen = true;
		this.diff = _options.oc !== _options.cc;
		
		_options.fx.property = _options.di;
//		this.options.fx.onComplete = function(){
//			this.toOpen ? this.options.oc.removeClass( this.options.ac ) : this.options.oc.addClass( this.options.ac );
//			if( this.diff )
//				this.toOpen ? this.options.cc.removeClass( this.options.ac ) : this.options.cc.addClass( this.options.ac );
//				
//		}.bind(this);

		this.effect = new Fx.Tween( this.options.ds, this.options.fx);
	},
	
	bind: function(){
		var _options = this.options;
		
		_options.oc.addEvent( _options.oe, this.open );
		_options.cc.addEvent( _options.ce, this.close );
	},
	
	// clean
	destroy: function(){
		var _options = this.options;
		
		delete _options.fx;
		delete _options.ao;
		delete _options.di;
		delete _options.oe;
		delete _options.ce;
		delete this.destroy;
	},
	
	dealClass: function(){
		var _options = this.options;
		
		this.toOpen ? _options.oc.removeClass( _options.ac ) : _options.oc.addClass( _options.ac );
		if( this.diff )
			this.toOpen ? _options.cc.removeClass( _options.ac ) : _options.cc.addClass( _options.ac );
	},
	
	// @param {event} e: DOM event, to determine whether it's triggered by user action or programming
	// @param {boolean} noFx: whether not to use animation. use animation by default
	_open: function( e, noFx ){
		var _options = this.options;
		
		if( !(e && this.stop) && this.toOpen){
			this.toOpen = false;

			//a public flag to show the status whether by manual or by program
			if( e ) this.manual = 'open';
			if( _options.ds.isHidden() ) _options.ds.show();
			
			this.effect.cancel();
			
			if(noFx){
				this.effect.set(_options.of);
				// this.effect.onComplete();
			}else this.effect.start(_options.of);
			
			this.dealClass();
		}
		return this;
	},
	
	_close: function( e, noFx ){
		var _options = this.options;
		
		if( !(e && this.stop) && !this.toOpen){
			this.toOpen = true;
			if( e ) this.manual = 'close';
			
			this.effect.cancel();
			 
			if(noFx){ 
				this.effect.set(_options.io);
				this.effect.onComplete();
			}else this.effect.start(_options.io);
			
			this.dealClass();
		}
		return this;
	},
	
	_resume: function(){
		this.stop = false;
		return this;
	},
	
	_cancel: function(){
		this.stop = true;
		return this;
	}
});


/**
 * Kael.Me multi-event handler
 * deal with a event which has several triggers and several conponent triggers to stop it
 
	@param {function} startMethod
	@param {function} cancelMethod
	@param {object} startMethod
	[{
		ele: element1, 
		ev: event1
	 },
	 
	 {}, {}, ...
	]
 */
KM.multiEvent =	function(startMethod, cancelMethod, startModule, cancelModule, options){
	var _options = $extend({delay: 200, prevent:false}, options || {}),
		timer,
		stopped,
		
		// start method will be delayed
		start = function(e){
			if(stopped) return;
			
			var _o = _options;
			
			if($type(e) === 'event'){
				_o.prevent && e.preventDefault();
			}
			
			timer = startMethod.delay(_o.delay, null, e);
		},
		
		// cancel method will be executed immediately
		cancel = function(e){
			if(stopped) return;
			
			timer = $clear(timer);
			
			if($type(e) === 'event'){
				_options.prevent && e.preventDefault();
			}
			
			cancelMethod(e);
		},
		
		addEvent = function(module, method){
			var len = module.length,
				m;
				
			while(len){
				m = module[-- len];
				m.ele && m.ele.addEvent(m.ev, method);
			}
		}
		
	addEvent(startModule, start);
	addEvent(cancelModule, cancel);
	
	return {
		resume: function(){
			stopped = false;
		},
		
		cancel: function(){
			stopped = true;
		}
	}
}


/**
 * Kael.Me Ajax page loader
 * @constructor
 */
KM.PageLoad = new Class({
						
	// @param {string | array of string} ctrlEl
	// @param {string | array of string} refreshEl
	// @param {string} effect : {'noFx', 'slide'}
	initialize: function( ctrlEl, refreshEl, effect ){
		this.ctrl = $type( ctrlEl ) === 'array' ? ctrlEl : [ ctrlEl ];
		this.refresh = $type( refreshEl ) === 'array' ? refreshEl : [ refreshEl ];
		
		this.ctrl = this.ctrl.flatten().map( function( item ){ return $j( item ); } );
		this.cont = new Elements( this.refresh.map( function( item ){ return $j( item ); } ) );
		
		effect = effect || 'noFx';
		
		this.effect = this[ effect ];

		this.processing = false,
		this.start = this._start.bind(this);
		
		this.bindDom();
	},
	
	bindDom: function(){
		var _self = this,
			i = this.ctrl.length;
			
		while( i ){
			this.ctrl[ --i ].getElements('a').addEvent('click', function(e){
				e.preventDefault();

				if( !_self.processing ){
					_self.url = this.get('href');
					_self.start();
				}
			});
		}
	},

	_start: function(){
		this.processing = true;
		
		this.loader = new Element('div');
		this.ajax = new KM.Request({
			url: this.url,
			onRequest: this.effect.on.bind(this),
			onSuccess: this.effect.after.bind(this)
		});
		this.ajax.send();

	},
	
	noFx: {
		on: function(){
			KM.bindScroll.scroll.toTop();
			this.cont.set('opacity', .4);
			$j('.loading').show();
		},
		
		after: function( responseText ){
			if(responseText.html){
				this.loader.set('html', responseText.html );
				
				var i = this.cont.length;
				while( i ){
					this.cont[ --i ].set('html', this.loader.getElement( this.refresh[i] ).get('html') );
				}
	
				this.bindDom();
				this.processing = false;
				
				this.cont.set('opacity', 1);	
				$j('.loading').hide();
			}
		}
	}
});


/**
 * Kael.Me Scroll
 * mootools.more.fx.scroll.js
 
 * @constructor
 */
KM.Scroll = new Class({
	Extends: Fx,
	
	// @param {object} options : Fx options
	// @param {element | element selector} element : null -> body, element -> $j( element )
	initialize: function( options, element ){
		var el;
		if( element ) el = $j( element );
		else el = window;

		this.element = this.subject = el;
		
		// mootools fx
		this.parent( options );
	},

	set: function(){
		var now = Array.flatten( arguments );
		if ( Browser.Engine.gecko ) now = [ Math.round( now[0] ), Math.round( now[1] ) ];
		this.element.scrollTo( now[0], now[1] );
	},

	compute: function( from, to, delta ){
		return [0, 1].map( function(i){
			return Fx.compute( from[i], to[i], delta );
		});
	},

	start: function(x, y){
		if (!this.check(x, y)) return this;
		var scrollSize = this.element.getScrollSize(),
			scroll = this.element.getScroll(), 
			values = {x: x, y: y};
			
		for (var z in values){
			var max = scrollSize[z];
			if ( $chk( values[z] ) ) values[z] = ($type(values[z]) == 'number') ? values[z] : max;
			else values[z] = scroll[z];
		}
		return this.parent( [scroll.x, scroll.y], [values.x, values.y] ); //call Fx.start
	},

	toTop: function(){
		return this.start(false, 0);
	},

	toLeft: function(){
		return this.start(0, false);
	},

	toRight: function(){
		return this.start('right', false);
	},

	toBottom: function(){
		return this.start(false, 'bottom');
	},

	toElement: function( el ){
		var position = $sj( el ).getPosition(this.element);
		return this.start(position.x, position.y);
	}
});

/**
 * Kael.Me bind scroll
 * bind scroll event for all elements with a '.scroll' class
 */
KM.scroll = {
	init: function(duration){

		//define a public method
		this.scroll = new KM.Scroll({
			duration: duration,
			transition: Fx.Transitions.Sine.easeOut
		});

		var _scroll = this.scroll;
		$j('.scroll a').addEvent('click', function(e){
			e.preventDefault();
		
			var l = this.get('href');
			switch( l ){
				case '#top':
				case 'top':
					_scroll.toTop();
					break;
				case '#footer':
				case '#bottom':
				case 'bottom':
					_scroll.toBottom();
					break;
				default:
					_scroll.toElement( l );
			}
		} );
	}
};


/**
 * Kael.Me Smart Comment
 * ajax comment, thread comment
 */
KM.smartCom = {
	type: ['text', 'email', 'URL'],
	len: [1, 1, 0],
	inputFlag: [0, 0, 0],
	
	init: function(){
		var self = this;
		
		this.timer = {};
		this.counter = {};
		
		this.btn.dom = $$('.submitBtn')[0];
		this.form = $('comForm');
		this.former = $('newComment');
		this.comList = $('comList');
		this.tReply = $$('.t-re');
		
		this.com = this.form.getElement('.com');
		this.input = this.form.getElements('.textField');
		this.area = this.form.getElement('textarea');
		this.counter.area = this.form.getElement('.c-area');
		this.counter.rest = this.form.getElement('.c-rest');

		this.info = this.form.getElement('.info');
		this.setting = this.form.getElement('.comSetting');
		this.avatar = this.info.getElement('.avatar');
		this.author = this.info.getElement('.author');
		this.authorW = this.form.getElement('.comWelcome span');
		
		this.change = this.form.getElement('.comChange');
		this.cancel = this.form.getElement('.t-cancel');
		
		// if already logged in, don't check user info
		if(!this.change) this.checkInfo = $lambda(true);
		
		KM.comResize && KM.comResize.init(this.form.getElement('.comResize'), this.area);
		
		this.parent = this.form.getElement('#comment_parent');
		
		this.fx = {
			info: new Fx.Tween(this.info, {
				duration: 300,
				property: 'opacity',
				onComplete: $empty
			}),
			
			setting: new Fx.Tween(this.setting, {
				duration: 300,
				property: 'opacity',
				onComplete: $empty
			}),
			
			reply: new Fx.Tween(this.form, {
				property: 'opacity',
				duration: 300,
				onComplete: $empty
			})
		};
		
		this.scroll = new KM.Scroll({
			duration: 300
		});

		this.inputInit();
		
		this.bindCom(this.tReply);
		this.bindForm();
		this.checkInfo(true);
		
		//this.checkArea();
	},
	
	inputInit: function(){
		if(this.input.length){
			// initialize avatar and this._email
			this.info.isHidden() && this.checkInput(1, true) && this.setAvatar();
			this.change.addEvent('click', this._switch.bind(this));	
		}
		else{
			this.checked = true;
		}
	},
	
	bindCom: function(tReply){
		tReply.addEvent('click', this.setReply.bind(this) );
	},
	
	bindForm: function(){
		var self = this;
		
		this.input.each(function(input, index){
			input.addEvents({
				'blur': function(){
					self.checkInput(index) && index == 1 && self.setAvatar();
					self.setSwitch();
				},
				
				'focus': function(){
					self.timer._switch && $clear(self.timer._switch);
				},
				
				'keyup': function(){
					input.removeClass('errInput');
				}
			});
		});
		
		this.area.addEvents({
			'focus': this.focus.bind(this),
			'keyup': this.checkArea.bind(this)
		});
		

		this.cancel.addEvent('click', this.setCancel.bind(this) );
		
		this.form.addEvent('submit', this.submit.bind(this) );
	},
	
	focus: function(){
		this.checkArea();
		if(this.info.isHidden()) this.setSwitch();
	},
	
	setSwitch: function(){
		this.timer._switch && $clear(this.timer._switch);
		this.timer._switch = setTimeout(this.infoComplete.bind(this), 1000);
	},
	
	_switch: function(e){
		e && e.preventDefault();
		
		var _open, _close, self = this;

		if(this.info.isHidden()){
			_open = 'info'; _close = 'setting';
			self.setAuthor();
		}else{
			_open = 'setting'; _close = 'info';
			self.checkInfo();
		}
		
		this.fx[_close].onComplete = function(){
			self[_close].hide();
			self[_open].show().set('opacity', 1);
		}
		
		this.fx[_close].start(0);
	},
	
	
	keyOn: function(e){
		if( e.code == 13 && ( e.alt || e.control ) ){
			this.submit();
			return true;
		}
		
	},
	
	btn:{
		disable: function(){
			this.dom.set('opacity', .3).addClass('disable').disabled = true;
		},
		
		enable: function(){
			KM.smartCom.timer.rest = $clear(KM.smartCom.timer.rest);
			KM.smartCom.timer.count = $clear(KM.smartCom.timer.count);
			KM.smartCom.counter.rest.hide();
			
			this.dom.set('opacity', 1).removeClass('disable').disabled = false;
		}
	},
	
	checkArea: function(e){
		if(e && this.keyOn(e)) return;

		var c = 5 - this.area.value.length;
		if(c < 1){
			if(!this.timer.rest && !this.processing) this.btn.enable();
			this.counter.area.hide();
		}else{
			this.btn.disable();
			this.counter.area.set('text', c + ' more letter' + (c > 1? 's' :' ')).show();
		}
	},
	
	setAuthor: function(){
		var name = this.input[0].value = this.input[0].value.trim();
		this.authorW && this.authorW.set('text', name);
		
		if(this.input[2].value) name = '<a class="url" href="' + this.input[2].value + '">' + name + '</a>';
		this.author.set('html', name);
	},
	
	setAvatar: function(){
		var email = this.input[1].value = this.input[1].value.trim();
		
		if(this._email === email ) return;
		this._email = email;
		new KM.Request({
			url: '/handler.x',
			data: {
				'a': 'avatar',
				'email': email
			},
		
			onSuccess: function( rt ){
				rt.uri && this.avatar.setProperty('src', rt.uri );
			}.bind(this)
		}).send();
	},
	
	checkAll: function(){
		var ret = this.checked ? true : this.checkInfo(); 

		if(!this.area.checkInput('text', 1)){
			this.area.focus();
			return;
		}
		return ret;
	},
	
	// @param {boolean} nowarn: whether to change the color the warn an error
	checkInfo: function(nowarn){
		for(var i = 0; i < 3; i ++){
			if( !this.checkInput(i, nowarn) ) return;
		}
		
		return true;
	},
	
	checkInput: function(i, nowarn){
		var el = this.input[i];
		if( this.inputFlag[i] = el.checkInput( this.type[i], this.len[i] ) ){
			return true;
		}
		
		!nowarn && el.addClass('errInput');
		return;
	},
	
	infoComplete: function(){
		if(this.inputFlag[0] && this.inputFlag[1] && $chk(this.inputFlag[2]) ){
			this._switch();
		}
	},
	
	submit: function(e){
		e && e.preventDefault();

		if( this.timer.rest || this.processing || !this.checkAll() ) return;

		this.processing = true;
	
		var _ajax = new Request({
			url: '/comment.x',
			data: this.form.toQueryString(),
			method: 'post',
			onRequest: this.before.bind(this),
		
			onSuccess: function(rt){
				this.timer.rest = this.btn.enable.delay(15000, this.btn);
				this.restCount();
				
				this.processing = false;
			
				var container = new Element('ul', {'class': 'children', 'html': rt, 'opacity': 0} );

				if(!this.depth){
					container = container.getFirst();
					container.addClass('depth-1').getElement('.info').className = 'top-info';
				}else{
					container.getElement('li').addClass('depth-' + String( ++ this.depth ));
				}
				
				var fx = new Fx.Tween(container.set('opacity', 0), {
					duration: 300,
					property: 'opacity',
					onComplete: $empty
				});
				
				if(this.depth){
					this.li.grab(container);
					this.setCancel();
				}else{	
					this.comList.grab(container);
				}
				
				this.bindCom(container.getElement('.t-re'));
				
				fx.start(1);
				
				this.area.value = '';
				this.area.set('opacity', 1);
				KM.loading.hide('comment');
			}
			.bind(this),
		
			onFailure: function(instance){
				this.btn.enable();
				this.processing = false;
				this.area.set('opacity', 1).focus();
				KM.loading.hide('comment');
			}
			.bind(this)
			
		}).send();
	},
	
	before: function(){
		this.btn.disable();
		this.area.set('opacity', .5);
		KM.loading.show('comment');
	},
	
	restCount: function(){
		var self = this,	
			count = function(){
				if(!count.i){
					count.i = 14;
					self.counter.rest.show();
				}
				self.counter.rest.set('text', count.i--);
				
			};

		this.timer.count = count.periodical(1000);
	},
	
	setReply: function(e){
		e && e.preventDefault();
		
		var self = this,
			_li = e.target.getParent('li'),
			_scroll,
			winScroll = window.getScroll().y;
		
		if( this.li == _li ) return;
		else this.li = _li;

		var	width = _li.getStyle('width').toInt();

		this.setParent( Math.abs(_li.get('id').toNum()) );
		this.setWidth( width );
		this.depth = Math.abs(_li.get('class').toNum());
		
		this.form.dispose().inject(_li).set('opacity', 0);
		
		_scroll = this.form.getPosition().y - winScroll - window.getSize().y + 230;
		
		if( _scroll > 0 )
			this.scroll.start(0, _scroll + winScroll );

		this.fx.reply.options.duration = 500;
		this.fx.reply.onComplete = function(){self.area.focus();};
		this.fx.reply.start(1);
	},

	setCancel: function(e){
		e && e.preventDefault();
		
		this.li = null;
		
		var self = this;
		
		this.fx.reply.options.duration = 300;
		this.fx.reply.onComplete = function(){
			self.form.dispose().inject( self.former ).set('opacity', 1);
			self.setParent(0);
			self.setWidth();
			self.depth = 0;
		};
		this.fx.reply.start(0);
	},
	
	setParent: function(value){
		this.parent.value = value;
	},
	
	setWidth: function(width){
		this.com.setStyle('width', width - 58 );
		this.area.setStyle('width', width - 296 );
	}
};


KM.comResize = {
	
	// mootools.drag.js options
	options: {
		limit: {y:[150, 300]},
		modifiers: {x:false, y:'height'}
	},
	
	// @param {element} ctrl: comment testarea resize ctrl btn
	// @param {element} area: testarea
	init: function(ctrl, area, options){
		if(!ctrl) return;
		
		this.area = area;
		
		this.options.handle = ctrl;
		this.options.onBeforeStart = this._onBeforeStart.bind(this); delete this._onBeforeStart;
		this.options.onComplete = this.options.onCancel = this._endDrag.bind(this); delete this._endDrag;
		
		if(options) this.options = $merge(this.options, options);
		
		this.drag = new KM.Drag(this.area, this.options);
		
		delete this.options;
	},
	
	_onBeforeStart: function(){
		this.area.addClass('active');
	},
	
	_endDrag: function(){
		this.area.removeClass('active');
	}	
};


/**
 * Kael.Me logo category menu
 */
KM.menu = {
	init: function(){
		var self = this;
		
		this.start = this.start.bind(this);
		this.end = this.end.bind(this);
		
		this.menu = $('logo-cate');
		this.menus = $$('li.cat-item');
		this.fx = [];
		
		this.menus.each(function(menu, index, menus){
			self.fx.push(
				new Fx.Tween(menu.set('opacity', 0), {
						duration: 500,
						property: 'opacity',
						link: 'cancel',
						onComplete: index === menus.length - 1 ? function(){ self.menu.hide(); } : $empty
					}
				)
			);
				
		});
		
		this.logo = $$('.logo-l')[0].addEvent('mouseenter', this.start);
		$('logo').addEvent('mouseleave', function(){ self.timer = self.end.delay(400); });
	},
	
	start: function(){
		this.timer = $clear(this.timer);
		
		// never execute duplicated to-show method
		if(!this.shown){
			this.menu.show();
			this.fx.each(function(fx){
				
				// setTimeout must be cleared due to executing delay in function KM.nemu.end()
				fx.menuTimer = $clear(fx.menuTimer); 
				fx.cancel().set(1); 
			});
			
			this.shown = true;
			this.logo.addClass('logo-l-hover');
		}
	},
	
	end: function(){
		this.timer = $clear(this.timer);
		
		this.shown = false;
		this.logo.removeClass('logo-l-hover');
		
		for(var i = 0, fx, count = this.fx.length, self = this; i < count; i++){
			fx = this.fx[i];
			
			fx.menuTimer = fx.start.delay(i * 100, fx, 0);
		}
	}
};



/**
 * KM.Drag CLASS
 * 
 * modified from mootools.Drag.js
 * 
 * license: MIT-style license
 *
 * mootools.Drag authors:
 * - Valerio Proietti
 * - Tom Occhinno
 * - Jan Kassens
 *
 * KM.Drag author:
 * - Kael Zhang
 *
 * requires:
 * - core:1.2.4/Events
 * - core:1.2.4/Options
 * - core:1.2.4/Element.Event
 * - core:1.2.4/Element.Style
 * - /MooTools.More
 *
 */
KM.Drag = new Class({

	Implements: [Events, Options],

	options: {/*
		onBeforeStart: $empty(thisElement),
		onStart: $empty(thisElement, event),
		onSnap: $empty(thisElement)
		onDrag: $empty(thisElement, event),
		onCancel: $empty(thisElement),
		onComplete: $empty(thisElement, event),*/
		snap: 6,
		unit: 'px',
		grid: false,
		style: true,
		limit: false,
		handle: false,
		invert: false,
		preventDefault: false,
		stopPropagation: false,
		modifiers: {x: 'left', y: 'top'}
	},

	initialize: function(ele, options){
		this.element = document.id(ele);
		this.document = this.element.getDocument();
		
		this.setOptions(options);
		var htype = $type(this.options.handle);
		this.handles = ((htype == 'array' || htype == 'collection') ? $$(this.options.handle) : document.id(this.options.handle)) || this.element;
		this.mouse = {'now': {}, 'pos': {}};
		this.value = {'start': {}, 'now': {}};

		this.selection = (Browser.Engine.trident) ? 'selectstart' : 'mousedown';

		this.bound = {
			start: this.start.bind(this),
			check: this.check.bind(this),
			drag: this.drag.bind(this),
			stop: this.stop.bind(this),
			cancel: this.cancel.bind(this),
			eventStop: $lambda(false)
		};
		this.attach();
	},

	attach: function(){
		this.handles.addEvent('mousedown', this.bound.start);
		return this;
	},

	detach: function(){
		this.handles.removeEvent('mousedown', this.bound.start);
		return this;
	},

	start: function(event){
		if (event.rightClick) return;
		if (this.options.preventDefault) event.preventDefault();
		if (this.options.stopPropagation) event.stopPropagation();
		this.mouse.start = event.page;
		this.fireEvent('beforeStart', this.element);
		var limit = this.options.limit;
		this.limit = {x: [], y: []};
		for (var z in this.options.modifiers){
			if (!this.options.modifiers[z]) continue;
			if (this.options.style) this.value.now[z] = this.element.getStyle(this.options.modifiers[z]).toInt();
			else this.value.now[z] = this.element[this.options.modifiers[z]];
			if (this.options.invert) this.value.now[z] *= -1;
			this.mouse.pos[z] = event.page[z] - this.value.now[z];
			if (limit && limit[z]){
				for (var i = 2; i--; i){
					if ($chk(limit[z][i])) this.limit[z][i] = $lambda(limit[z][i])();
				}
			}
		}
		if ($type(this.options.grid) == 'number') this.options.grid = {x: this.options.grid, y: this.options.grid};
		this.document.addEvents({mousemove: this.bound.check, mouseup: this.bound.cancel});
		this.document.addEvent(this.selection, this.bound.eventStop);
	},

	check: function(event){
		if (this.options.preventDefault) event.preventDefault();
		var distance = Math.round(Math.sqrt(Math.pow(event.page.x - this.mouse.start.x, 2) + Math.pow(event.page.y - this.mouse.start.y, 2)));
		if (distance > this.options.snap){
			this.cancel();
			this.document.addEvents({
				mousemove: this.bound.drag,
				mouseup: this.bound.stop
			});
			this.fireEvent('start', [this.element, event]).fireEvent('snap', this.element);
		}
	},

	drag: function(event){
		if (this.options.preventDefault) event.preventDefault();
		this.mouse.now = event.page;
		for (var z in this.options.modifiers){
			if (!this.options.modifiers[z]) continue;
			this.value.now[z] = this.mouse.now[z] - this.mouse.pos[z];
			if (this.options.invert) this.value.now[z] *= -1;
			if (this.options.limit && this.limit[z]){
				if ($chk(this.limit[z][1]) && (this.value.now[z] > this.limit[z][1])){
					this.value.now[z] = this.limit[z][1];
				} else if ($chk(this.limit[z][0]) && (this.value.now[z] < this.limit[z][0])){
					this.value.now[z] = this.limit[z][0];
				}
			}
			if (this.options.grid[z]) this.value.now[z] -= ((this.value.now[z] - (this.limit[z][0]||0)) % this.options.grid[z]);
			if (this.options.style) {
				this.element.setStyle(this.options.modifiers[z], this.value.now[z] + this.options.unit);
			} else {
				this.element[this.options.modifiers[z]] = this.value.now[z];
			}
		}
		this.fireEvent('drag', [this.element, event]);
	},

	cancel: function(event){
		this.document.removeEvent('mousemove', this.bound.check);
		this.document.removeEvent('mouseup', this.bound.cancel);
		if (event){
			this.document.removeEvent(this.selection, this.bound.eventStop);
			this.fireEvent('cancel', this.element);
		}
	},

	stop: function(event){
		this.document.removeEvent(this.selection, this.bound.eventStop);
		this.document.removeEvent('mousemove', this.bound.drag);
		this.document.removeEvent('mouseup', this.bound.stop);
		if (event) this.fireEvent('complete', [this.element, event]);
	}

});

/* end km.more.js
-----------------------------------------------------*/