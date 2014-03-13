// Manage configurations
// It is not the core functionalities of neuron, since this module.

// Never use `location.hash` to store configurations.
// Evil guys may use that to obtain user private informations or execute authorized commands
//      by using hash configurations to inject remote modules and sending these urls to
//      the other users

function getAllConfigFromCookie(){
    // neuron=path=localhost
    // a=3; neuron=path=localhost
    var match = DOC.cookie.match(/(?:^|;)\s*neuron=([^;]*)/);
    return match ? parseQuery(match[1]) : {};
}

// 'path=localhost,ext=.min.js' 
// -> { path: 'localhost', ext: '.min.js' }
function parseQuery(str){
    var obj = {};

    decodeURIComponent(str).split(',').forEach(function(key_value) {
        var pair = key_value.split('=');
        obj[pair[0]] = pair[1];
    });

    return obj;
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
var NEURON_CONF = neuron.conf = {
    loaded: [],

    // By default, we only cook ranges
    transform: getBaseRange
};


function getBaseRange (version){
    var parsed = parseSemver(version);
    return parsed.decorator ? 
        // Only deal with ranges
        // '~1.2.3'     -> '~1.2.0'
        parsed.decorator + parsed.vminor + '.0' :

        // Do not transcribe explicit semver
        // '1.2.3'      -> '1.2.3'
        version;
}


function returnFalse(){
    return false;
}


var REGEX_IS_LOCALHOST = /^[a-z]+:\/\/localhost/;

var CONF_ATTRIBUTES = {

    // The server where loader will fetch modules from
    // if use `'localhost'` as `base`, switch on debug mode
    path: {
        // Setter function
        S: function(path) {
            // remove ending slash(`/`)
            return path.replace(/\/+$/, '');
        },

        // Cookie checker
        C: function(path) {

            // For the sake of security, 
            // we only support to set path to '%://localhost%' in cookie.
            // If there's a XSS bug in a single page, 
            // attackers could use this cookie to redirect all javascript module to anything they want
            return REGEX_IS_LOCALHOST.test(path);
        }
    },

    // We don't allow this, just use facade configurations and manage it on your own
    // 'vars',
    // var: {
    // },

    // By default, the public methods of neuron will be exploded to global context.
    // But you can force neuron to mix certain methods to a certain namespace.
    // If the namespace is not exists, neuron will initialize it as an empty object.
    // ns: {
    //     S: function(ns) {

    //         // ''       -> [window]
    //         // 'NR'     -> ['NR']       -> [window.NR]
    //         // 'NR,'    -> ['NR', '']   -> [window.NR, window]
    //         ns = typeof ns === 'string' 
    //             ? ns.split('|').map(function(name) {
    //                     return name && makeSureObject(ENV, name) || ENV;
    //                 })
    //             : isArray(ns) 
    //                 ? ns 
    //                 : [];

    //         // There should always be a `neuron` namespace
    //         if ( ! ~ ns.indexOf(neuron) ) {
    //             ns.push(neuron);
    //         }

    //         return ns;
    //     }
    // },

    loaded: {
        S: function (loaded) {
            return NEURON_CONF.loaded.concat(loaded);
        },

        C: returnFalse
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

        C: returnFalse
    },

    ext: {
        S: function (extension) {
            return extension;
        }
    }
};

var CONF_ATTRIBUTE_LIST = Object.keys(CONF_ATTRIBUTES);

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


// Might be called more than once
function config(conf) {
    var cookie_conf = getAllConfigFromCookie();

    CONF_ATTRIBUTE_LIST.forEach(function (key) {
        var attr = CONF_ATTRIBUTES[key];
        var cookie_checker = attr.C;
        var value = cookie_conf[key];
        var in_cookie = key in cookie_conf;
        var in_conf = key in conf;

        if ( !in_cookie && !in_conf ) {
            return;
        }
        
        if ( 
            // configs in cookie has higher priorities
            !in_cookie ||

            // Cookie is not safe relatively, sometimes we need special checking 
            cookie_checker && !cookie_checker(value)
        ){
            value = conf[key];
        }

        var result = attr.S(value);

        if ( result !== undefined ) {
            NEURON_CONF[key] = result;
        }
    });
}


var neuron_script = DOC.getElementById('neuron-js');

function getDefaultPath () {
    var src = neuron_script.src;
    var index = src.indexOf('neuron');
    var base = src.substr(index);

    return base;
}


function getAllConfigFromScriptNode () {
    var conf = {};
    CONF_ATTRIBUTE_LIST.forEach(function (key) {
        var value = getConfigOnScriptNodeByKey(key);
        if ( value !== '' && value !== null ) {
            conf[key] = value;
        }
    });

    conf.path = conf.path || getDefaultPath();

    return conf;
}


// Get a certain configuration by key name from the script node
// <script src="/dist/neuron.js" id="neuron-js" 
//      data-path="mod" 
//      data-server="localhost"
// ></script>
function getConfigOnScriptNodeByKey(key) {
    return neuron_script.getAttribute('data-' + key);
}


if ( neuron_script ) {
    config( getAllConfigFromScriptNode() );
}


neuron.config = config;

