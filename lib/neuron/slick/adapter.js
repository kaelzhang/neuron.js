/**
 @adapter DOM Selector, providing basic functionalities of Selector Engine
 
 allowed methods: (currently)
 
 1. S.find(selector, context = document, first)
 finds a set of matching elements, always return an array
 
 always return {Array.<DOMElement>} !important !!!!!!!!!!!!!!
 
 2. S.contains(context, selector)
 returns {boolean}
 
 3. S.match(element, selector)
 returns {boolean}
 
 4. S.uid(element)
 returns {number} the uid of the element
 
 // TEMP!
 5. S.parse(selector)
 returns {Object} selector object
 
 
 arguments:
     context {DOMElement|DOMDocument|Array.<DOMElement>}
     first {boolean} only get the first match of the selector
     selector {string}
     element {DOMElement|DOMDocument}
     
 within the Neuron Framework, using methods of KM.S besides the above is forbidden
 
 */
 
;(function(K){

// Store Slick in closure
var 

atom = K._,

Slick = K.Slick;

 
// adapter for Slick
K.S = {
    find: function(selector, context, append, first){
        context || (context = document);
    
        if(context._ !== atom){
            context = K.makeArray(context);
        }
        
        
        // TODO:
        // selector support Neuron DOM Objects
        
        // if `selector` is an instance of KM.DOM    
        // if(selector._ === atom){
        //    selector = selector.get(0);
        // }
        
        append || (append = []);
        
        if(selector){
            var context_length = context.length,
                i = 0,
                found,
                c,
                slick = Slick;
        
            for(; i < context_length; i ++){
                c = context[i];
                
                // if only get first matched element
                if(first){
                    found = slick.find(c, selector);
                    
                    // if found stop searching
                    if(found){
                        append[0] = found;
                        break;
                    }
                }else{
                    found = slick.search(c, selector);
                    K._pushUnique(append, found);
                }
            }
        }
        
        // always return an array
        return append;
    },
    
    contains    : Slick.contains,
    match       : Slick.match,
    parse       : Slick.parse,
    uid         : Slick.uidOf
};

})(KM);


/**

// adapter for Sizzle







*/