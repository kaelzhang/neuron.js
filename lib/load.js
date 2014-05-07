// The logic to load the javascript file of a package
// NOTICE that this is NOT part of neuron core

// server: 'http://localhost/abc',
// -> http://localhost/abc/<relative>
// @param {string} relative relative module url
function absolutizeURL(pathname) {
  var base = NEURON_CONF.path;
  if (!base) {
    err('config.path must be specified');
  }

  base = base.replace('{n}', pathname.length % 3 + 1);

  return pathResolve(base, pathname);
}


// This function should be defined with neuron.config({combo: fn})
// neuron.conf.combo = 
// function generateComboURL (mods) {
//     return '../concat/' + mods.map(function (mod) {
//         return '~mod~' + (mod.pkg + '/' + mod.name).replace(/\/|@/g, '~') + '.js';
//     }).join(',');
// }


// Scenarios:
// 1. facade('a/path');
// -> load a/path -> always
// 2. facade('a');
// -> load a.main
// 3. require('a');
// -> deps on a
// 4. require('./path')
// -> deps on a
// 5. require.async('a')
// -> load a.main -> 
// 6. require.async('./path')
// -> load a/path
// 7. require.async('b/path'): the entry of a foreign module
// -> forbidden: set `package.final` as true

var pkgs = [];

// Load the script file of a module into the current document
// @param {string} id module identifier
function loadByModule(mod) {
  if (mod.l) {
    return;
  }

  // flag to mark the status that a module has already been loaded
  mod.l = true;

  var isFacade = mod.f;
  var isAsync = mod.a;
  var pkg = mod.pkg;

  // if one of the current package's entries has already been loaded,
  // and if the current module is not an entry(facade or async)
  if (~pkgs.indexOf(pkg)) {
    if (!isFacade && !isAsync) {
      return;
    }    
  } else {
    pkgs.push(pkg);
  }

  var loaded = NEURON_CONF.loaded;
  var pathname;

  // is facade ?
  var evidence = isFacade
    // if a facade is loaded, we will push `mod.id` of the facade into `loaded`
    ? mod.id
    : pkg;

  if (~loaded.indexOf(evidence)) {
    // If the main entrance of the package is already loaded 
    // and the current module is not an async module, skip loading.
    // see: declaration of `require.async`
    if (isAsync) {
      pathname = generateModulePathname(mod);
    } else {
      return;
    }

    // load packages
  } else {
    var combine = NEURON_CONF.combo;

    if (combine) {
      var modules = getAllUnloadedSyncDeps(
        mod.name, 
        mod.version, 

        // If is a facade, we should always load it by `mod.id` not `mod.pkg`
        isFacade && mod.path
      );

      if (modules.length > 1) {
        pathname = combine(modules);
      }

      // `getAllUnloadedSyncDeps` will push loaded.
    } else {
      loaded.push(evidence);
    }

    // If no combine configuration, or there's less than 2 packages,
    // load the package file directly
    pathname = pathname
      || generateModulePathname(mod);
  }

  loadJS(absolutizeURL(pathname));
}


function generateModulePathname(mod) {
  return moduleId2RelativeURLPath(
    mod.main
    // if is a main module, we will load the source file by package

    // 1.
    // on use: 'a@1.0.0' (async or sync)
    // -> 'a/1.0.0/a.js'

    // 2.
    // on use: 'a@1.0.0/relative' (sync)
    // -> not an async module, so the module is already packaged inside:
    // -> 'a/1.0.0/a.js'
    ? mod.pkg + '/' + mod.name

    // if is an async module, we will load the source file by module id
    : mod.id
  );
}


// 'a@1.0.0/a' -> './a/1.0.0/a.js'
function moduleId2RelativeURLPath (id) {
  return './' + id.replace('@', '/') + (NEURON_CONF.ext || '.js');
}


neuron.on('use', function(e) {
  !e.defined && loadByModule(e.mod);
});