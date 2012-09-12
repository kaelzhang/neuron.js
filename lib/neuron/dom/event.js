/**
 * module  DOM/event
 */

;(function(K){


// quickParse and quickMatch
// credits to jQuery (http://jquery.com/)

/**
 * @param {string} selector
 * @return {Array} parsed selector
 */
function quickParse(selector) {
    var quick = REGEX_MATCH_SIMPLE_SELECTOR.exec(selector);
    if ( quick ) {
        //   0  1    2   3
        // [ _, tag, id, class ]
        quick[1] = (quick[1] || '').toLowerCase();
        quick[3] = quick[3] && new RegExp( '(?:^|\\s)' + quick[3] + '(?:\\s|$)' );
    }
    return quick;
};

/**
 * the match method of CSS Selector Engine is inefficient
 * on most conditions, namely when the selector discribed with tagName, className or id,
 * we could match the selector very fast
 
 * @param {DOMElement} elem
 * @param {Array} m return value of quickParse
 * @return {boolean}
 */
function quickMatch(elem, m){
    var attrs = elem.attributes || {};
    return (
        (!m[1] || elem.nodeName.toLowerCase() === m[1]) &&
        (!m[2] || (attrs.id || {}).value === m[2]) &&
        (!m[3] || m[3].test( (attrs[ "class" ] || {}).value ))
    );
};


function getWindow(element){
    // window
    return 'setInterval' in element ? element
    
        // document
        : 'getElementById' in element ? element.window
            : element.ownerDocument.window;
};


function getStorage(el){
    var id = SELECTOR.uid(el);

    return event_storage[id] || (event_storage[id] = {});
}; 


// from jQuery
function checkRelatedTarget(event){
    var related = event.relatedTarget,
        el = this;
    
    // Firefox sometimes assigns relatedTarget a XUL element
    // which we cannot access the parentNode property of
    try{
        // Chrome does something similar, the parentNode property
        // can be accessed but is null.
        if ( related && related !== document && !related.parentNode ) {
            return;
        }

        // Traverse up the tree
        while ( related && related !== el ) {
            related = related.parentNode;
        }

        if ( related !== el ) {
            // handle event if we actually just moused on to a non sub-element
            return true;
        }
        
    }catch(e){}
    
    return;
};


/**
 * @param {string} type event type
 */
function createEventConfiguration(type){
    // @type {Object} special event configurations for a certain type
    var special = Events[type] || {},
        stack = [];
        
    K.mix(stack, {
        base        : special.base || type,
        condition   : special.condition,
        capture     : special.capture,
        live        : 0,
        n           : NO_EVENTS[type]
    });
    
    return stack;
};


/**
 * @this {DOMElement}
 * @param {}
 */
function dispatch(event, type){
    var el = this,
        storage = getStorage(el),
        handlers = storage[type];
    
    // avoid non-left-click bubbling in Firefox (#3861)
    // TODO:
    if (!handlers || !handlers.length){
        return;
    }
    
    var condition = handlers.condition,
        live = handlers.live,
        arg,
        cur,
        i, len, handler, selector;
        
    if(handlers.n){
        event = null;
        arg = [];
    
    // if current event has an event object
    }else{
        event = new DOMEvent(event, getWindow(el), {type: type, base: handlers.base});
        arg = [event];
    }
    
    // Each event handler might be removed during the execution of matched events. 
    // Once this situation occurs, we'll get a wrong iterator and array.length within the loop, 
    //  which might cause a fatal logic and runtime error.
    // So, clone a shadow copy of `handlers` to prevent these things
    handlers = handlers.slice(0);
    
    // delegate events needs element traversing which takes huge costs, 
    // so check them first 
    if(live && event && !(event.button && type === 'click')){
        for(cur = event.target; cur && cur !== el; cur = cur.parentNode){
            for(i = 0; i < live; i ++ ){
                handler = handlers[i];
                
                if(
                    // check if the element matches the selector
                    // if the selector is simple selector, we use quickMatch
                    // otherwise, use CSS Selector Engine instead
                    (handler.quick ? quickMatch(cur, handler.quick) : SELECTOR.match(cur, handler.selector) ) &&
                    
                    (!condition || condition.call(cur, event))
                ){
                    if(handler.fn.call(cur, event) === false){
                        event.preventDefault().stopPropagation();
                    };
                }
            }
        }
    }
    
    for(i = live, len = handlers.length; i < len; i ++){
        handler = handlers[i];

        if(!condition || condition.call(self, event)){
            // return false;
            if(handler.fn.apply(el, arg) === false){
                event && event.preventDefault().stopPropagation();
            }
        }
    }
    
    handlers.length = 0;
};

////////////////////////////////////////////////////////////////////////////////////////////////////
// Add Events
////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * .on()

 * inspired by: Dean Edwards's addEvent lib
 * bind an event
 * @param {string} type
 * @param {string} selector
 * @param {function()} fn

 * allow:
 * .on(type, fn)                  -> add an event
 * .on(type, selector, fn)        -> delegate an event
 * .on(type-map)                  -> add several events
 * .on(type-map, selector)        -> remove several live events
 
 * ignore:
 */
function overloadAddEventArguments(type, selector, fn){
    var el = this, undef,
        t;

    // arguments overloading >>>>>>>>>>>>>>>
    if(K.isString(type)){
    
        // .on(type, fn)
        if(K.isFunction(selector)){
            fn = selector;
            selector = undef;
            
        // .on(type, selector, fn)
        }else if(!K.isFunction(fn) || !K.isString(selector)){
            return;
        }
        
        addDOMEvent(el, type, selector, fn);
    
    // .on(type-map, selector)
    }else if(K.isObject(type)){
        if(!K.isString(selector) && arguments.length > 1){
            return;
        }
    
        for(t in type){
            K.isFunction(type[t]) && addDOMEvent(el, t, selector, type[t]);
        }
    }
    
    // else fail silently
};


/**
 * no type checking
 * @param {DOMElement} el
 * @param {string} type
 * @param {string=} selector (optional)
 * @param {function()} fn
 */
function addDOMEvent(el, type, selector, fn){
    var storage = getStorage(el),
        handlers = storage[type];

    // despite 
    if(!handlers){
        handlers = storage[type] = createEventConfiguration(type);
        
        handlers.handle = function(event){
        
            // type -> real event type
            dispatch.call(this, event, type);
        };
        
        // add a certain event type only once
        addEvent(el, handlers.base, handlers.handle, handlers.capture);
    }
    
    var handler = {
            fn: fn
        };
    
    if(selector){
        handler.selector = selector;
        handler.quick = quickParse(selector);
        
        // always add delegate events add the head of the handlers
        handlers.splice(handlers.live ++, 0, handler);
        
    }else{
        handlers.push(handler);
    }
};

////////////////////////////////////////////////////////////////////////////////////////////////////
// Remove Events
////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * detach a event or events:
 
 * normal:
 * .off()                                   -> remove all events, including live events
 * .off(type)                               -> remove all <type> events, include live <type> events
 * .off(type, fn)                           -> remove normal <type> event handler: fn
 * .off(type, selector)                     -> remove all delegated events which match the selector
 * .off(type, selector, fn)                 -> remove a live event handler
 * .off(type, '**')                         -> remove all live <type> events
 * .off(type, '**', fn)                     -> remove all live <type> events
 
 * .off(type-map)                           -> remove several events
 * .off(type-map, selector)                 -> remove several live events
 
 * allow, and no side effect
 * .off(type, fn, x)
 
 * ignore:
 * .off(type, x, x)
 * .off(type, x)
 * 
 * .off(x)
 * .off(x, x)
 * .off(x, x, x)
 * .off(x, selector, fn)
 * .off(x, selector)
 * .off(x, selector, x)
 * -----------> !type && len !== 0
 
 */
function overloadRemoveEventArguments(type, selector, fn){
    var el = this, 
        len = arguments.length,
        undef;
    
    // .off(object)
    // .off(object, selector)
    if(K.isObject(type)){
        var t;
        
        // ignore:
        // .off(object, undefined)              -> typeError
        // .off(object, <sth-not-an-array>)     -> typeError
        if(!K.isString(selector) && len > 1){
            return;
        }
        
        // allow:
        // .off(object)
        // .off(object, string)
        for(t in type){
            K.isFunction(type[t]) && removeDOMEvent(el, t, selector, type[t]);
        }
        
    }else{
        // if type is not a string, and there's arguments,
        // a typeError must occur:
        
        // ignore:
        // .off(x)
        // .off(x, <anything>)
        // .off(x, <anything>, <anything>)
        if(!K.isString(type) && len){
            return;
        }
        
        // if type is a string, arguments must be more than one
        // type -> String
        
        // allow
        // .off(string, function)
        // .off(string, function, <anything>)       -> <anything> has no side effect
        if(K.isFunction(selector)){
            fn = selector;
            selector = undef;
        
        // allow:
        // .off(string)
        // .off(string, string)
        // .off(string, string, function)
        }else if(!K.isString(selector)){
        
            // ignore:
            // .off(string, x, <anything>)          -> typeError
            // .off(string, x)                      -> typeError
            if(len > 1){
                return;
                
            // .off()
            // .off(string)
            }else{
                selector = false;
            }
            
        // ignore:
        // .off(type, selector, x)
        }else if(!K.isFunction(fn) && len > 2){
            return;
        }
        
        removeDOMEvent(el, type, selector, fn);
    }
};


/**
 * @private
 * @param {DOMElement} el
 * @param {string} type
 * @param {string|undefined|false} selector
    {string} only remove delegate event handlers who contain the selector
        specially, if `selector` is `'**'`, only remove delegate event handers, but skip matching the selector
    {undefined} won't remove delegate event handlers
    {false} remove both delegate event handers and normal event handlrs, and skip matching the selector
    
 * @param {function()|undefined} fn
    {function()} only remove the event handlers who contain fn
    {undefined} not match fn
 */
function removeDOMEvent(el, type, selector, fn){
    var storage = getStorage(el),
        remove = removeDOMEventByType,
        types = type ?
              storage[type] ? [type] : []
              
              // if type is undefined, get all types
            : Object.keys(storage),
        
        len = types.length,
        t, handlers, handler, undef,
        i;
        
    while(len --){
        t = types[len];
        handlers = storage[t];
        i = 0;
        
        // use `for`-loop for better performance (instead of `while`-loop)
        for(; i < handlers.length; i ++){
            handler = handlers[i];
            
            // >> delegate handler:
            //  - selector
            //  - fn
            
            // >> normal handler:
            //  - fn
            
            if(
                // match fn
                (!fn || handler.fn === fn)
                && (
                    handler.selector && (
                        selector === false || selector === STR_WILD_SELECTORS || selector === handler.selector
                    )
                    
                    // reduce handlers.live
                    && handlers.live --
                    
                    || !handler.selector && (
                        selector === undef || selector === false
                    )
                )
            ){
                handlers.splice(i --, 1);
            }    
        }
        
        if(!handlers.length){
            removeEvent(el, handlers.base, handlers.handle, handlers.capture);
            delete storage[type];
        }
    }
};


function removeDOMEventByType(el, storage, index, useCapture){
    
    // > If a listener was registered twice, one with capture and one without, 
    // > each must be removed separately.
    // ref: https://developer.mozilla.org/en/DOM/element.removeEventListener
    
};


/**
 * create an adapter and the mock object for native Event object
 * @constructor
 * @param {Event} event native Event instance
 * @param {Window} win
 * @param {Object} config
 */
function DOMEvent(event, win, config){
    if(event instanceof DOMEvent){
        return event;
        
    }else if(!event){
        return;
    }

    win || (win = K.__HOST);
    event || (event = win.event);
    config || (config = {});
    
    var self    = this,
        type    = self.type     = config.type || event.type,
        real    = self.base     = config.base || type,
        target  = self.target   = event.target || event.srcElement,
        page    = self.page     = {},
        client  = self.client   = {},
        NULL    = null,
        related,
        doc,
        touch;
        
    self.event = event;
    
    K.mix(self, event, true, ['shiftKey', 'ctrlKey', 'altKey', 'metaKey']);
        
    while (target && target.nodeType == 3){
        target = target.parentNode;
    }

    if (real.indexOf('key') !== -1){
        // TODO:
        // test function keys, on macosx and win
        self.code = event.which || event.keyCode;
        
    } else if (real === 'click' || real === 'dblclick' || real === 'contextmenu' || /mouse/i.test(real) ){
        doc = getCompactElement(win.document);
        
        page.x = event.pageX != NULL ? event.pageX : event.clientX + doc.scrollLeft;
        page.y = event.pageY != NULL ? event.pageY : event.clientY + doc.scrollTop;
        
        client.x = event.pageX != NULL ? event.pageX - win.pageXOffset : event.clientX;
        client.y = event.pageY != NULL ? event.pageY - win.pageYOffset : event.clientY;
        
        if (real === 'DOMMouseScroll' || real === 'mousewheel'){
            self.wheel = (event.wheelDelta) ? event.wheelDelta / 120 : - (event.detail || 0) / 3;
        }
        
        self.rightClick = (event.which == 3) || (event.button == 2);
        
        if (real == 'mouseover' || real == 'mouseout'){
            related = event.relatedTarget || event[(real == 'mouseover' ? 'from' : 'to') + 'Element'];
            
            while (related && related.nodeType == 3){
                related = related.parentNode;
            }
            
            self.relatedTarget = related;
        }
                
    } else if ((/^(?:gesture|touch)/i).test(real)){
        K.mix(self, event, true, ['rotation', 'scale', 'targetTouches', 'changedTouches', 'touches']);
    
        touch = self.touches && self.touches[0];
        
        if (touch){
            page.x = touch.pageX;
            page.y = touch.pageY;
            client.x = touch.clientX; 
            client.y = touch.clientY;
        }
    }
};


DOMEvent.prototype = {
    stopPropagation: function(){
        var e = this.event, m = 'stopPropagation';
        e && ( e[m] ? e[m]() : (e.cancelBubble = true) );
        
        return this;
    },

    preventDefault: function(){
        var e = this.event, m = 'preventDefault';
        e && ( e[m] ? e[m]() : (e.returnValue = false) );
        
        return this;
    }
};


var 

DOM = K.DOM,
SELECTOR = DOM.SELECTOR,
storage  = DOM.__storage,
feature  = DOM.feature,

// from jQuery
REGEX_MATCH_SIMPLE_SELECTOR = /^(\w*)(?:#([\w\-]+))?(?:\.([\w\-]+))?$/,
STR_WILD_SELECTORS = '**',

event_storage = (storage.events = {}),

getCompactElement   = feature.compactEl,
addEvent            = feature.addEvent,
removeEvent         = feature.removeEvent,

TRUE = true,

is_eventListener_supported = !!window.addEventListener,

Events = {
    mouseenter: {
        base: 'mouseover',
        condition: checkRelatedTarget
    },
    
    mouseleave: {
        base: 'mouseout',
        condition: checkRelatedTarget
    },
    
    mousewheel: {
        base: K.UA.mozilla ? 'DOMMouseScroll' : 'mousewheel'
    },
    
    // ref: Focus Event Types
    // http://dev.w3.org/2006/webapi/DOM-Level-3-Events/html/DOM3-Events.html#events-focusevent
    focus: {
        base: 'focus' + (is_eventListener_supported ? '' : 'in'),
        
        // ref:
        // useCapture (addEventListener)
        // http://www.w3.org/TR/DOM-Level-3-Events/#event-flow
        capture: true
    },
    
    blur: {
        base: is_eventListener_supported ? 'blur' : 'focusout',
        capture: true
    }
},

NO_EVENTS = {
    unload: TRUE,
    beforeunload: TRUE,
    resize: TRUE,
    move: TRUE,
    DOMContentLoaded: TRUE,
    readystatechange: TRUE,
    error: TRUE,
    abort: TRUE,
    scroll: TRUE
};

// cleaner
event_storage._clean = function(id){
    /*
var storage = event_storage[id];
    
    if(storage){
        K.each(storage, function(v, key){
            v.fns.length = v.vals.length = 0;
            delete this[key];
        });
    }
*/
};
    

DOM.extend({
    on  : overloadAddEventArguments,
    off : overloadRemoveEventArguments //,
    
    /**
     * fire an event
     
    fire: function(type){
        var el = this,
            storage = getStorage(el);
            
        if(storage[type]){
            storage[type].vals.forEach(function(fn){
                fn();
            });
        }
    }
    */

}, 'iterator');

DOM.Event = DOMEvent;
DOM.Events = Events;


})(NR);

/**
 change log:
 
 2012-09-11  Kael:
 TODO:
 A. if user remove the current event handler when the handler function is executing, the loop will fail, example:
    
    var fn = function(){ el.off('click', fn); };
    el.on('click', fn).on('click', fn2);
    
 then, user clicked on `el`
 
 2012-08-04  Kael:
 - add delegate event support
 - improve stablility of funtion overloading of .off() method
 - fix a bug when trying to dispatch a live event
 
 Known issue:
 1. for sake of performance, duplicate event handlers are allowed, which means that you could bind an element with the same event type and the same handler more than once.
 
 2012-05-02  Kael:
 - fix mousewheel event for firefox
 
 2012-03-01  Kael:
 TODO:
 A. overload the setter of binding live events
 
 2012-01-30  Kael:
 - add more situations of arguments' overloading; delegate.off now could remove more than one events
 
 2012-01-13  Kael:
 - complete main functionalities of event deligation;
 - when mouseenter(or other imitated event) triggered, event.type will no longer be 'mouseover'(the event name that delegated to) but 'mouseenter' itself.
     <code>
         .on('mouseenter', function(e){
             e.type; // 'mouseenter'
             e.base; // 'mouseover'
         });
     </code>
 
 2012-01-12  Kael:
 - add the useCapture argument to .on and .off methods
 
 2011-10-11  Kael:
 - improve stability when there's no event object
 - fix a bug about no-event object events
 - add method .fire()
 
 TODO:
 A. focusin, focusout
 
 2011-10-06  Kael:
 TODO:
 A. refractor event module
 
 2011-09-10  Kael:
 - basic functionalities
 
 TODO:
 X A. fix onchange event of input elements


 */