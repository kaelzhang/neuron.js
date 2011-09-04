/**
 * module  DOM/manipulate
 */
 
;(function(K){

function cleanClass(str){
	return str.replace(/\s+/g, ' ');
};

function hasClass(el, cls){
	return el.className.indexOf(cls) !== -1;
};

function getStorage(id){
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
		var s = getStorage( SELECTOR.uid(this) );
		s[name] = value;
	}),
	
	GET: function(name){
		var s = getStorage( SELECTOR.uid(this) );
		return s[name];
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
	}
	
}, 'iterator'


).extend({
	hasClass: function(cls){
		return hasClass(this.context[0], cls);
	}

}, 'accessor'


).extend({
	data: overloadDOMGetterSetter(DATA),
	attr: overloadDOMGetterSetter(ATTR)
});


})(KM);