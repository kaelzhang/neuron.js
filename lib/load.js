
// Simply rotate cdn server name.
function hasher(str){
    return str.length % 3 + 1;
}


// server: 'http://localhost/abc',
// -> http://localhost/abc/<relative>

// @param {string} relative relative module url
function absolutizeURL(relative) {
    var path = NEURON_CONF.path;
    if ( !path ) {
        throw new Error('neuron: config.path must be specified');
    }

    return path.replace( '{n}', hasher(relative) ) + '/' + relative;
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

    loadJS( generateModuleURL(mod) );
}


neuron.on('use', function(e) {
    !e.defined && loadByModule(e.mod);
});

