/**
 * module  dom/feature
    - feature detection about dom
    - util methods about dom
 */

NR.DOM.feature = function(){


function elementsByTagName(wrap, tagName){
    return wrap.getElementsByTagName(tagName);
};

// makes sure that element is a DOMElement/DOMDocument
function getDocument(element){
    // window
    return 'setInterval' in element ? element.document 
    
        // document
        : 'getElementById' in element ? element 
            : element.ownerDocument;
};

function hyphenate(str){
    return str.replace(REGEX_HYHPENATE, function(matchAll){
        return '-' + matchAll;
    });
};

function camelCase(str){
    return str.replace(REGEX_CAMELCASE, function(matchAll, match1){
        return match1.toUpperCase();
    });
};


var NULL = null,

    REGEX_HYHPENATE = /[A-Z]/g,
    REGEX_CAMELCASE = /-([a-z])/ig,
    
    DOC = document,
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


var floatName = !!a.style.cssFloat ? 
         // standard, IE9+
         'cssFloat' 
         // IE5.5 - IE8, IE9
       : 'styleFloat';
    
    

return {

    floatName: floatName,
    
    cssProp: function(name){
        return camelCase(name === 'float' ? floatName : name);
    },
    
    // TMP
    camelCase: camelCase,
    
    // get computed styles
    curCSS: defaultView && defaultView.getComputedStyle ?

        // standard
        function(element, property){
            var defaultView = getDocument(element).defaultView,
        
                // ref: https://developer.mozilla.org/en/DOM/window.getComputedStyle
                computed = defaultView ? defaultView.getComputedStyle(element, NULL) : NULL;
                
            return (computed) ? 
                computed.getPropertyValue( property === floatName ? 'float' : hyphenate(property) ) 
                : NULL;
        } :
    
        // IE5.5 - IE8, ref: 
        // http://msdn.microsoft.com/en-us/library/ms535231%28v=vs.85%29.aspx
        // http://www.quirksmode.org/dom/w3c_html.html
        function(element, property){
            var currentStyle = element.currentStyle;
        
            return currentStyle && currentStyle[camelCase(property)] || NULL;
        },
    
    
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
 
 2012-09-19  Kael:
 - move method of getComputedStyle from dom/css to dom/feature
 
 2012-01-12  Kael:
 - add the <code>useCapture</code> argument to feature.addEvent and removeEvent methods
 
 
 
 */



