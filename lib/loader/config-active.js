;(function(NR) {


var DOC = document;
var HEAD = DOC.getElementsByTagName('head')[0];


var neuron_script = DOC.getElementById('G_NR');
var base = ( neuron_script.getAttribute('data-base') || 'mod' ).replace(/^\/|\/$/, '') + '/';
var server = parseServer( neuron_script.getAttribute('data-server') || location.origin );


function parseServer(server){
    if(server.indexOf('://') !== -1){
        server = 'http://' + server;
    }

    return server.replace(/\/$/, '');
};


function hasher(str){
    return str.length % 3 + 1;
};


function loadJS(src){
    var node = DOC.createElement('script');
    
    node.src = src;
    node.async = true;

    HEAD.insertBefore(node, HEAD.firstChild);
}


function generateModuleURL(mod){
    var path = mod.id.replace('@', '/') + '/main.js';

    return server.replace('{n}', hasher(path) ) + '/' + base + path;
}


NR.Loader.on({
    provide: function(mod) {
        loadJS( generateModuleURL(mod) );
    }
});


})(NR);