/**
 changed methods from mootools
 - styleNumber: never return rounded value
 - getOffsets: never return rounded value
 
 license: MIT-style license.

 credits:
  - Element positioning based on the [qooxdoo](http://qooxdoo.org/) code and smart browser fixes, [LGPL License](http://www.gnu.org/licenses/lgpl.html).
  - Viewport dimensions based on [YUI](http://developer.yahoo.com/yui/) code, [BSD License](http://developer.yahoo.com/yui/license.html).
 */

KM.define(function(K){

// ---------- mootools.dimensions start ----------

var DOC = document,
	HTML = DOC.documentElement,
	WIN = window,
	COMPACT_ELEMENT = !DOC.compatMode || DOC.compatMode == 'CSS1Compat' ? HTML : DOC.body,
	
	FIXED = 'fixed', STATIC = 'static',

	brokenOffsetParent = function(){
		var element = document.createElement('div'),
			child = document.createElement('div'),
			ret;
		element.style.height = '0';
		element.appendChild(child);
		ret = child.offsetParent === element;
		element = child = null;
		
		return ret;
	}(),
	
	styleString = Element.getComputedStyle;


function styleNumber(element, style){
	return parseFloat( styleString(element, style) ) || 0;
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

function isBody(element){
	return (/^(?:body|html)$/i).test(element.tagName);
};

function isDocument(element){
	return element === WIN || element === DOC;
};

function isOffset(el){
	return styleString(el, 'position') != 'static' || isBody(el);
};

function isOffsetStatic(el){
	return isOffset(el) || (/^(?:table|td|th)$/i).test(el.tagName);
};

/**
 *
 * ---------------------------------------------------------- */
 
function getSize(element){
	switch(true){
		case isDocument(element):
			element = COMPACT_ELEMENT;
			return {
				width	: doc.clientWidth, 
				height	: doc.clientHeight
			};
			break;
			
		case isBody(element):
		default:
			element = WIN;
			return {
				width	: element.offsetWidth, 
				height	: element.offsetHeight
			}
	}
};


function getScrollSize(element){
	
};

Element.implement({

	getScrollSize: function(){
		if (isBody(this)) return WIN.getScrollSize();
		return {x: this.scrollWidth, y: this.scrollHeight};
	},

	getScroll: function(){
		if (isBody(this)) return WIN.getScroll();
		return {x: this.scrollLeft, y: this.scrollTop};
	},

	getScrolls: function(){
		var element = this.parentNode, position = {x: 0, y: 0};
		while (element && !isBody(element)){
			position.x += element.scrollLeft;
			position.y += element.scrollTop;
			element = element.parentNode;
		}
		return position;
	},

	getOffsetParent: ,

	getOffsets: function(){
		if (this.getBoundingClientRect && !Browser.Platform.ios){
			var bound = this.getBoundingClientRect(),
				html = document.id(DOC.documentElement),
				htmlScroll = html.getScroll(),
				elemScrolls = this.getScrolls(),
				isFixed = (styleString(this, 'position') == 'fixed');

			return {
				x: bound.left + elemScrolls.x + ((isFixed) ? 0 : htmlScroll.x) - html.clientLeft,
				y: bound.top  + elemScrolls.y + ((isFixed) ? 0 : htmlScroll.y) - html.clientTop
			};
		}

		var element = this, position = {x: 0, y: 0};
		if (isBody(this)) return position;

		while (element && !isBody(element)){
			position.x += element.offsetLeft;
			position.y += element.offsetTop;

			if (Browser.firefox){
				if (!borderBox(element)){
					position.x += leftBorder(element);
					position.y += topBorder(element);
				}
				var parent = element.parentNode;
				if (parent && styleString(parent, 'overflow') != 'visible'){
					position.x += leftBorder(parent);
					position.y += topBorder(parent);
				}
			} else if (element != this && Browser.safari){
				position.x += leftBorder(element);
				position.y += topBorder(element);
			}

			element = element.offsetParent;
		}
		if (Browser.firefox && !borderBox(this)){
			position.x -= leftBorder(this);
			position.y -= topBorder(this);
		}
		return position;
	},

	getPosition: function(relative){
		if (isBody(this)) return {x: 0, y: 0};
		var offset = this.getOffsets(),
			scroll = this.getScrolls();
		var position = {
			x: offset.x - scroll.x,
			y: offset.y - scroll.y
		};
		
		if (relative && (relative = document.id(relative))){
			var relativePosition = relative.getPosition();
			return {x: position.x - relativePosition.x - leftBorder(relative), y: position.y - relativePosition.y - topBorder(relative)};
		}
		return position;
	},


	computePosition: function(obj){
		return {
			left: obj.x - styleNumber(this, 'margin-left'),
			top: obj.y - styleNumber(this, 'margin-top')
		};
	}

});


[Document, Window].invoke('implement', {

	getScroll: function(){
		var win = WIN, doc = getCompatElement(this);
		return {x: win.pageXOffset || doc.scrollLeft, y: win.pageYOffset || doc.scrollTop};
	},

	getScrollSize: function(){
		var doc = getCompatElement(this),
			min = this.getSize(),
			body = DOC.body;

		return {x: Math.max(doc.scrollWidth, body.scrollWidth, min.x), y: Math.max(doc.scrollHeight, body.scrollHeight, min.y)};
	},

	getPosition: function(){
		return {x: 0, y: 0};
	}

});


// ---------- / mootools.dimensions end ----------


return {
	// no setter
	offset: function(element, relative){ console.log($(element))
		var offset = element.getPosition(relative);
		
		return {
			left	: offset.x,
			top		: offset.y
		}
	},
	 
	size: function(element, type){
		return type === scroll ? getScrollSize(element) : getSize(element);
	},
	
	scrollTop: function(element){
		return element.getScrollTop();
	},
	
	scrollLeft: function(element){
		return getScrollLeft(element);
	},
	
	offsetParent: brokenOffsetParent ? 
		function(element){
			var position = styleString(element, 'position'),
				parent = HTML,
				offsetCheck;
		
			if (!isBody(element) && position !== FIXED){
				offsetCheck = position === STATIC ? isOffsetStatic : isOffset;
				
				while ((element = element.parentNode)){
					if (isOffsetCheck(element)){
						parent = element;
						break;
					}
				}
			}
			
			return HTML;
		} 
	:	
		function(element){
			var parent = HTML;
			
			if (!isBody(element) && styleString(element, 'position') === FIXED){
				try {
					parent = element.offsetParent;
				} catch(e) {}
			}
			
			return parent;
		}	
};

});
