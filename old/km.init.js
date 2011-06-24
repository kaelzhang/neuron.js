/*
Script: kael.me.core.js
	based on mootools(http://mootools.net) compact javascript framework.
Author:
	Kael Zhang[i@kael.me]

Copyright:
	All rights reserved.
	Copyright (c) 2009 [Kael Zhang](http://kael.me && http://yottaworks.net).
*/

/*
Note:
	Class begins with an Uppercase letter, while function with a lower one.
*/

/* define GLOBAL Kael.Me namespace
----------------------------------------------------*/
var KM = { 
	version: '2.1.3',

	// regular expression
	reg: {
		email: /^[a-z0-9._%-]+@[a-z0-9.-]+\.[a-z]{2,4}$/i,
		URL: /^(http|https)\:\/\/[a-z0-9\-\.]+\.[a-z]{2,4}(\/.*)?$/i
	}
};


/**
 * Kael.Me (JavaScript) Loader
 * The prototype of the only entry point of all javascript actions
 * Suggest not using this class directly, but the KM.init instead
----------------------------------------------------*/	
KM.Loader = new Class({
					  
	// @param {array} queued_functions the array of functions, queued before page initialized
	// 		this argument is used by KM.init 
	initialize: function(queued_functions){
		
		if($type(queued_functions) === 'array'){
			this._queue = queued_functions;
		}
		
		// for external use
		this.include = this.include.bind(this);

	},
	
	// add a method which is waiting to be executed
	// @public
	add: function(func){
		
		// if javascript loading has been finished
		if(this.ready){
			func();
		}else{
			this._queue.push(func);
		}
		
		return this;
	},
	
	// @public
	// @depricated use KM.init instead
	include: function(){
		
		// this is important, every time you pass the arguments object, 
		// the original arguments will be packaged into a new arguments
		var args = $A(arguments).flatten();

		this.size = args.length;
		this.count = 0;
		this.ready = false;
	
		if( this.size ){
			var i = this.size, arg, type;
			
			// using 'while' so we initialize callback function at first
			while(i){
				arg = args[--i];
				type = $type(arg);
				
				if(type === 'string') this._create(arg);
				if(type === 'function'){ 
					this._start = arg;
					++ this.count;
				}
			}
				
		}else this._testReady();
	},
	
	// create script
	// @private
	_create: function(arg){
		
		// if the script already loaded, fire 'load' event immediately
		// to implement this class for loading no scripts, please override function this.create
		if( this._stack[arg] ) this._testReady();
		
		
		new KM.jsLoader(
			KM.module[arg] || '/s/j/km.' + arg + '.js',
			{
				onload: this._testReady.bind(this, arg)
			}
		);
		
		/*new Element('script', { 
				'type':		'text/javascript',
				'src':		KM.module[arg] || '/s/j/km.' + arg + '.js',
				'events':	{'load': this.testReady.bind(this, [true, arg]) }
			}
		).inject( $j() );*/
	},
	
	// test whether if all js has been loaded
	// @private
	_testReady: function(arg){
		// push the arg into the stack, so will not load it again;
		if(arg) this._stack[arg] = true;

		if(++ this.count >= this.size){
			this.ready = true;
			this._start();
			
			// execute queued methods
			var i = 0,
				len = this._queue.length,
				func;
			
			if(len){
				for(; i < len; i ++){
					func = this._queue[i];
					
					func && func();
				}
				
				// clean queue
				this._queue.length = 0;
			}
		}
	},
	
	_queue: [],
	
	_start: $empty,
	
	_stack: {}
});

KM.module = {};

/* Kael.Me initializer, ALL javascript method should access through this method
 * @require KM.Loader
 * ---------------------------------------------------------------------------------------------------------------- */
KM.init = (function(){		
	var queue = [],
		
		instance, 
	
		func = function(){
			var _instance = instance,
				arg = arguments;
			
			// if it's the first time to call KM.init, initialize KM.Loader
			if(!_instance){
				_instance = instance = new KM.Loader(queue);
				
				// Domready!
				// this is the unique entrance before you execute a function	
				window.addEvent('domready', function(){
					_instance.include.apply(null, arg);
				});
				
				return _instance;
				
			}else{
				return _instance.add(
					function(){
						_instance.include.apply(arg);
					}
				);
			}
		},
		
		add = function(func){
			if($type(func) === 'function'){
				var _instance = instance;
				
				if(!_instance){	
					queue.push(func);		
				}else{
					_instance.add(func);
				}
			}
			
		};
		
	func.add = add;	
		
	return func;
	
})();


KM.Images = new Class({
	Implements: KM.Loader,
	
	initialize: function(){
		this.include(arguments);
	},
	
	_create: function(arg){
		new KM.imgLoader(arg, {onload: this._testReady.bind(this) });
	}
});

