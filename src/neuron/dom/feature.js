/**
 * feature detection about dom
 * module  dom/feature
 */

KM.DOM.feature = function(){

	function elementsByTagName(wrap, tagName){
		return wrap.getElementsByTagName(tagName);
	};

	var DOC = document,
		element_test = DOC.createElement('div'),
		a;
	
	element_test.innerHTML = ' <link/><table></table><a href="/a" style="top:1px;float:left;opacity:.7;">a</a><input type="checkbox"/>';
	
	a = elementsByTagName(element_test, 'a')[0];
	
	return {
		
		// in some old webkit(including chrome), a.style.opacity === '0,7', so use regexp instead
		// ref: 
		opacity		: /^0.7$/.test(a.style.opacity),
		
		compactEl	: !DOC.compatMode || DOC.compatMode === 'CSS1Compat' ?
			  function(doc){ return doc.documentElement; } 
			: function(doc){ return doc.body; }
	};

}();