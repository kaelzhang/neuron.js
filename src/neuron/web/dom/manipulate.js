/**
 * module  DOM/manipulate
 */
 
;(function(K, undef){

function cleanClass(str){
	return str.replace(/\s+/g, ' ');
};

function hasClass(el, cls){
	return el.className.indexOf(cls) !== -1;
};

function getStorage(el){
	var id = SELECTOR.uid(el);

	return storage[id] || (storage[id] = {});
};

function overloadDOMGetterSetter(methods){
	return function(){
		var context = this.context,
			args = arguments, 
			type, 
			len = args.length, 
			m;
		
		// getter	
		if(len === 1 && K.isString(args[0])){
		
			// getter only get the value of the first element
			return methods[GET].call(context[0], args[0])
			
		}else if(len > 0){
			m = methods[SET];
		
			m && context.forEach(function(el){
				m.apply(el, args);
			});
		}
	};
};

function getFirstContext(el){
	el = (el instanceof DOM) ? el.el(0) : el;
	return el && el.nodeType ? el : false;
};


var DOM = K.DOM,

GET = 'get',
SET = 'set',
SELECTOR = K.__SELECTOR,

storage = {},

ATTR = {
	SET: K._overloadSetter( function(name, value){
		
	}),
	
	GET: function(name){
		
	}
},

DATA = {
	SET: K._overloadSetter( function(name, value){
		var s = getStorage(this);
		s[name] = value;
	}),
	
	GET: function(name){
		var s = getStorage(this);
		return s[name];
	}
},

inserters = {
	before: function(context, element){
		var parent = element.parentNode;
		parent && parent.insertBefore(context, element);
	},

	after: function(context, element){
		var parent = element.parentNode;
		parent && parent.insertBefore(context, element.nextSibling);
	},

	bottom: function(context, element){
		element.appendChild(context);
	},

	top: function(context, element){
		element.insertBefore(context, element.firstChild);
	}
};


DOM.extend({

	addClass: function(cls){
		var el = this;
		
		if(!hasClass(el, cls)){
			el.className = cleanClass( el.className + ' ' + cls );
		}
	},
	
	removeClass: function(cls){
		this.className = this.className.replace(new RegExp('(^|\\s)' + className + '(?:\\s|$)'), '$1');
	},
	
	dispose: function(){
		var parent = this.parentNode;
		parent && parent.removeChild(this);
	},
	
	removeData: function(name){
		if(name === undef){
			var id = SELECTOR.uid(this);
			id && delete storage[id]
		}else{
			var s = getStorage(this);
			delete s[name];
		}
	},
	
	inject: function(el, where){
		el = getFirstContext(el);
		el && inserters[where || 'bottom'](this, el);
	},
	
	grab: function(el, where){
		el = getFirstContext(el);
		el && inserters[where || 'bottom'](el, this);
	}
	
}, 'iterator'


).extend({
	hasClass: function(cls){
		return hasClass(this.context[0], cls);
	},
	
	data: overloadDOMGetterSetter(DATA),
	attr: overloadDOMGetterSetter(ATTR)
});


})(KM);