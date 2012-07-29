/**
 * @preserve Neuron core:dom v2.0(jQuerified)
 */
;(function(K){

/**
 nodeType: 
 ref: https://developer.mozilla.org/en/nodeType
 
    Node.ELEMENT_NODE == 1
        - document.documentElement
        - document.body
        - <head>
        
    Node.ATTRIBUTE_NODE == 2
    Node.TEXT_NODE == 3
    Node.CDATA_SECTION_NODE == 4
    Node.ENTITY_REFERENCE_NODE == 5
    Node.ENTITY_NODE == 6
    Node.PROCESSING_INSTRUCTION_NODE == 7
    Node.COMMENT_NODE == 8
    Node.DOCUMENT_NODE == 9
        - document
        
    Node.DOCUMENT_TYPE_NODE == 10
    Node.DOCUMENT_FRAGMENT_NODE == 11
    Node.NOTATION_NODE == 12
 */
 
 
/**
 *
 */
function isDOMSubject(el){
    var type;
    return K.isWindow(el) || el && (type = el.nodeType) && (type === 1 || type === 9);
};


// function getContext(el){
    // window         -> window
    // body         -> body
    // [null]        -> [null]
    // $(window)    -> window
//    return !el || isDOMSubject(el) ? el : el._ === atom && el.context;
// };


/**

Select:
$(selector)             =
$(DOMElement)           =
$(NodeList)             =
$(KM.DOM)               =
$(selector, context)    +
$(Array.<DOMElement>)   +

Create:
$(fragment)             +       X
$(fragment, attrs)      +?      X

$.create(tagName, attrs);

*/

/**
 * @private
 * @param {string|DOMElement} selector
 * @param {(DOM|NodeList|DOMElement)=} context
 * @param {boolean=} first only get the first matched element
 */
function DOMInit(selector, context, first){

    // use ECMAScript strict
    var self = this,
        element,
        ret;
    
    
    if(!selector){
        return self;
    }
    
    if(
        // if `selector` is a DOMElement, ignore `context`
        isDOMSubject(element = selector)
        
        // optimize finding document.body
        || selector === 'body' && !context && (element = DOC.body)
    ){
        self[0] = element;
        self.length = 1;
        return self;
    }
    
    if(K.isString(selector)){
    
        // give id special treatment, 
        if(REGEX_IS_ID.test(selector)){
            var id = selector.slice(1),
                el = DOC.getElementById(id);
            
            // from jQuery:
            // > Check parentNode to catch when Blackberry 4.6 returns
            // > nodes that are no longer in the document [#6963](http://bugs.jquery.com/ticket/6963)
            if(el && el.parentNode){
            
                // > In IE7 Standards mode and previous modes, 
                // > this method performs a case-insensitive match on both the ID and NAME attributes, 
                // > which might produce unexpected results
                // via: [msdn](http://msdn.microsoft.com/en-us/library/ie/ms536437(v=vs.85).aspx)
                if(el.id !== id){
                    return ROOT.one(selector);
                }
                
                self[0] = el;
                self.length = 1;
            }
            
            return self;
        }
        
        // normal selectors
        return DOM(context || ROOT)[first ? 'one' : 'find'](selector);
    }

    ret = makeArray(selector, self).filter(isDOMSubject);

    if(first){
        ret.splice(1);
    }

    return ret;
};


function DOM(element, context){
    return element && element._ === atom ?
    
        // if already Neuron Element
        element
        : new DOMInit(element, context);
};

/**
 * @param {string} name
 * @param {function()} method
 * @param {string|boolean.<false>} type
 */

// extends is one of the javascript reserved words
function extend(name, method, type){
    var generator,
        host = DOMInit.prototype;

    if(K.isPlainObject(name)){
        generator = IMPLEMENT_GENERATOR[method] || IMPLEMENT_GENERATOR.def;
        
        for(var n in name){
            generator(host, n, name[n]);
        }
    }else{
        generator = IMPLEMENT_GENERATOR[type] || IMPLEMENT_GENERATOR.def;
        generator(host, name, method);
    }
    
    return DOM;
};



var 

// save the current $ in window, for the future we need to return it back
WIN = K.__HOST,

// store the original value of $
_$ = WIN.$,
    
SELECTOR = K.S,
    
DOC = WIN.document,
ROOT = DOM(DOC),

REGEX_IS_ID = /^#[\w\-]+$/,

atom = K._,

AP = Array.prototype,
slice = AP.slice,

makeArray = K.makeArray,


/**
 'mutator'    :   the method modify the current context({Object} this.context, as the same as below), 
                and return the modified DOM instance(the old one) itself
                    
 'iterator'    :    the method iterate the current context, may modify the context, maybe not 
                and return the modified DOM instance(the old one) itself
                    
 X 'accessor'    :    the method will not modify the context, and generate something based on the current context,
                and return the new value
                (removed!)have been merged with 'def'
                    
 'def'         :   simply implement the method into the prototype of DOM,
                and the returned value determined by the method
 */
IMPLEMENT_GENERATOR = {

// never used currently
/**
    mutator: function(host, name, method){
        host[name] = function(){
            var self = this;
            method.apply(self, arguments);
            
            return self;
        }
    },
*/
    
    iterator: function(host, name, method){
        host[name] = function(){
            var self = this,
                i = 0, 
                len = self.length;
                
            for(; i < len; i ++){
                method.apply(self[i], arguments);
            }
            
            return self;
        }
    },

// never used currently
/**    
    accessor: function(host, name, method){
        host[name] = function(){
            return method.apply(this, arguments);
        }
    },
*/    
    def: function(host, name, method){
        host[name] = method;
    }
};


DOM.one = function(selector, context){
    return new DOMInit(selector, context, true);
};


extend({
    
    /**
     * if the prototype of a constructor contains `length` and `splice`, its instance will be printed like an array.
     
     <code>
        function A(){};
        A.prototype = {
            length: 0,
            splice: [].slice
        }
        console.log(new A);
     </code>
     */
    length: 0,
    
    // @private
    // for internal use
    splice: AP.splice,
    
    // Neuron DOM methods:
    forEach: AP.forEach,
    filter: AP.filter,
    
    // identifier to mark Neuron DOM
    _: atom,
    
    /**
     * @param {string} selector
     * @returns {KM.DOM} Neuron DOM Object contains all matched elements
     
     * TODO:
     * {KM.DOM|DOMElement}
     */
    find: function(selector){
        var ret = new DOMInit();
        
        // append the result to the end of `ret`
        SELECTOR.find(selector, this, ret);
    
        return ret;
    },
    
    /**
     * @returns {KM.DOM} Neuron DOM Object contains only the first matched element
     */
    one: function(selector){
        var ret = new DOMInit();
    
        return makeArray(SELECTOR.find(selector, this, null, true), ret);
    },
    
    /**
     * @param {number=} index
     *        if index is a number, returns the element of the specified index
     *        otherwise, returns the shadow array copy of all matched elements
     */
    get: function(index){
        return K.isNumber(index) ? this[index] : slice.call(this, 0);
    },
    
    size: function(){
        return this.length;
    },
    
    /**
     * add a subject to the current 
     * @param {string|KM.DOM|DOMElement} subject the subject to be included into the current KM.DOM instance. 
         subject could be string of css selectors, instance of KM.DOM, or native DOMElement
     */
    add: function(subject){
        subject && K._pushUnique(this, subject._ === atom ? subject.get() : new DOMInit(subject), this);
        return this;
    }
});


// traits
// @private
DOM.methods = {};


// @temp
DOM._ = DOMInit;

// @public
// create basic methods and hooks
DOM.__storage = {};

// method for extension
DOM.extend = extend;

// adaptor of selector engine
DOM.SELECTOR = SELECTOR;

// returns the $ object back to its original value
DOM.noConflict = function(){
    WIN.$ = _$;
};

WIN.$ = K.DOM = DOM;

    
})(KM);

/**
 change log:
 
 2012-07-27  Kael:
 - refractor
 
 
 
 */