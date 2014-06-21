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
function getAllUnloadedSyncDeps(name, version, mod) {
  var tree = NEURON_CONF.tree || {};
  var loaded = NEURON_CONF.loaded;
  var found = [];

  // Parse dependencies
  parseDeps(name, version, found, loaded, tree, mod);
  return found;
}


// - parse the dependency tree
// - get all dependencies of a package including recursive dependencies
// - filter out already loaded packages
// @param {Array} found
// @param {Array} loaded 
// @param {Object} tree
function parseDeps(name, version, found, loaded, tree, path) {
  var pkg = name + '@' + version;
  var evidence = pkg + (path || '');
  
  if (!~loaded.indexOf(evidence)) {
    found.push({
      pkg: pkg,
      name: path || name,
      version: version
    });
    loaded.push(evidence);

    var sync_deps = getSyncDeps(name, version, tree);
    var dep_name;
    var dep_version;

    for (dep_name in sync_deps) {
      dep_version = NEURON_CONF.transform(sync_deps[dep_name], dep_name);
      // recursively
      parseDeps(dep_name, dep_version, found, loaded, tree);
    }
  }
}


// Get the synchronous dependencies of a certain package
function getSyncDeps(name, version, tree) {
  var versions = tree[name] || {};
  var deps = versions[version] || [];
  var sync = deps[0] || {};
  return sync;
}
