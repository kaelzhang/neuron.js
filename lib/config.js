// Manage configurations
// It is not the core functionalities of neuron, since this module.

// Never use `location.hash` to store configurations.
// Evil guys may use that to obtain user private informations or execute authorized commands
//      by using hash configurations to inject remote modules and sending these urls to
//      the other users

function configInCookie(){
    var match = DOC.cookie.match(/(?:^|;)\s*neuron=([^;]*)/);
    return match ? parseQuery(match[1]) : {};
}

// 'base=localhost'
function parseQuery(str){
    var obj = {};

    decodeURIComponent(str).split(',').forEach(function(key_value) {
        var pair = key_value.split('=');
        obj[pair[0]] = pair[1];
    });

    return obj;
}


var neuron_script = DOC.getElementById('neuron-js');


// Get a certain configuration by key name from the script node
// <script src="/dist/neuron.js" id="neuron-js" 
//      data-path="mod" 
//      data-server="localhost"
// ></script>
function configOnScriptNodeByKey(key) {
    return neuron_script.getAttribute('data-' + key);
}


function configByDefault() {
    var src = neuron_script.src;
    var index = src.indexOf('neuron');
    var base = src.substr(index);

    return {
        base: base,
        ns: ''
    };
}


function combineConfig(){
    var conf = configByDefault();
    var cookie_conf = configInCookie();

    Object.keys(CONF_ATTRIBUTES).forEach(function(key) {
        var checker;

        // Priority:
        // cookie > script attributes > default
        if( 
            (key in cookie_conf) && 
            (
                // Cookie is not safe relatively, sometimes we need special checking 
                !(checker = CONF_ATTRIBUTES[key].C) ||
                checker(cookie_conf[key])
            )
        ){
            conf[key] = cookie_conf[key];

        }else{
            var value = configOnScriptNodeByKey(key);

            if( value === '' || value === null ){
                value = conf[key];
            }

            conf[key] = value;
        }
    });

    return conf;
}


var neuron_loaded = [];
var NEURON_CONF = {
    loaded: neuron_loaded
};

var LOCALHOST = '://localhost'

var CONF_ATTRIBUTES = {

    // The server where loader will fetch modules from
    // if use `'localhost'` as `base`, switch on debug mode
    path: {

        // Setter function
        S: function(path) {
            if(~ path.indexOf(LOCALHOST)){
                NEURON_CONF.debug = true;
            }

            // remove ending slash(`/`)
            return path.replace(/\/+$/, '');
        },

        // Cookie checker
        C: function(path) {

            // For the sake of security, 
            // we only support to set path to '%://localhost%' in cookie.
            // If there's a XSS bug in a single page, 
            // attackers could use this cookie to redirect all javascript module to anything they want
            return ~ path.indexOf(LOCALHOST);
        }
    },

    // We don't allow this, just use facade configurations and manage it on your own
    // 'vars',
    // var: {
    // },

    // By default, the public methods of neuron will be exploded to global context.
    // But you can force neuron to mix certain methods to a certain namespace.
    // If the namespace is not exists, neuron will initialize it as an empty object.
    ns: {
        S: function(ns) {

            // ''       -> [window]
            // 'NR'     -> ['NR']       -> [window.NR]
            // 'NR,'    -> ['NR', '']   -> [window.NR, window]
            return typeof ns === 'string' ? ns.split('|').map(function(name) {
                return name && makeSureObject(ENV, name) || ENV;
            }) : ns;
        }
    },

    loaded: {
        S: function(loaded) {
            neuron_loaded.push.apply(neuron_loaded, splitIfNotArray(loaded));
        }
    },

    preload: {
        S: function(preload) {
            !NEURON_CONF.debug && splitIfNotArray(preload).forEach(loadJS);
        },

        // Loading javascript url from cookie is forbidden
        C: function() {
            return false;
        }
    }
};


// If is not an array, split it
// @returns {Array}
function splitIfNotArray(subject) {
    if(typeof subject === 'string'){
        return subject.split('|').filter(Boolean);

    }else{
        return makeArray(subject);
    }
}


function config(conf) {
    var key;
    var value;

    for(key in conf){
        if(key in CONF_ATTRIBUTES){
            value = CONF_ATTRIBUTES[key].S( conf[key] );
            if(value !== undefined){
                NEURON_CONF[key] = value;
            }
        }
    }
}

Loader.config = config;
config( combineConfig() );

function hasher(str){
    return str.length % 3 + 1;
}

// server: 'http://localhost/abc',
// -> http://localhost/abc/<relative>

// @param {string} relative relative module url
function absolutizeURL(relative) {
    return NEURON_CONF.path.replace( '{n}', hasher(relative) ) + '/' + relative;
};


// Generate absolute url of a certain id
// @param {string} id, standard identifier, such as '<name>@<version>'
function generateModuleURL(id){
    var info = id.split('@');

    if(!info[1]){
        info[1] = 'latest';
    }

    // 'a@0.1.0' -> 'a/0.1.0/a.js'
    var rel = info.join('/') + '/' + info[0] + '.js';

    return absolutizeURL(rel);
}


// Load the script file of a module into the current document
// @param {string} id module identifier
function loadByModule(id) {
    if(! ~ neuron_loaded.indexOf(id) ){
        neuron_loaded.push(id);
        loadJS( generateModuleURL(id) );
    }
}


Loader.on('use', function(e) {
    !e.defined && loadByModule(e.mod.id);
});

