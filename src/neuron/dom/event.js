/**
 * module  DOM/event
 */

;(function(K){


// basic add event
function addEvent(el, type, fn){
	var METHOD = 'addEventListener';
	
	el[METHOD] ? el[METHOD](type, fn, false) : el.attachEvent('on' + type, fn);
};


function removeEvent(el, type, fn){
	var METHOD = 'removeEventListener';
	
	el[METHOD] ? el[METHOD](type, fn, false) : el.detachEvent('on' + type, fn);
};


function getStorage(el){
	var id = SELECTOR.uid(el);

	return event_storage[id] || (event_storage[id] = {});
}; 


function checkRelatedTarget(){
	var related = event.relatedTarget;
	if (related == null) return true;
	if (!related) return false;
	return (related != this && related.prefix != 'xul' && typeOf(this) != 'document' && !this.contains(related));
};


function removeDOMEvent(type, fn){
	var el = this,
		storage = getStorage(el),
		remove = removeDOMEventByType;
		
	if(!storage){
		return;
	}
	
	if(fn){
		var index;
	
		index = storage[type] ? storage[type].fns.indexOf(fn) : -1;
		index !== -1 && remove(el, type, storage, index);
		
	}else{
		var types = type ?
				  storage[type] ? [type] : []
				: Object.keys(storage),
				
			len = types.length,
			t,
			s;
		
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
	
	var doc = win.document,
		type = event.type,
		target = event.target || event.srcElement,
		page = {},
		client = {},
		related = null,
		rightClick, wheel, code, key;
		
	while (target && target.nodeType == 3){
		target = target.parentNode;
	}

	if (type.indexOf('key') !== -1){
		code = event.which || event.keyCode;
		key = Object_keyOf(Event.Keys, code);
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
	
	K.mix(this, event, true, ['shiftKey', 'ctrlKey', 'altKey', 'metaKey']);

	K.mix(this, {
		event: event,
		type: type,

		page: page,
		client: client,
		rightClick: rightClick,

		wheel: wheel,

		relatedTarget: document.id(related),
		target: document.id(target),

		code: code,
		key: key
	});
});


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
	event_storage = (storage.events = {}),
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
		
		fns = storage[type].fns;  console.log(fns);
		
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
				event = new DOMEvent(event, WIN); // TODO: getWindow
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
	detach: K._overloadSetter(removeDOMEvent),
	
	fire: function(type){
	}


}, 'iterator');


DOM.Event = DOMEvent;
DOM.Events = Events; 


})(KM);

/**
 change log:
 
 2011-09-10  Kael:
 - basic functionalities
 
 TODO:
 A. refractor Events


 */