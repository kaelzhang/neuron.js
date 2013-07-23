// <script 
// src="http://localhost:8765/mod/neuronjs/2.0.1/neuron.js" 
// id="neuron-js" 
// data-path="mod"
// data-server="localhost:8765"
// ></script>

var DOC = document;
var HEAD = DOC.getElementsByTagName('head')[0];

var neuron_script = DOC.getElementById('neuron-js');

// '' -> 'mod/'
// 'mod' -> 'mod/'
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


var absolutizeURL = !server || path.indexOf('../') === 0 || path.indexOf('./') === 0 ?

    // if relative path, or no server specified
    // server: 'http://localhost', path: '../abc/'
    // -> ../abc/<rel>

    // server: undefined, path: 'abc/'
    // -> abc/<rel>
    function(rel) {
        return path + rel;
    } :

    // server: 'http://localhost',
    // path: 'abc/'
    // -> http://localhost/abc/<rel>
    function(rel) {
        return server.replace( '{n}', hasher(rel) ) + '/' + path + rel;
    };


// @param {string} id, standard identifier, such as '<name>@<version>'
function generateModuleURL(id){
    var info = id.split('@');
    var search = '';

    if(!info[1]){
        info[1] = 'latest';
        search = '?' + Date.now();
    }

    // 'a@0.1.0' -> 'a/0.1.0/a.js'
    var rel = info.join('/') + '/' + info[0] + '.js' + search;

    return absolutizeURL(rel);
}


// @param {boolean} check check if the module is already specified and loaded by the backend
function loadModuleAndSetTimout(id, check){
    ( !check || !checkIfAlreadyLoadedByServer(id) ) && loadJS( generateModuleURL(id) );

    if(!(id in retry_counters) ){
        retry_counters[id] = 1;
    }else{
        clearTimeout(retry_timers[id]);
    }

    if(retry_counters[id] ++ <= MAX_RETRY_TIMES){
        retry_timers[id] = setTimeout(function(){
            window.console && console.log('timeout load', id, 'retry');

            loadModuleAndSetTimout(id);

        }, RETRY_TIMEOUT);
    }
}

var module_list;

function checkIfAlreadyLoadedByServer(id){
    if(!module_list){
        module_list = getModuleList();
    }

    return module_list ? ~ module_list.indexOf(id) : false;
}


function getModuleList(){
    var container = DOC.getElementById('neuron-mods');

    if(container){
        return container.innerHTML.split(',').filter(Boolean);
    }
}


var retry_timers = {};
var retry_counters = {};

NR.Loader.on({
    use: function(e) {
        !e.defined && loadModuleAndSetTimout(e.mod.id, true);
    },

    define: function(e) {
        clearTimeout( retry_timers[e.mod.id] );
    }
});




