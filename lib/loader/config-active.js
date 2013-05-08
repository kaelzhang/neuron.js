;(function(NR) {


var DOC = document;
var HEAD = DOC.getElementsByTagName('head')[0];


var neuron_script = DOC.getElementById('G_NR');
var path = ( neuron_script.getAttribute('data-path') || 'mod' ).replace(/^\/|\/$/, '') + '/';
var server = parseServer( neuron_script.getAttribute('data-server') || location.origin );


function parseServer(server){
    if(server.indexOf('://') === -1){
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
    var info = mod.id.split('@');

    if(!info[1]){
        info[1] = 'latest';
    }

    var rel = info.join('/') + '/main.js';

    return server.replace('{n}', hasher(rel) ) + '/' + path + rel;
}


NR.Loader.on({
    provide: function(mod) {
        loadJS( generateModuleURL(mod) );
    }
});


})(NR);




