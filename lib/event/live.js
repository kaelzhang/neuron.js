/**
 * module  event/live
 * inspired by jQuery 
 */
KM.define(function(K){

// quickParse and quickMatch
// credits to jQuery (http://jquery.com/)

/**
 * @param {string} selector
 * @return {Array} parsed selector
 */
function quickParse(selector) {
	var quick = REGEX_MATCH_SIMPLE_SELECTOR.exec(selector);
	if ( quick ) {
		//   0  1    2   3
		// [ _, tag, id, class ]
		quick[1] = (quick[1] || '').toLowerCase();
		quick[3] = quick[3] && new RegExp( '(?:^|\\s)' + quick[3] + '(?:\\s|$)' );
	}
	return quick;
};

/**
 * the match method of CSS Selector Engine is inefficient
 * on most conditions, namely when the selector discribed with tagName, className or id,
 * we could match the selector very fast
 
 * @param {DOMElement} elem
 * @param {Array} m return value of quickParse
 * @return {boolean}
 */
function quickMatch(elem, m){
	var attrs = elem.attributes || {};
	return (
		(!m[1] || elem.nodeName.toLowerCase() === m[1]) &&
		(!m[2] || (attrs.id || {}).value === m[2]) &&
		(!m[3] || m[3].test( (attrs[ "class" ] || {}).value ))
	);
};


function selectorEngineMatch(element){
	return SELECTOR.match(element, _match);
};


function getStorage(element, key){
	var storage = element.data(key);
	
	if(!storage){
		storage = {};
		element.data(key, storage); 
	}
	
	return storage;
};



function getSpecialEventConfiguration(type, host){
		// @type {Object} special delegate configurations for a certain type
	var special_delegate = special[type] || {},
			
		// @type {Object} special event configuration declared by Neuron core
		special_event = Events[type] || {};
		
	K.mix(host, {
		base		: special_delegate.base || special_event.base || type,
		listen		: special_delegate.listen,
		condition	: special_event.condition,
		capture		: special_delegate.capture
	});
	
	return host;
};


/**
 * @this {DOMElement}
 * @param {}
 */
function dispatch(event, type){
	var self = this,
		element = DOM(self),
		storage = getStorage(element, DATA_KEY),
		config = storage[type];
		
	if (event.button && type === 'click' || !config || !config.length){
		return;
	}
	
	event.base = event.type;
	event.type = type;
	
	var matcher,
		cur,
		i, len, cfg,
		condition = config.condition;
		
	for(cur = event.target; cur && cur !== self; cur = cur.parentNode){
		for(i = 0, len = config.length; i < len; i ++ ){
			cfg = config[i];
			
			if(
				// check if the element matches the selector
				// if the selector is simple selector, we use quickMatch
				// otherwise, use CSS Selector Engine instead
				(cfg.quick ? quickMatch(cur, cfg.quick) : SELECTOR.match(cur, cfg.selector) ) &&
				
				(!condition || condition.call(cur, event))
			){
				cfg.fn.call(cur, event);
			}
		}
	}
};


var 

DATA_KEY = '_nr-delegate',

// from jQuery
REGEX_MATCH_SIMPLE_SELECTOR = /^(\w*)(?:#([\w\-]+))?(?:\.([\w\-]+))?$/,

DOM = K.DOM,

SELECTOR = DOM.SELECTOR,

Events = DOM.Events,

is_eventListener_supported = !!window.addEventListener,

special = {
	mouseenter: {
		base: 'mouseover'
	},
	
	mouseleave: {
		base: 'mouseout'
	},
	
	// ref: Focus Event Types
	// http://dev.w3.org/2006/webapi/DOM-Level-3-Events/html/DOM3-Events.html#events-focusevent
	focus: {
		base: 'focus' + (is_eventListener_supported ? '' : 'in'),
		
		// ref:
		// useCapture (addEventListener)
		// http://www.w3.org/TR/DOM-Level-3-Events/#event-flow
		capture: true
	},
	
	blur: {
		base: is_eventListener_supported ? 'blur' : 'focusout',
		capture: true
	}
};


var delegate = {

	/**
	 * @param {string|DOMElement|KM.DOM} element
	 * @param {string} type
	 * @param {string} selector
	 * @param {function()} fn
	 */
	on: function(element, type, selector, fn){
	
		// @type {KM.DOM}
		element = DOM(element);
	
		var storage = getStorage(element, DATA_KEY),
			config = storage[type];
		
			
		if (!config){
		
			storage[type] = config = [];
			getSpecialEventConfiguration(type, config);
			
			config.handle = function(event){
				// @this 
				dispatch.call(this, event, type);
			};
		
			// delegate a certain event type only once
			element.on(config.base, config.handle, config.capture);
		}
		
		config.push({
			selector: selector,
			fn: fn,
			quick: quickParse(selector)
		});
		
		// free
		element = config = null;
	},
	
	/**
	 * remove a delegated event or remove all of the specified events
	 
	 * @param {string|DOMElement|KM.DOM} element
	 * @param {string=} type
	 * @param {string=} selector
	 * @param {function()} fn
	 
	 * example:
	 <code>
	 	var live = require('event/live');
	 
	 	// remove all events delegated to '#container'
 		live.off('#container');
 		
 		// remove all click events delegated to '#container' 
 		live.off('#container', 'click');
 		
 		// remove all click events of the elements which match '.item' within '#container'
 		live.off('#container', 'click', '.item');
 		
 		// remove event handler: myEventHandler
 		live.off('#container', 'click', '.item', myEventHandler);
	 </code>
	 */
	off: function(element, type, selector, fn){
		// @type {KM.DOM}
		element = DOM(element);
	
		var storage = getStorage(element, DATA_KEY),
			config = storage[type],
			i = 0,
			len,
			cfg;
			
		if(!config){
			return;
		}
		
		// remove all <type> events
		if(!selector){
			config.length = 0;
			return;
		}
		
		for(len = config.length; i < len; i ++){
			cfg = config[i];
			
			if(
				!cfg || 
				cfg.selector === selector && 
					// remove all event handlers off the matched elements
					(!fn || cfg.fn === fn)
			){
				config.splice(i, 1);
			}
		}
		
		// if all event handlers had been removed, remove event listener from the container
		if(!config.length){
			element.off(config.base, config.handle);
		}
	}

};


return delegate;

});


/**
 change log:
 
 2012-03-01  Kael:
 TODO:
 A. overload the setter of binding live events
 
 2012-01-30  Kael:
 - add more situations of arguments' overloading; delegate.off now could remove more than one events
 
 2012-01-13  Kael:
 - complete main functionalities;
 
 */
