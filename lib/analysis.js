// ## Parses modules to combo
//////////////////////////////////////////////////////////////////////

// NEURON_CONF.tree
// {
//   "a": {
//     "1.2.3": [
//       // sync dependencies
//       {
//         "sync": {
//           "~3.0.0": "3.0.9"
//         }
//       },
//       // async dependencies
//       {
//         "async": {
//           "~2.1.2": "2.1.10"
//         }
//       }
//     ]
//   }
// }
function get_all_unloaded_sync_deps(name, version, path) {
  var found = [];

  var tree = NEURON_CONF.tree;
  if (tree) {
    // Parse dependencies
    parse_deps(name, version, found, path);
  }
  return found;
}


// - parse the dependency tree
// - get all dependencies of a package including recursive dependencies
// - filter out already loaded packages
// @param {Array} found
// @param {Array} loaded 
// @param {Object} tree
function parse_deps(name, version, found, path) {
  var pkg = name + '@' + version;
  var evidence = pkg + (path || '');
  var loaded = NEURON_CONF.loaded;
  
  if (!~loaded.indexOf(evidence)) {
    found.push({
      pkg: pkg,
      name: path || name,
      version: version
    });
    loaded.push(evidence);

    var sync_deps = get_sync_deps(name, version);
    var dep_name;
    var dep_ranges;
    var dep_range;

    // {
    //   "sync": {
    //     "~3.0.0": "3.0.9"
    //   }
    // }
    for (dep_name in sync_deps) {
      dep_ranges = sync_deps[dep_name];
      for (dep_range in dep_ranges) {
        // recursively
        parse_deps(dep_name, dep_ranges[dep_range], found);
      }
    }
  }
}


// Get the synchronous dependencies of a certain package
function get_sync_deps(name, version) {
  var tree = NEURON_CONF.tree;
  var versions = tree[name] || {};
  var deps = versions[version] || [];
  var sync = deps[0] || {};
  return sync;
}
