/**
 * module  DOM/css
 */
;(function(K, NULL){


// __SELECTOR makes sure that element is a DOMElement/DOMDocument
function getDocument(element){
	// window
	return 'setInterval' in element ? element.document 
	
		// document
		: 'getElementById' in element ? element 
			: element.ownerDocument;
};


function camelCase(str){
	return str.replace(REGEX_CAMELCASE, function(matchAll, match1){
		return match1.toUpperCase();
	});
};


function hyphenate(str){
	return str.replace(REGEX_HYHPENATE, function(matchAll){
		return '-' + matchAll;
	});
};

// TODO: add hooks for compatibility
function filterCSSType(name){
	return camelCase(name === 'float' ? STR_FLOAT_NAME : name);
};


function santitizeColorData(color){
	return [];
};

/*
function filterNumberCSSValue(value){
	var match = REGEX_CSS_VALUE_NUMBER.match('' + value);
	
	return match ? match[0] : value;
};
*/


var DOM = K.DOM,
	UA = K.UA,
	DOC = document,
	HTML = DOC.documentElement,
	TRUE = true,
	
	currentCSS,
	
	REGEX_CAMELCASE = /-([a-z])/ig,
	REGEX_HYHPENATE = /[A-Z]/g,
	REGEX_OPACITY = /opacity=([^)]*)/,
	REGEX_FILTER_ALPHA = /alpha\([^)]*\)/i,
	
	// 0.123
	// .23
	// 23.456
	// REGEX_CSS_VALUE_NUMBER = /^(?:\d*\.)?\d+(?=px$)/i,
	
	STR_CSSFLOAT = 'cssFloat',
	
	feature = DOM.feature,
												 
	STR_FLOAT_NAME = STR_CSSFLOAT in HTML.style ?
		STR_CSSFLOAT 		// standard, IE9+
		: 'styleFloat', 	// IE5.5 - IE8, IE9
		
	CSS_methods = {},
	
	CSS_CAN_BE_SINGLE_PX = {
		left: TRUE, top: TRUE, bottom: TRUE, right: TRUE,
		width: TRUE, height: TRUE, maxWidth: TRUE, maxHeight: TRUE, minWidth: TRUE, minHeight: TRUE, textIndent: TRUE,
		fontSize: TRUE, letterSpacing: TRUE, lineHeight: TRUE,
		margin: TRUE, padding: TRUE, borderWidth: TRUE
	};



// @private
// get computed styles
currentCSS = HTML.currentStyle ? 

	// IE5.5 - IE8, ref: 
	// http://msdn.microsoft.com/en-us/library/ms535231%28v=vs.85%29.aspx
	// http://www.quirksmode.org/dom/w3c_html.html
	function(element, property){
		return element.currentStyle[camelCase(property)];
	} :
	
	// standard
	function(element, property){
		var defaultView = getDocument(element).defaultView,
	
			// ref: https://developer.mozilla.org/en/DOM/window.getComputedStyle
			computed = defaultView ? defaultView.getComputedStyle(element, null) : null;
			
		return (computed) ? 
			computed.getPropertyValue( property === STR_FLOAT_NAME ? 'float' : hyphenate(property) ) 
			: null;
	};
	

if(!feature.opacity){

	// from jQuery
	CSS_methods.opacity = {
	
		// will never adjust 'visibility' of element, unlike mootools
		SET: function(element, opacity){
			var style = element.style,
				currentStyle = element.currentStyle,
				filter = currentStyle && currentStyle.filter || style.filter || "";

			// IE has trouble with opacity if it does not have layout
			// Force it by setting the zoom level
			style.zoom = 1;
			
			opacity = Number(opacity);
			opacity = opacity || opacity === 0 ?
				  ''
				: 'alpha(opacity=' + opacity * 100 + ')';

			style.filter = REGEX_FILTER_ALPHA.test( filter ) ?
				  filter.replace( REGEX_FILTER_ALPHA, opacity )
				: filter + ' ' + opacity;
		},
		
		// @return {number}
		GET: function(element){
			return REGEX_OPACITY.test( currentCSS(element, 'filter') || '' ) ?
				  parseFloat( RegExp.$1 ) / 100
				: 1;
		}
	};
}

['height', 'width'].forEach(function(property){
	CSS_methods[property] = {
		GET: function(){
			
		}
	};
});


// add css getter and setter to DOM hook functions
DOM.methods.css = {
	len: 1,
	
	/**
	 * @param {string} name
	 * @param {number|string} value
	 	setter of css will be simple, value will not accept Array. unlike mootools
	 */
	SET: K._overloadSetter(function(name, value){
		name = filterCSSType(name);
	
		var el = this,
			specified = CSS_methods[name];
		
		// if has a specified setter
		if(specified && specified.SET){
			specified.SET(el, value);
			
		}else{
		
			if( CSS_CAN_BE_SINGLE_PX[name] && (
					   // is number string and the current style type need 'px' suffix
					   // -> .css('margin', '20')
					   K.isString(value) && value === String(Number(value))
					   
					   // -> .css('margin', 20)
					|| K.isNumber(value)
				)
			){
				value += 'px';
			}
			
			el.style[name] = value;
		}
	}),
	
	/**
	 * Get the value of a style property for the first element
	 * @param {string} name Array is not allowed, unlike mootools
	 * @return {string|number|(Array.<number>)}
	 	- {string} numeric values with *units*, such as font-size ('12px'), height, width, etc
	 	- {number} numeric values without units, such as zIndex
	 	- ? {Array} color related values, always be [<r>, <g>, <b>, <a>] // TODO
	 	
	 * never determine your control flow by css styles!
	 */
	GET: function(name){
		name = filterCSSType(name);
		
		var el = this, ret,
			specified = CSS_methods[name];
			
		if(specified && specified.GET){
			return specified.GET(el);
		}
		
		ret = el.style[name];
		
		if(!ret || name === 'zIndex'){
			ret = currentCSS(el, name);
		}
		
		// TODO: color
		
		return ret;
	}
	
};


})(KM, null);

/**
 change log:
 
 2011-09-10  Kael:
 
 TODO:
 - A. test runtimeStyle, ref:
 	http://lists.w3.org/Archives/Public/www-style/2009Oct/0060.html
 	http://msdn.microsoft.com/en-us/library/ms535889(v=vs.85).aspx
 - B. computedStyle for width and height
 
 2011-09-09  Kael:
 - complete basic css methods
 - create getter and setter method for opacity in old ie

 */