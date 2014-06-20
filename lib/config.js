// Manage configurations
//////////////////////////////////////////////////////////////////////

// 'path=localhost,ext=.min.js' earc
// -> { path: 'localhost', ext: '.min.js' }
// @param {!string} str The string of sh query
function parseQuery(str) {
  var obj = {};

  decodeURIComponent(str).split(',').forEach(function(key_value) {
    var pair = key_value.split('=');
    obj[pair[0]] = pair[1];
  });

  return obj;
}


// var neuron_loaded = [];
var NEURON_CONF = neuron.conf = {
  loaded: [],

  // transform ranges to specific version or fake version
  r: getRangeBaseVersion,
  v: function (version) {
    var parsed = parseSemver(version);
    return [
      getRangeBaseVersion(version, parsed, '~'),
      getRangeBaseVersion(version, parsed, '^')
    ];
  }
};


// neuron#103
// ### without tree
// -> neuron use rough ranges
// If a module requires 
// - `a@~1.2.3` -> `a@1.2`
// - `a@^1.2.3` -> `a@1` 
// Then if `a@1.2.7` is defined, it will trigger `a@1.2` and `a@1`
// @param {string} range
// @param {Object=} parsed
// @param {string=} decorator
function getRangeBaseVersion (range, parsed, decorator) {
  parsed || (parsed = parseSemver(range));
  decorator || (decorator = parsed.d);
  return decorator
    ? decorator === '~'
      // '~1.2.9' -> '1.2'
      ? parsed.a + '.' + parsed.b
      // '^1.2.9' -> '1'
      : parsed.a
    // '1.2.9' -> '1.2.9'
    : range
}


// ### with tree
// -> neuron uses the range map
// `a@1.2.3` -> `a@1.2.7`
// The structure of the tree is like:
// ```
// <name>: {
//   <version>: {
//     // dependencies and async dependencies
//     <dep-name>: [
//       {
//         <sync-dep-range>: <sync-dep-version>
//         ...
//       },
//       {
//         <async-dep-range>: <async-dep-version>
//         ...
//       }
//     ]
//   }
// }
// ...
// ```
function treeSetter (tree) {
  NEURON_CONF.r = getRangeVersion;

  // If tree is defined, 
  NEURON_CONF.v = function () {
    return [];
  };
  return tree;
}

// @param {string=} dependentVersion the version of dependent in current context
// @param {string=} dependentName the name of dependent in current context
// @returns {string}
function getRangeVersion (range, name, dependentVersion, dependentName) {
  var tree = NEURON_CONF.tree;
  var dependent = dependentName
    // global package
    ? tree._
    : tree[dependentName] && tree[dependentName][dependentVersion];

  // if the range is defined in the tree
  return dependent && dependent[name] && dependent[name][range]
    // if not, fallback to fake version
    || getRangeBaseVersion(range);
}


// @return {false}
function returnFalse() {
  return false;
}

function justReturn(subject) {
  return subject;
}


// @const
// #81: We restricts protocol to 'http' and 'https', 
//    because if it is possible for webviews to define their own protocol, 
//    allowing to set `path` with custom protocol will be extremely dangerous
var REGEX_IS_LOCALHOST = /^(?:http|https)?\/\/localhost/;
var NORMAL_ATTRIBUTE = {
  S: justReturn,
  C: returnFalse
};

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

  'loaded': NORMAL_ATTRIBUTE,
  'tree': {
    S: treeSetter
  },
  'ext': {
    S: justReturn
  },
  'combo': NORMAL_ATTRIBUTE
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
