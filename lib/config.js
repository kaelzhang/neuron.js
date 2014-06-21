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
    : range;
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


// var neuron_loaded = [];
var NEURON_CONF = neuron.conf = {
  loaded: [],
  ext: '.js',
  // transform ranges to specific version or fake version
  r: getRangeBaseVersion,
  i: function (version) {
    var parsed = parseSemver(version);
    return [
      getRangeBaseVersion(version, parsed, '~'),
      getRangeBaseVersion(version, parsed, '^')
    ];
  }
};


var SETTERS = {

  // The server where loader will fetch modules from
  // if use `'localhost'` as `base`, switch on debug mode
  path: function(path) {
    // Make sure 
    // - there's one and only one slash at the end
    // - `conf.path` is a directory 
    return path.replace(/\/*$/, '/');
  },

  // We don't allow this, just use facade configurations and manage it on your own
  // 'vars',
  // var: {
  // },

  'loaded': justReturn,
  'tree': treeSetter,
  'ext': justReturn,
  'combo': justReturn
};


function config(conf) {
  var key;
  var setter;
  for (key in conf) {
    setter = SETTERS[key];
    if (setter) {
      NEURON_CONF[key] = setter(conf[key]);
    }
  }
}

// @expose
neuron.config = config;
