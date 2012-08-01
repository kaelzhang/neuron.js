/**
 * module  DOM/event
 */

;(function(K){

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


function removeDOMEvent(type, fn, useCapture){
    var el = this,
        storage = getStorage(el),
        remove = removeDOMEventByType,
        s;
        
    if(!storage){
        return;
    }
    
    if(fn){
        var index;
    
        s = storage[type];
        index = s ? s.fns.indexOf(fn) : -1;
        index !== -1 && remove(el, s, index, useCapture);
        
    }else{
        var types = type ?
                  storage[type] ? [type] : []
                  
                  // if type is undefined, get all types
                : Object.keys(storage),
                
            len = types.length,
            t;
        
        while(len --){
            t = types[len];     // type
            s = storage[t];     // storage
            
            s.fns.forEach(function(f, i){
                f && remove(el, s, i, useCapture);
            });
            
            s.fns.length = s.vals.length = 0;
            delete storage[t];
        }
    }
};


function removeDOMEventByType(el, storage, index, useCapture){
    
    // > If a listener was registered twice, one with capture and one without, 
    // > each must be removed separately.
    // ref: https://developer.mozilla.org/en/DOM/element.removeEventListener
    removeEvent(el, storage.base, storage.vals[index], useCapture);
    delete storage.fns[index];
    delete storage.vals[index];
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
    stop: function(){
        return this.stopBubble().prevent();
    },

    stopBubble: function(){
        var e = this.event, m = 'stopPropagation';
        e && ( e[m] ? e[m]() : (e.cancelBubble = true) );
        
        return this;
    },

    prevent: function(){
        var e = this.event, m = 'preventDefault';
        e && ( e[m] ? e[m]() : (e.returnValue = false) );
        
        return this;
    }
};


var DOM = K.DOM,
    SELECTOR = DOM.SELECTOR,
    storage  = DOM.__storage,
    feature  = DOM.feature,
    
    event_storage = (storage.events = {}),
    
    getCompactElement   = feature.compactEl,
    addEvent            = feature.addEvent,
    removeEvent         = feature.removeEvent,
    
    TRUE = true,
    
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
    var storage = event_storage[id];
    
    if(storage){
        K.each(storage, function(v, key){
            v.fns.length = v.vals.length = 0;
            delete this[key];
        });
    }
};
    

DOM.extend({

    /**
     * inspired by: Dean Edwards's addEvent lib
     * bind an event
     * @param {string} type
     * @param {function()} fn
     * @param {useOrigin} 
     */
    on: K._overloadSetter(function(type, fn, useCapture){
        var el = this,
            storage = getStorage(el),
            s = storage[type],
            fns,
            custom;
            
        if(!s){
            custom = Events[type];
        
            s = storage[type] = {
                
                // store the original fn use passed in
                fns: [], 
                
                // store the wrapped function
                vals: []
            };
            
            // based type
            s.base = custom && custom.base || type;
            
            // condition
            s.c = custom && custom.condition;
            
            // no events
            s.n = NO_EVENTS[real_type];
        }
        
        fns = s.fns;
        
        if(fns.indexOf(fn) !== -1){
            return;
        }
        fns.push(fn);
        
        
        var action,
            real_type = s.base;
        
        if(s.c){
            action = function(event){
                return s.c.call(this, event) ? fn.call(this, event) : true;
            };
            
        }else{
            action = fn;
        }

        var eventFn = s.n ?
            function(){
                return action.call(el);
            } :
            
            /**
             <code>
                $('abc').on('click', function(e){
                    // e && e.prevent();     // you never need to write any code like this
                    e.prevent();             // but directly use 'e'
                });
             </code>
             */
            function(event){
                event = new DOMEvent(event, getWindow(el), {type: type, base: real_type}); // TODO: getWindow
                if (action.call(el, event) === false){
                    event.stop();
                }
            };
            
        s.vals.push(eventFn);
        
        addEvent(el, real_type, eventFn, useCapture);
    }),
    
    
    /**
     * detach a event or events
     * .off()                                -> remove all
     * .off('click')                            -> remove all click
     * .off('click', fn)                        -> remove click method fn
     * .off({ click: fn, mouseenter: fn2 })    -> remove several events
     */
    off: K._overloadSetter(removeDOMEvent, true),
    
    
    /**
     * fire an event
     */
    fire: function(type){
        var el = this,
            storage = getStorage(el);
            
        if(storage[type]){
            storage[type].vals.forEach(function(fn){
                fn();
            });
        }
    }

}, 'iterator');


DOM.Event = DOMEvent;
DOM.Events = Events;


})(NR);

/**
 change log:
 
 2012-05-02  Kael:
 - fix mousewheel event for firefox
 
 2012-01-13  Kael:
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