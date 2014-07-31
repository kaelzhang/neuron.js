// The logic to load the javascript file of a package
//////////////////////////////////////////////////////////////////////


function load_module (module, callback) {
  var mod = mods[module.id];
  mod.f = module.f;
  mod.a = module.a;
  var callbacks = mod.l;
  if (callbacks) {
    callbacks.push(callback);
    if (callbacks.length < 2) {
      load_by_module(mod);
    }
  }
}

// server: 'http://localhost/abc',
// -> http://localhost/abc/<relative>
// @param {string} relative relative module url
function absolutize_url(pathname) {
  var base = NEURON_CONF.path;
  base || err('config.path must be specified');
  base = base.replace('{n}', pathname.length % 3 + 1);

  pathname += NEURON_CONF.cache === false
    ? '?f=' + timestamp
    : '';

  return path_resolve(base, pathname);
}


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
// -> forbidden

var pkgs = [];

// Load the script file of a module into the current document
// @param {string} id module identifier
function load_by_module(mod) {
  if (mod.d) {
    return;
  }

  // (D)ownloaded
  // flag to mark the status that a module has already been downloaded
  mod.d = true;

  var isFacade = mod.f;
  var isAsync = mod.a;
  var pkg = mod.k;

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
  // is facade ?
  var evidence = isFacade
    // if a facade is loaded, we will push `mod.id` of the facade instead of package id
    // into `loaded`
    ? mod.id
    : pkg;

  if (~loaded.indexOf(evidence)) {
    if (!isAsync) {
      // If the main entrance of the package is already loaded 
      // and the current module is not an async module, skip loading.
      // see: declaration of `require.async`
      return;
    }

    // load packages
  } else {
    loaded.push(evidence);
  }

  var pathname = generate_module_pathname(mod);
  load_js(absolutize_url(pathname));
}


function generate_module_pathname(mod) {
  var id = mod.main
    // if is a main module, we will load the source file by package

    // 1.
    // on use: 'a@1.0.0' (async or sync)
    // -> 'a/1.0.0/a.js'

    // 2.
    // on use: 'a@1.0.0/relative' (sync)
    // -> not an async module, so the module is already packaged inside:
    // -> 'a/1.0.0/a.js'
    ? mod.k + '/' + mod.n + '.js'

    // if is an async module, we will load the source file by module id
    : mod.id;

  return module_id_to_relative_url_path(id);
}


// 'a@1.0.0/a' -> './a/1.0.0/a.js'
function module_id_to_relative_url_path (id) {
  return './' + id.replace('@', '/');
}
