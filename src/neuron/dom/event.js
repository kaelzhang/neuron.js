/**
 * module  DOM/event
 */

;(function(K){

function getWindow(element){
	// window
	return 'setInterval' in element ? element
	
		// document
		: 'getElementById' in element ? element.window
			: element.ownerDocument.window;
};


function getStorage(el){
	var id = SELECTOR.uid(el);

	return event_storage[id] || (event_storage[id] = {});
}; 


// from jQuery
function checkRelatedTarget(event){
	var related = event.relatedTarget,
		el = this;
	
	// Firefox sometimes assigns relatedTarget a XUL element
	// which we cannot access the parentNode property of
	try{
		// Chrome does something similar, the parentNode property
		// can be accessed but is null.
		if ( related && related !== document && !related.parentNode ) {
			return;
		}

		// Traverse up the tree
		while ( related && related !== el ) {
			related = related.parentNode;
		}

		if ( related !== el ) {
			// handle event if we actually just moused on to a non sub-element
			return true;
		}
		
	}catch(e){}
	
	return;
};


function removeDOMEvent(type, fn){
	var el = this,
		storage = getStorage(el),
		remove = removeDOMEventByType,
		s;
		
	if(!storage){
		return;
	}
	
	if(fn){
		var index;
	
		s = storage[type];
		index = s ? s.fns.indexOf(fn) : -1;
		index !== -1 && remove(el, type, s, index);
		
	}else{
		var types = type ?
				  storage[type] ? [type] : []
				: Object.keys(storage),
				
			len = types.length,
			t;
		
		while(len --){
			t = types[len]; 	// type
			s = storage[t];		// storage
			
			s.fns.forEach(function(v, i){
				v && remove(el, t, s, i);
			})
			
			s.fns.length = s.vals.length = 0;
			delete storage[t];
		}
	}
};


function removeDOMEventByType(el, type, storage, index){
	removeEvent(el, type, storage.vals[index]);
	delete storage.fns[index];
	delete storage.vals[index];
};

/**
 * @constructor
 */
function DOMEvent(event, win){
	if(event instanceof DOMEvent){
		return event;
	}

	win = win || K.__HOST;
	event = event || win.event;
	
	var self 	= this,
		type 	= self.type = event.type,
		target 	= self.type = event.target || event.srcElement,
		page 	= self.page = {},
		client 	= self.client = {},
		NULL	= null,
		related,
		doc,
		touch;
		
	self.event = event;
	K.mix(self, event, true, ['shiftKey', 'ctrlKey', 'altKey', 'metaKey']);
		
	while (target && target.nodeType == 3){
		target = target.parentNode;
	}

	if (type.indexOf('key') !== -1){
		// TODO:
		// test function keys, on macosx and win
		self.code = event.which || event.keyCode;
		
	} else if (type === 'click' || type === 'dblclick' || type === 'contextmenu' || !type.indexOf('mouse') ){
		doc = getCompactElement(win.document);
		
		page.x = event.pageX != NULL ? event.pageX : event.clientX + doc.scrollLeft;
		page.y = event.pageY != NULL ? event.pageY : event.clientY + doc.scrollTop;
		
		client.x = event.pageX != NULL ? event.pageX - win.pageXOffset : event.clientX;
		client.y = event.pageY != NULL ? event.pageY - win.pageYOffset : event.clientY;
		
		if (type === 'DOMMouseScroll' || type === 'mousewheel'){
			self.wheel = (event.wheelDelta) ? event.wheelDelta / 120 : - (event.detail || 0) / 3;
		}
		
		self.rightClick = (event.which == 3) || (event.button == 2);
		
		if (type == 'mouseover' || type == 'mouseout'){
			related = event.relatedTarget || event[(type == 'mouseover' ? 'from' : 'to') + 'Element'];
			
			while (related && related.nodeType == 3){
				related = related.parentNode;
			}
			
			self.relatedTarget = related;
		}
				
	} else if ((/^(?:gesture|touch)/i).test(type)){
		K.mix(self, event, true, ['rotation', 'scale', 'targetTouches', 'changedTouches', 'touches']);
	
		touch = self.touches && self.touches[0];
		
		if (touch){
			page.x = touch.pageX;
			page.y = touch.pageY;
			client.x = touch.clientX; 
			client.y = touch.clientY;
		}
	}
};


DOMEvent.prototype = {
	stop: function(){
		return this.stopBubble().prevent();
	},

	stopBubble: function(){
		var e = this.event, m = 'stopPropagation';
		e[m] ? e[m]() : (e.cancelBubble = true);
		
		return this;
	},

	prevent: function(){
		var e = this.event, m = 'preventDefault';
		e[m] ? e[m]() : (e.returnValue = false);
		
		return this;
	}
};


var DOM = K.DOM,
	SELECTOR = DOM.SELECTOR,
	storage = DOM.__storage,
	feature = DOM.feature,
	
	event_storage = (storage.events = {}),
	
	getCompactElement = feature.compactEl,
	addEvent = feature.addEvent,
	removeEvent = feature.removeEvent,
	
	TRUE = true,
	
	Events = {
		mouseenter: {
			base: 'mouseover',
			condition: checkRelatedTarget
		},
		
		mouseleave: {
			base: 'mouseout',
			condition: checkRelatedTarget
		},
		
		mousewheel: {
			base: K.UA.mozilla ? 'DOMMouseScroll' : 'mousewheel'
		}
	},
	
	NO_EVENTS = 'unload beforeunload resize move DOMContentLoaded readystatechange error abort scroll'.split(' ');


// cleaner
event_storage._clean = function(id){
	var storage = event_storage[id];
	
	if(storage){
		K.each(storage, function(v, key){
			v.fns.length = v.vals.length = 0;
			delete this[key];
		});
	}
};
	

DOM.extend({

	// inspired by: Dean Edwards's addEvent lib
	on: K._overloadSetter(function(type, fn){
		var el = this,
			storage = getStorage(el),
			fns;
			
		if(!storage[type]){
			storage[type] = {fns: [], vals: []};
		}
		
		fns = storage[type].fns;
		
		if(fns.indexOf(fn) !== -1){
			return;
		}
		fns.push(fn);
		
		var real_type = type,
			custom = Events[type],
			condition = fn,
			eventFn;
			
		if(custom){
			if(custom.condition){
				condition = function(event){
					return custom.condition.call(this, event) ? fn.call(this, event) : true;
				};
			}
			
			real_type = custom.base || real_type;
		}
		
		eventFn = NO_EVENTS[real_type] ? 
			function(){
				return fn.call(el);
			} :
			
			function(event){
				event = new DOMEvent(event, getWindow(el)); // TODO: getWindow
				if (condition.call(el, event) === false) event.stop();
			};
			
		storage[type].vals.push(eventFn);
		addEvent(el, real_type, eventFn);
	}),
	
	
	/**
	 * .detach()			-> remove all
	 * .detach('click')		-> remove all click
	 * .detach('click', fn)	-> remove click method fn
	 */
	detach: K._overloadSetter(removeDOMEvent) // ,
	
	// fire: function(type){}

}, 'iterator');


DOM.Event = DOMEvent;
DOM.Events = Events; 


})(KM);

/**
 change log:
 
 2011-09-12  Kael:
 TODO:
 - A. 
 
 2011-09-10  Kael:
 - basic functionalities
 
 TODO:
 A. refractor Events
 B. fix onchange event of input elements


 */