KM.jsLoader = function(source, properties){
	properties = $extend({
		onload: $empty,
		document: document,
		check: $lambda(true)
	}, properties);
	
	if (properties.onLoad) properties.onload = properties.onLoad;
	
	var script = new Element('script', {src: source, type: 'text/javascript'});

	var load = properties.onload.bind(script), 
		check = properties.check, 
		doc = properties.document;
	delete properties.onload;
	delete properties.check;
	delete properties.document;

	script.addEvents({
		load: load,
		readystatechange: function(){
			if (['loaded', 'complete'].contains(this.readyState)) load();
		}
	}).set(properties);

	if (Browser.Engine.webkit419){
		var checker = (function(){
			if (!$try(check)) return;
			$clear(checker);
			load();
		}).periodical(50);
	}

	return script.inject(doc.body);
};

KM.imgLoader = function(source, properties){
	properties = $merge({
		onload: $empty,
		onabort: $empty,
		onerror: $empty
	}, properties);
	var image = new Image();
	var element = document.id(image) || new Element('img');
	['load', 'abort', 'error'].each(function(name){
		var type = 'on' + name;
		var event = properties[type];
		delete properties[type];
		image[type] = function(){
			if (!image) return;
			if (!element.parentNode){
				element.width = image.width;
				element.height = image.height;
			}
			image = image.onload = image.onabort = image.onerror = null;
			event.delay(1, element, element);
			element.fireEvent(name, element, 1);
		};
	});
	image.src = element.src = source;
	if (image && image.complete) image.onload.delay(1);
	return element.set(properties);
};



KM.string = {
	
	// @param {string/ query} queryString
	// @return: if it's a query string, return an object according to the query
	//			if it's not a string, return false
	//			if it's a normal string, return itself
	// @example:
	//		'action=123&string=helloworld' -> {action:123, string:'helloworld'}
	//		123 -> false
	//		'123' -> '123'
	queryConvert: function(queryString){
		if(typeof queryString !== 'string') return;
		
		var split_ = queryString.split('&'),
			len = split_.length,
			obj = {};
			
		if(len === 1) return queryString;
		
		for(var i = 0; i < len; i ++){
			var s = split_[i];
			
			if(s){
				s = s.split('=');
				obj[s[0]] = s[1];
			}
		}
	},
	
	// check an array of strings(checkRule), and return a specified array of numbers
	// actually, this method is used for assigning value for variables in a string
	
	// @param {string} string string to be checked
	// @param {array of string} checkRule
	// @param {array of number} returnNumber
	
	// @example
	//  'a - b + c', ['a', 'b', 'c'], [3, 4, 1]  ->  [3, -4, 1]
	multiCheck: function(string, checkRule, returnNumber){
		checkRule = $splat(checkRule);
		returnNumber = $splat(returnNumber);
		
		var i = 0,
			len = checkRule.length,
			ret = [],
			index;
		
		if($type(string) === 'string' && len === returnNumber.length){			
			for(; i < len; i ++){
				index = string.indexOf(checkRule[i]);
				
				if(index !== -1){
					if(index && string.substr(index - 1, 1) === '-'){
						ret.push( -1 * returnNumber[i] );
					}else{
						ret.push( returnNumber[i] );
					}
				}
			}
		}
		
		return ret;
	}
};


