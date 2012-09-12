;(function(K){


function alias(host, aliasKey, standardKey){
    var standard = host[standardKey];
    
    host[aliasKey] = function(){
        warn(aliasKey + '() method is deprecated, please use .' + standardKey + '() instead ASAP!');
        
        return standard.apply(this, arguments);
    }
};

var

DOMInit = K.DOM._,

dom_proto = DOMInit.prototype,
event_proto = K.DOM.Event.prototype,

warn = window.console && console.warn ? function(msg){
        console.warn('WARNING: ' + msg);
    } : function(){}


alias(dom_proto, 'all', 'find');
alias(dom_proto, 'el', 'get');
alias(dom_proto, 'match', 'is');

alias(event_proto, 'prevent', 'preventDefault');
alias(event_proto, 'stopBubble', 'stopPropagation');

K.DOM.extend({
    count: function(){
        warn('.count() method is deprecated, please use .length instead ASAP!');
        
        return this.length;
    }
});

event_proto.stop = function(){
    this.preventDefault().stopPropagation();
    
    warn('.stop() method is deprecated, please use .preventDefault() and .stopPropagation() instead ASAP!');
    
    return this;
};

    
})(NR);