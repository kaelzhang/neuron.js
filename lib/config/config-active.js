var DOC = document;
var HEAD = DOC.getElementsByTagName('head')[0];


var neuron_script = DOC.getElementById('neuron-js');
var path = ( neuron_script.getAttribute('data-path') || 'mod' ).replace(/\/$/, '') + '/';
var server = neuron_script.getAttribute('data-server');
var RETRY_TIMEOUT = 3000;
var MAX_RETRY_TIMES = 3;

if(server){
    server = parseServer(server);
}

function parseServer(server){
    if(server.indexOf('://') === -1){
        server = 'http://' + server;
    }

    // remove ending '/'
    return server.replace(/\/$/, '');
}


function hasher(str){
    return str.length % 3 + 1;
}


function loadJS(src){
    var node = DOC.createElement('script');
    
    node.src = src;
    node.async = true;

    jsOnload(node, function() {
        HEAD.removeChild(node); 
    });

    HEAD.insertBefore(node, HEAD.firstChild);
}


var jsOnload = DOC.createElement('script').readyState ?
    
    /**
     * @param {DOMElement} node
     * @param {!function()} callback asset.js makes sure callback is not null
     */
    function(node, callback){
        node.onreadystatechange = function(){
            var rs = node.readyState;
            if (rs === 'loaded' || rs === 'complete'){
                node.onreadystatechange = null;
                
                callback.call(this);
            }
        };
    } :
    
    function(node, callback){
        node.addEventListener('load', callback, false);
    };


var absolutizeURL = !server || path.indexOf('../') !== 0 && path.indexOf('./') !== 0 ?

    // if relative path, or no server specified
    function(rel) {
        return path + rel;
    } :

    function(rel) {
        return server.replace( '{n}', hasher(rel) ) + '/' + path + rel;
    };


function generateModuleURL(id){
    var info = id.split('@');

    if(!info[1]){
        info[1] = 'latest';
    }

    var rel = info.join('/') + '/main.js';

    return absolutizeURL(rel);
}


function loadModuleAndSetTimout(id){
    loadJS( generateModuleURL(id) );

    if( retry_counters[id] > 0){
        console.log('timeout load', id);
    }

    if(!(id in retry_counters) ){
        retry_counters[id] = 1;
    }

    if(retry_counters[id] ++ <= MAX_RETRY_TIMES){
        retry_timers[id] = setTimeout(loadModuleAndSetTimout, RETRY_TIMEOUT);
    }
};


var retry_timers = {};
var retry_counters = {};

NR.Loader.on({
    use: function(e) {
        !e.fetched && loadModuleAndSetTimout(e.mod.id);
    },

    define: function(e) {
        clearTimeout( retry_timers[e.mod.id] );
    }
});




