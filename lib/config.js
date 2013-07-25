// Manage configurations
// It is not the core functionalities of neuron, since this module.

// Never use `location.hash` to store configurations.
// Evil guys may use that to obtain user private informations or execute authorized commands
//      by using hash configurations to inject remote modules and sending these urls to
//      the other users

// #neuron/path=mod,server=http://localhost:8765,
function configInCookie(){
    var match = DOC.cookie.match(/(?:^|;)\s*neuron=([^;]*)/);
    return match ? parseQuery(match[1]) : {};
}


var QUERY_VALUE_CONVERT = {
    'false': false,
    'true': true
};


// 'a=b,c=1,
function parseQuery(str){
    var obj = {};

    decodeURIComponent(str).split(',').forEach(function(key_value) {
        var pair = key_value.split('=');
        var value = pair[1];
        obj[pair[0]] = value in QUERY_VALUE_CONVERT ? QUERY_VALUE_CONVERT[value] : value; 
    });

    return obj;
}


var neuron_script = DOC.getElementById('neuron-js');

var CONF_KEYS = [
    // The server where loader will fetch modules from
    'server', 
    // The path
    // 'path', 
    // By default, the public methods of neuron will be exploded to global context.
    // But you can force neuron to mix certain methods to a certain namespace.
    // If the namespace is not exists, neuron will initialize it as an empty object.
    'ns'
];


// <script src="/dist/neuron.js" id="neuron-js" 
//      data-path="mod" 
//      data-server="localhost"
// ></script>
function configOnScriptNode(key) {
    return neuron_script.getAttribute('data-' + key);
}


function combineConfig(){

    // cookie has the highest priority
    var conf = configInCookie();

    CONF_KEYS.forEach(function(key) {
        if( !(key in conf) ){
            conf[key] = configOnScriptNode(key);
        }
    });

    return conf;
}

var NEURON_CONF = combineConfig();
