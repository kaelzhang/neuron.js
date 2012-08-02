;(function(K){

var DOM = K.DOM,
    DOC = document;


DOM.create = function(fragment, attributes){
    if (attributes){
        if(attributes.checked != null){
            attributes.defaultChecked = attributes.checked;
        }
    }else{
        attributes = {};
    }
    
    return fragment ?
        DOM(
            DOC.createElement(
                DOM.feature.fragment(fragment, attributes)
            )
        ).attr(attributes) 
        
        : DOM();
};


})(NR);


/**
 
 change log:
 
 2012-06-22  Kael:
 - fixed a bug that if fragment not passed in, IE will create an unexpected DOMElement <undefined>
 
 */