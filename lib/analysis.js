// NEURON_CONF.depTree
// {
//     "a": {
//         "1.2.3": [
//             // sync dependencies
//             {
//                 "sync": "~3.0.0"
//             },
//             // async dependencies
//             {
//                 "async": "~2.1.2"
//             }
//         ]
//     }
// }
function getAllUnloadedSyncDeps (name, version) {
    var tree = NEURON_CONF.depTree || {};
    var loaded = NEURON_CONF.loaded;
    var found = [];

    // Parse dependencies
    parseDeps(name, version, found, loaded, tree);
    return found;
}


// - parse the dependency tree
// - get all dependencies of a package including recursive dependencies
// - filter out already loaded packages
// @param {Array} found
// @param {Array} loaded 
// @param {Object} tree
function parseDeps (name, version, found, loaded, tree) {
    var pkg = name + '@' + version;
    if ( !~ loaded.indexOf(pkg) ) {
        found.push(pkg);
        loaded.push(pkg);

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
function getSyncDeps (name, version, tree) {
    var versions = tree[name] || {};
    var deps = versions[version] || [];
    var sync = deps[0] || {};
    return sync;
}