(function(){
		  
	/* --------------------- number implements --------------------- */	
	/*
	Number.implement({
		
		// there's a bug about Number.toInt() in Mootools 
		toInt: function(){
		}
	});	  
	*/
	
	/* --------------------- array implements --------------------- */
	Array.implement({
		sum: function() {
			var result = 0, l = this.length;

			if (l) {
				do {
					result += this[--l];
				} while (l);
			}
			return result;
		}

	});
	
	/* --------------------- string implements --------------------- */
	String.implement({			 
					 
		// function toInt in mootools only could fetch one number(integer) from the beginning of a string
		// to Num return the first match of number by default 
		
		// decimals are supported
		
		// @param {boolean} all: whether return all matches of numbers, or only the first match
		// @return: matched number(may be no integer but float), if no number matched, return false;
		toNum: function(all) {
			var ret = this.match(/(-)?(\d*\.)?\d+/g);
			return ret ? 
					(all ? 
					 	ret.map( function(item_){ return Number(item_); } ) 
					: 
						Number(ret[0])
					) 
				: 
					false;
		},
		
		// HTMLized the input value, will be useful in comment preview
		HTMLdecode: function(){
			return this.replace(/\n\n+/g, '<br/><br/>').replace(/\n/g, '<br/>');
		},
		
		// @return: if it's a query string, return an object according to the query
		//			if it's not a string, return false
		//			if it's a normal string, return itself
		queryConvert: function(){
			return KM.string.queryConvert(this);
		}
	
	});
	
	
	/* --------------------- element implements --------------------- */
	
	// @private
	var styleString = Element.getComputedStyle;
	
	function styleNumber(element, style){
		return styleString(element, style).toInt() || 0;
	};
	
	function isBody(element){
		return (/^(?:body|html)$/i).test(element.tagName);
	};
	
	function borderBox(element){
		return styleString(element, '-moz-box-sizing') == 'border-box';
	};
	
	function topBorder(element){
		return styleNumber(element, 'border-top-width');
	};
	
	function leftBorder(element){
		return styleNumber(element, 'border-left-width');
	};
	
	Element.implement({
		prevent: function(type){
			return this.addEvent(type, function(e){e && e.preventDefault();});
		},
					  
		fix: function(){
			return this.setStyles({
				'width': this.getStyle('width').toInt(),
				'height': this.getStyle('height').toInt()
			});
		},
					  
		hide: function(){
			var d;
			try{  //IE fails here if the element is not in the dom
				if (this.getStyle('display') != 'none') d = this.getStyle('display');
			} catch(e){}
			
			//store the original display value of the element
			return this.store('km_od', this.retrieve('km_od') || d || 'block').setStyle('display', 'none');
		},
		
		show: function(display) {
			return this.setStyle('display', display || this.retrieve('km_od') || 'block');
		},
	
		toggle: function(){
			return this.isHidden() ? this.show() : this.hide();
		},
		
		isHidden: function(){
			return this.getStyle('display') === 'none' || this.getStyle('visibility') === 'hidden';
		},
		
		isTrans: function(){
			return this.getStyle('opacity') !== 1;
		},
	
		// checkInput
		// @param {number} len: required length
		//		if input not required, len = 0 || false;
		//		if should not be blank, len = 1;
		// @param {string} type: {'email' || 'URL' || 'text'}
		checkInput: function( type, len ){
			var c = this.value = this.value.trim();
	
			if( !len && !c ) return true;
			
			if( type === 'text'){
				if( len && c.length < len ) return;
				else return true;
			}
			
			if( type === 'URL' && c.substr( 0, 4 ) !== 'http'){ c = 'http://' + c; this.value = c;}
	
			if( !KM.reg[type].test( c ) ) return;
			else return true;
		},
		
		// needed mootools.drag.js
		// @param {object} options: KM.Drag options
		makeResizable: function(options){
			var drag = new KM.Drag(this, $merge({modifiers: {x: 'width', y: 'height'}}, options));
			this.store('resizer', drag);
			return drag.addEvent('drag', function(){
				this.fireEvent('resize', drag);
			}.bind(this));
		},
		
		// method exactOffsets
		// @return the exact offsets of the element, as well as exactPosition and exactCoordinates
		// different from mootools.getOffsets	
		exactOffsets: function(){
			if (this.getBoundingClientRect){
				var bound = this.getBoundingClientRect(),
					html = document.id(this.getDocument().documentElement),
					htmlScroll = html.getScroll(),
					elemScrolls = this.getScrolls(),
					elemScroll = this.getScroll(),
					isFixed = (styleString(this, 'position') == 'fixed');
	
				return {
					
					// no toInt() here
					x: bound.left + elemScrolls.x - elemScroll.x + ((isFixed) ? 0 : htmlScroll.x) - html.clientLeft,
					y: bound.top  + elemScrolls.y - elemScroll.y + ((isFixed) ? 0 : htmlScroll.y) - html.clientTop
				};
			}
	
			var element = this, position = {x: 0, y: 0};
			if (isBody(this)) return position;
	
			while (element && !isBody(element)){
				position.x += element.offsetLeft;
				position.y += element.offsetTop;
	
				if (Browser.Engine.gecko){
					if (!borderBox(element)){
						position.x += leftBorder(element);
						position.y += topBorder(element);
					}
					var parent = element.parentNode;
					if (parent && styleString(parent, 'overflow') != 'visible'){
						position.x += leftBorder(parent);
						position.y += topBorder(parent);
					}
				} else if (element != this && Browser.Engine.webkit){
					position.x += leftBorder(element);
					position.y += topBorder(element);
				}
	
				element = element.offsetParent;
			}
			if (Browser.Engine.gecko && !borderBox(this)){
				position.x -= leftBorder(this);
				position.y -= topBorder(this);
			}
			return position;
		},
		
		// @require exactOffsets
		exactPosition: function(relative){
			if (isBody(this)) return {x: 0, y: 0};
			var offset = this.exactOffsets(),
					scroll = this.getScrolls();
			var position = {
				x: offset.x - scroll.x,
				y: offset.y - scroll.y
			};
			var relativePosition = (relative && (relative = document.id(relative))) ? relative.getPosition() : {x: 0, y: 0};
			return {x: position.x - relativePosition.x, y: position.y - relativePosition.y};
		},
		
		// @require exactPosition
		exactCoordinates: function(element){
			if (isBody(this)) return this.getWindow().getCoordinates();
			var position = this.exactPosition(element),
					size = this.getSize();
			var obj = {
				left: position.x,
				top: position.y,
				width: size.x,
				height: size.y
			};
			obj.right = obj.left + obj.width;
			obj.bottom = obj.top + obj.height;
			return obj;
		}
		
	});
	

})();



/* define a jQuery-like DOM selector
 * change log:
 * 		2010-01-19: compatitable for mootools 1.2.4, remove $ES()
-------------------------------------------------------------*/
function $j(selector, filter){
	if(selector) var dom = filter ? $$(filter).getElements(selector).flatten() : $(selector) || $$(selector);
	else return document.body; // $j() === body
	
	if($type(dom) !== 'array') return dom;
	else if(dom.length == 1) return dom[0];  //never return a one-value array
	else return dom;
};

/* end KM.init.js-------------------------------------*/