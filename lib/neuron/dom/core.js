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


/**
 * filter an array or Array-like object. this method will change the origin subject
 * @param {Array|Object} array
 * @param {function(mixed, number)} filter
 */
function filterArrayObject(array, filter){
    var i = 0;
    
    // array.length is changing
    for(; i < array.length; i ++){
        if(!filter.call(array, array[i], i)){
        
            // the member at the iterator has been removed, so we should move the iterator one step to the left
            array.splice(i --, 1);
        }
    }
    
    return array;
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
$(NR.DOM)               =
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
 */
function DOMInit(selector, context){

    // use ECMAScript strict
    var element;
    
    
    if(!selector){
        return this;
    }
    
    if(
        // if `selector` is a DOMElement, ignore `context`
        isDOMSubject(element = selector)
        
        // optimize finding document.body
        || selector === 'body' && !context && (element = DOC.body)
    ){
        this[0] = element;
        this.length = 1;
        return this;
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
                    return ROOT.find(selector);
                }
                
                this[0] = el;
                this.length = 1;
            }
            
            return this;
        }
        
        // normal selectors
        return DOM(context || ROOT).find(selector);
    }

    makeArray(selector, this);
    filterArrayObject(this, isDOMSubject);

    // if(first){
        // in IE6-8, the second argument of Array.prototype.splice is *required*, which is different from standard
        // [ref: msdn](http://msdn.microsoft.com/en-us/library/wctc5k7s(v=vs.94).aspx)
    //    this.splice(1, this.length - 1);
    // }

    return this;
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
WIN = window,

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
            method.apply(this, arguments);
            
            return this;
        }
    },
*/
    
    iterator: function(host, name, method){
        host[name] = function(){
            var i = 0, 
                len = this.length;
                
            for(; i < len; i ++){
                method.apply(this[i], arguments);
            }
            
            return this;
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


extend({
    
    /**
     * if the prototype of a constructor contains `length` and `splice`, 
     * its instance will be printed like an array, as well as firebug and webkit's `console`[native code] do.
     
     <code>
        function A(){};
        A.prototype = {
            length: 0,
            splice: [].slice
        }
        
        new A; // print []
     </code>
     */
     
    // length must not be undefined, 
    // otherwise, IE will fail(not throw an exception, but no effect) to push subject to Object use `AP.push.call`.
    // set to `0` as default
    length: 0,
    
    // @private
    // for internal use
    splice: AP.splice,
    
    // Neuron DOM methods:
    forEach: AP.forEach,
    
    // TODO:
    // filter: function(){
    //   var ret = new DOMInit();
    // },
    
    // identifier to mark Neuron DOM
    _: atom,
    
    /**
     * @param {string} selector
     * @returns {Object} Neuron DOM Object contains all matched elements
     
     * TODO:
     * {NR.DOM|DOMElement}
     */
    find: function(selector){
        return SELECTOR.find(selector, this, DOM());
    },
    
    /**
     * Reduce the set of matched elements to the one at the specified index
     * @param {number} index
     * @returns {Object}
     */
    eq: function(index){
        index = + index;
    
        return index || index === 0 ?
            index === -1 ? DOM(slice.call(this, index)) : DOM(slice.call(this, index, index + 1))
            : DOM();
    },
    
    /**
     * @param {number=} index
     *        if index is a number, returns the element of the specified index
     *        otherwise, returns the shadow array copy of all matched elements
     */
    get: function(index){
        return K.isNumber(index) ? this[index] : slice.call(this, 0);
    },
    
    // @deprecated
    // count: function(){
    //    return this.length;
    // },
    
    /**
     * add a subject to the current. using this method will change the origin object
     * @param {string|NR.DOM|DOMElement} subject the subject to be included into the current NR.DOM instance. 
         subject could be string of css selectors, instance of NR.DOM, or native DOMElement
     */
    add: function(subject){
        var ret = DOM(this.get());
        subject && K.pushUnique(ret, DOM(subject));
        return ret;
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
// DOM.noConflict = function(){
//    WIN.$ = _$;
//    return DOM;
// };

K.DOM = DOM;

    
})(NR);

/**
 change log:
 
 2013-02-04  Kael:
 - to optimize for gzip, no longer declare self as this
 
 2012-09-26  Kael:
 - remove method $.findOne() and .findOne(). there're several reasons:
 
 ## $.findOne() vs $().eq(0):
 
 In most cases, the performance of `$.findOne()` and `$().eq(0)` is nearly the same (`$.findOne()` slightly faster)

 ## .findOne() vs .find().eq(0):
 
 If the number of element in the set is more than one, `.findOne()` is much faster than `.find().eq(0)`. 
 BUT, it IS a really awful practice that use both `.findOne()` or `.find().eq(0)` with a set of elements, because no one knows where the result was come from and from which element the result was searched from.
 
 Otherwise, if there's only on element in the set, `.findOne()` and `.find().eq(0)` don't perform much different
 
 The conclusion is:
 1. You'd better not use `.find().eq(0)` with a set of elements;
 2. $.findOne() and .findOne() could be removed
 
 2012-09-03  Kael:
 - fix a bug about $.one, due to the weird treatment of array.splice in IE6-8
 
 2012-07-27  Kael:
 - refractor
 
 
 
 */