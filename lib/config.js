// Manage configurations

// Never use `location.hash` to store configurations.
// Evil guys may use that to obtain user private informations or execute authorized commands
//      by using hash configurations to inject remote modules and sending these urls to
//      the other users

// @return {Object}
function getAllConfigFromCookie() {
  // neuron=path=localhost
  // a=3; neuron=path=localhost
  var match = DOC.cookie.match(/(?:^|;)\s*neuron=([^;]*)/);
  return match ? parseQuery(match[1]) : {};
}


// 'path=localhost,ext=.min.js' 
// -> { path: 'localhost', ext: '.min.js' }
// @param {!string} str The string of search query
function parseQuery(str) {
  var obj = {};

  decodeURIComponent(str).split(',').forEach(function(key_value) {
    var pair = key_value.split('=');
    obj[pair[0]] = pair[1];
  });

  return obj;
}


// Ref: [semver](http://semver.org/)
// note that we must use '\-' rather than '-', becase '-' presents a range within brackets
// @const
var REGEX_MATCH_SEMVER = /^(\D*)((\d+)\.(\d+))\.(\d+)([a-z0-9\.\-+]*)$/i;
//                       0  1   2 3      4       5    6              

// @return {Object} parsed semver object
function parseSemver(version) {
  if (Object(version) === version) {
    return version;
  }

  var ret = null;

  if (version) {
    ret = {
      origin: version
    };

    var match = version.match(REGEX_MATCH_SEMVER);

    // For example:
    // '~1.3.9-alpha/lang'
    if (match) {
      ret.decorator = match[1];

      // minor version
      // '1.3'
      ret.vminor = match[2];

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


function getBaseRange(version) {
  var parsed = parseSemver(version);
  return parsed.decorator ?
  // Only deal with ranges
  // '~1.2.3'     -> '~1.2.0'
  parsed.decorator + parsed.vminor + '.0' :

  // Do not transcribe explicit semver
  // '1.2.3'      -> '1.2.3'
  version;
}


// @return {false}
function returnFalse() {
  return false;
}


function justReturn(subject) {
  return subject;
}


// @const
var REGEX_IS_LOCALHOST = /^[a-z]+:\/\/localhost/;

var CONF_ATTRIBUTES = {

  // The server where loader will fetch modules from
  // if use `'localhost'` as `base`, switch on debug mode
  'path': {
    // Setter function
    S: function(path) {
      // Make sure 
      // - there's one and only one slash at the end
      // - `conf.path` is a directory 
      return path.replace(/\/*$/, '/');
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

  'loaded': {
    S: justReturn,
    C: returnFalse
  },

  'ranges': {
    S: function(map) {
      if (map) {
        NEURON_CONF.transform = rangeMapping;
        cleanRanges(map);
        range_map = map;
      }

      return map;
    },

    C: returnFalse
  },

  'ext': {
    S: justReturn
  },

  'depTree': {
    S: justReturn
  },

  'combo': {
    S: justReturn
  }
};


var CONF_ATTRIBUTE_LIST = Object.keys(CONF_ATTRIBUTES);
var range_map = {};

// This transformer will be used if any range map is specified and configured.
function rangeMapping(range, name) {
  // '~1.2.3' -> '~1.2.0'
  var base = getBaseRange(range);
  var ranges = range_map[name] || {};

  // Two purpose:
  // - map: range -> version
  // - globally control and inject the specified version
  return ranges[base] ||

  // if `range` is a normal version, or not specified, remain the origin.
  range;
}


function cleanRanges(ranges) {
  var name;

  for (name in ranges) {
    cleanRangeMap(ranges[name]);
  }
}


function cleanRangeMap(map) {
  var range;
  var key;

  for (range in map) {
    // '1.2.3'  -> '1.2.3'
    // '~1.2.3' -> '~1.2.0'
    // 'latest' -> 'latest'
    key = getBaseRange(range);
    if (!(key in map)) {
      map[key] = map[range];
    }
  }
}


var cookie_conf = getAllConfigFromCookie();

// Santitize cookie configurations
CONF_ATTRIBUTE_LIST.forEach(function(key) {
  var cookie_checker;

  if ( 
    (key in cookie_conf)
    && (cookie_checker = CONF_ATTRIBUTES[key].C)
    && !cookie_checker(cookie_conf[key])
  ) {
      delete cookie_conf[key];
  }
});


function config(conf) {
  mix(conf, cookie_conf);

  CONF_ATTRIBUTE_LIST.forEach(function(key) {
    if ( key in conf ) {
      var result = CONF_ATTRIBUTES[key].S(conf[key]);

      if (result !== undefined) {
        NEURON_CONF[key] = result;
      }
    }
  });
}


// @expose
neuron.config = config;

