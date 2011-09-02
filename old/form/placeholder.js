/**
 * @module  placeholder
 */


/**
 * @usage
 * ...
 * var p = require('form/placeholder').Placeholder;
 * new p('search_input', {valSetter: foo.setGetValueGetter});
 * ...
 
 
 * @returns
 * {
 		val: {Function} getter, method to get the input value
 		placeholder: {Function} setter, method to dynamicly set the current placeholder
 * }
 *
 */



KM.define(function(K, require, exports, undef){


function defaultValue(param, d){
	return param === undef ? d : param;
}


var WIN = K.__HOST,
	DOC = WIN.document,
	PLACEHOLDER = 'placeholder',
	
	placeholder_is_enabled = (PLACEHOLDER in DOC.createElement('input')),
	
	Placeholder;
	
	
Placeholder = function(input, options){
	if(this instanceof Placeholder){
		options = options || {};
		
		input = $(input);
		
		function val(){
			return input.value;
		};
		
		function addClass(){
			input.addClass(focusCls);
		};
		
		function removeClass(v){
			!getValue() && input.removeClass(focusCls);
		};
	
		var EMPTY = '',
			self = this,
			focusCls = defaultValue(options.focusCls, 'focus'),
			
			valSetter = options.valSetter,
			
			// options.placeholder has higher priority than placeholder in element attributes
			placeholder_txt = (options[PLACEHOLDER] || input.getAttribute(PLACEHOLDER) || EMPTY).trim(),
		
			getValue = placeholder_is_enabled ? 
				val 
				: function(){
					var v = val();
					
					return v === placeholder_txt ? EMPTY : v;
				}
			,
			ret = {
				
				/**
				 * method to get the current value of the input element
				 * @getter
				 */
				val: getValue,
				
				/**
				 * dynamicly set the placeholder of the input element
				 * @setter
				 */
				placeholder: function(txt){
					placeholder_txt = txt;
					
					return ret;
				}
			};
			
		if(K.isFunction(valSetter)){
			valSetter(getValue);
		}
			
		input.addEvents({
			focus: addClass,
			
			blur: removeClass
		});
			
		if(!placeholder_is_enabled){
			input.addEvents({
				focus: function(){
					if( !getValue() ){
						input.value = EMPTY;
					}
				},
				
				blur: function(){
					if( !getValue() ){
						input.value = placeholder_txt;
					}
				}
			});
		}
	
		return ret;
			
	}else{
		return new Placeholder(input, options);
	}
};

exports.Placeholder = Placeholder;

});




/**
 * TODO:
 * 1. move html5 feature detection to html5-detect.js
 * 2. module interaction

 * change log:
 * 2011-05-03  Kael Zhang:
 * - migrate from old DP.Form.Placeholder
 * - no more deal with btn clicking
 * - refractor as loader module
 
 */
