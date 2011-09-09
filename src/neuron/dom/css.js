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
	return str.replace(REGEX_CAMEL_FIRST_LETTER, function(matchAll, match1){
		return match1.toUpperCase();
	});
};


function hyphenate(str){
	return str.replace(REGEX_HYHPENATE, function(matchAll){
		return '-' + matchAll;
	});
};


var DOM = K.DOM,
	UA = K.UA,
	DOC = document,
	
	currentCSS,
	
	REGEX_CAMELCASE = /-([a-z])/ig,
	REGEX_HYHPENATE = /[A-Z]/g,
	REGEX_OPACITY = /opacity=([^)]*)/,
	REGEX_FILTER_ALPHA = /alpha\([^)]*\)/i,
	
	SRT_CSSFLOAT = 'cssFloat',
	
	feature = DOM.feature,
												 
	STR_FLOAT_NAME = SRT_CSSFLOAT in html.style ? 
		SRT_CSSFLOAT 		// standard, IE9+
		: 'styleFloat', 	// IE5.5 - IE8, IE9
		
	CSS_methods = {};


// @private
currentCSS = html.currentStyle ? 

	// IE5.5 - IE8, ref: 
	// http://msdn.microsoft.com/en-us/library/ms535231%28v=vs.85%29.aspx
	// http://www.quirksmode.org/dom/w3c_html.html
	function(element, property){
		return element.currentStyle[camelCase(property)];
	} :
	
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


// add css getter and setter to DOM hook functions
DOM.methods.css = {
	len: 1,
	
	SET: function(name, value){
	},
	
	
	GET: function(name){
		
	}
};


})(KM, null);