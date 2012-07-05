/**
 * feature detection about dom
 * module  dom/feature
 */

KM.DOM.feature = function(){

	function elementsByTagName(wrap, tagName){
		return wrap.getElementsByTagName(tagName);
	};

	var DOC = document,
		defaultView = DOC.defaultView,
		element_test = DOC.createElement('div'),
		input_test,
		
		ADD_EVENT_LISTENER = 'addEventListener',
		REMOVE_EVENT_LISTENER = 'removeEventListener',
		
		create_element_accepts_html,
		escapeQuotes,
		
		a;
	
	element_test.innerHTML = ' <link/><table></table><a href="/a" style="top:1px;float:left;opacity:.7;">a</a><input type="checkbox"/>';
	
	a = elementsByTagName(element_test, 'a')[0];
	
	try {
		input_test = DOC.createElement('<input name=x>');
		create_element_accepts_html = input_test.name == 'x';
		
		escapeQuotes = function(html){
			return ('' + html).replace(/&/g, '&amp;').replace(/"/g, '&quot;');
		};
		
	} catch(e){}
	
	return {
		
		computedStyle: !!(defaultView && defaultView.getComputedStyle),
		
		// in some old webkit(including chrome), a.style.opacity === '0,7', so use regexp instead
		// ref: 
		
		// if the current browser support opacity, it will convert `.7` to `0.7`
		opacity: /^0.7$/.test(a.style.opacity),
		
		compactEl: !DOC.compatMode || DOC.compatMode === 'CSS1Compat' ?
			  function(doc){ return doc.documentElement; } 
			: function(doc){ return doc.body; },
			
		addEvent: element_test[ADD_EVENT_LISTENER] ?
			  function(el, type, fn, useCapture){ el[ADD_EVENT_LISTENER](type, fn, !!useCapture); }
			: function(el, type, fn){ el.attachEvent('on' + type, fn); },
		
		removeEvent: element_test[REMOVE_EVENT_LISTENER] ?
			  function(el, type, fn, useCapture){ el[REMOVE_EVENT_LISTENER](type, fn, !!useCapture); }
			: function(el, type, fn){ el.detachEvent('on' + type, fn); },
			
		fragment: create_element_accepts_html ? 
		
			// Fix for readonly name and type properties in IE < 8
			function(tag, attrs){
				var name = attrs.name,
					type = attrs.type;
				
				tag = '<' + tag;
				if (name){
					tag += ' name="' + escapeQuotes(name) + '"';
				}
				
				if (type){
					tag += ' type="' + escapeQuotes(type) + '"';
				}
				
				tag += '>';
				
				delete attrs.name;
				delete attrs.type;
				
				return tag;
			} : 
			
			function(tag){
				return tag;
			}
			
	};

}();


/**
 change log:
 
 2012-01-12  Kael:
 - add the <code>useCapture</code> argument to feature.addEvent and removeEvent methods
 
 
 
 */



