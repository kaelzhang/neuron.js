;(function(K){


function alias(aliasKey, standardKey, noDeprecated){
    var proto = DOMInit.prototype,
        standard = proto[standardKey];
    
    proto[aliasKey] = function(){
        if(!noDeprecated && window.console){
            console.warn && console.warn(
            
                'WARNING: .' + aliasKey + '() method is deprecated, please use .' + standardKey + '() instead ASAP!'
                
            );
            
            // console.trace && console.trace();
        }
        
        return standard.apply(this, arguments);
    }
};

var

DOMInit = K.DOM._;


alias('all', 'find');
alias('el', 'get');
// alias('contains', 'has');
alias('match', 'is');
// alias()




    
})(NR);