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


// Ref: [semver](http://semver.org/)
// note that we must use '\-' rather than '-', becase '-' presents a range within brackets
var REGEX_MATCH_SERVER = /^(\D*)((\d+)\.(\d+))\.(\d+)([a-z0-9\.\-+]*)$/i;
//                       0  1   2 3      4       5    6              

// @returns {Object} parsed semver object
function parseSemver (version) {
    if ( Object(version) === version ) {
        return version;
    }

    var ret = null;

    if ( version ) {
        ret = {
            origin: version
        };

        var match = version.match(REGEX_MATCH_SERVER);
    
        // For example:
        // '~1.3.9-alpha/lang'
        if ( match ) {
            ret.decorator = match[1];

            // minor version
            // '1.3'
            ret.vminor  = match[2];

            // ret.major = match[3];
            // ret.minor = match[4];
            // ret.patch = match[5];

            // // version.extra contains `-<pre-release>+<build>`
            // ret.extra = match[6];
        }
    }

    return ret;
}


// var neuron_loaded = [];
var NEURON_CONF = loader.conf = {
    loaded: [],

    // By default, we only cook ranges
    transform: getBaseRange
};


function getBaseRange (version){
    var parsed = parseSemver(version);
    return parsed.decorator ? 
        // '~1.2.3'     -> '~1.2.0'
        parsed.decorator + parsed.vminor + '.0' :
        // '1.2.3'      -> '1.2.3'
        version;
}


var LOCALHOST = '://localhost';

var CONF_ATTRIBUTES = {

    // The server where loader will fetch modules from
    // if use `'localhost'` as `base`, switch on debug mode
    path: {
        // Setter function
        S: function(path) {
            // if(~ path.indexOf(LOCALHOST)){
            //     NEURON_CONF.debug = true;
            // }

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
            ns = typeof ns === 'string' ? ns.split('|').map(function(name) {
                        return name && makeSureObject(ENV, name) || ENV;
                    }) : 
                    isArray(ns) ? ns :
                        [];

            // There should always be a `neuron` namespace
            if ( ! ~ ns.indexOf(neuron) ) {
                ns.push(neuron);
            }

            return ns;
        }
    },

    loaded: {
        S: function (loaded) {
            return NEURON_CONF.loaded.concat(loaded);
        },

        C: function (){
            return false;
        }
    },

    ranges: {
        S: function (map) {
            if ( map ) {
                NEURON_CONF.transform = rangeMapping;
                cleanRanges(map);
                range_map = map;
            }

            return map;
        },

        C: function(){
            return false
        }
    },

    ext: {
        S: function (compress) {
            return compress;
        }
    }
};


var range_map = {};

// This transformer will be used if any range map is specified and configured.
function rangeMapping (range, name) {
    var base = getBaseRange(range);
    var ranges = range_map[name] || {};
    return ranges[base] || 

        // if `range` is a normal version, or not specified, remain the origin.
        range;
}


function cleanRanges (ranges) {
    var name;

    for(name in ranges){
        cleanRangeMap(ranges[name]);
    }
}


// Suppose:

// package:
// {
//     "name": "a",
//     "dependencies": {
//         "b": "~1.2.3"
//     }
// }

// ranges: 
// {
//     "b": {
//         // actually there's something wrong with the data
//         "~1.2.4": "1.2.12"
//         clean -> "~1.2.0": "1.2.12"
//     }
// }

// 1. define("a", ["b@~1.2.3"], ...);
// 2. predefine "b@~1.2.3"
// 3. transform: "b@~1.2.3" -> "b@1.2.12".
// 4. define: "b@1.2.12", you must notice that 
//     if we haven't cleaned the ranges just now, we will get a "b@~1.2.3" defined
// 5. check whether "b@1.2.12" is loaded
function cleanRangeMap (map) {
    var range;
    var key;
    var parsed;

    for(range in map){
        // '1.2.3'  -> '1.2.3'
        // '~1.2.3' -> '~1.2.0'
        // 'latest' -> 'latest'
        key = getBaseRange(range);
        if ( !(key in map) ) {
            map[key] = map[range];
        }
    }
}


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

loader.config = config;
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
function generateModuleURL(mod){
    var rel = (
        mod.async && mod.path ? 
            // if is an async module, we will load the source file by module id
            mod.id : 

            // if is a normal module, we will load the source file by package
            
            // 1.
            // on use: 'a@1.0.0' (async or sync)
            // -> 'a/1.0.0/a.js'

            // 2.
            // on use: 'a@1.0.0/relative' (sync)
            // -> not an async module, so the module is already packaged inside:
            // -> 'a/1.0.0/a.js'
            mod.pkg + '/' + mod.name

    ).replace('@', '/') + (NEURON_CONF.ext || '.js');

    return absolutizeURL(rel);
}


// Load the script file of a module into the current document
// @param {string} id module identifier
function loadByModule(mod) {
    var loaded = NEURON_CONF.loaded;
    // The whole package is not loaded
    if(! ~ loaded.indexOf(mod.pkg) ){
        loaded.push(mod.pkg);

    // If the main entrance of the package is already loaded 
    // and the current module is not an async module, skip loading.
    } else if ( !mod.async ) {
        return;
    }

    neuron._load( generateModuleURL(mod) );
}


loader.on('use', function(e) {
    !e.defined && loadByModule(e.mod);
});

