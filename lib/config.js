// Manage configurations
//////////////////////////////////////////////////////////////////////

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
function tree_setter (tree) {
  if (tree) {
    mix(NEURON_CONF.tree, tree);
    NEURON_CONF.r = get_range_version;
  }
  return NEURON_CONF.tree;
}

// @param {string=} dependentVersion the version of dependent in current context
// @param {string=} dependentName the name of dependent in current context
// @returns {string}
function get_range_version (range, name, dependentVersion, dependentName) {
  var tree = NEURON_CONF.tree;

  // See the picture, a range may infer to more than one versions,
  // but the dependency of specific package only leads to a certain version.
  // However, entries and facades will not be depent by other packages,
  // that is why `tree._` exists.
  var dependent = dependentName 
    // global package
    ? merge_object_array(tree[dependentName] && tree[dependentName][dependentVersion])
    : tree._;

  // if the range is defined in the tree
  return dependent && dependent[name] && dependent[name][range]
    // If not found in range map, just use the range.
    // Actually, user might save explicit version of dependencies rather than ranges.
    || range;
}


// var neuron_loaded = [];
var NEURON_CONF = neuron.conf = {
  loaded: [],
  tree: {},
  // If `config.tree` is not specified, 
  r: justReturn
};


var SETTERS = {

  // The server where loader will fetch modules from
  // if use `'localhost'` as `base`, switch on debug mode
  'path': function(path) {
    // Make sure 
    // - there's one and only one slash at the end
    // - `conf.path` is a directory 
    return path.replace(/\/*$/, '/');
  },

  'loaded': justReturn,
  'tree': tree_setter,
  'combo': justReturn
};


function justReturn(subject) {
  return subject;
}


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
