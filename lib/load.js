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
function load_by_module (mod) {
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

  load_js(module_to_absolute_url(mod));
}


function module_to_absolute_url (mod) {
  var id = mod.main
    // if is a main module, we will load the source file by package
    // neuron-builder will always build the main entry file
    //   as a javascript file with the '.js' extension

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

  return NEURON_CONF.resolve(id);
}


// ## Graph Isomorphism and Dependency resolving
//////////////////////////////////////////////////////////////////////

// ### module.defined <==> module.factory
// Indicates that a module is defined, but its dependencies might not defined. 

// ### module.ready
// Indicates that a module is ready to be `require()`d which may occurs in two cases
// - A module is defined but has no dependencies
// - A module is defined, and its dependencies are defined, ready or loaded

// ### module.loaded
// Indicates that module.exports has already been generated

// Register the ready callback for a module, and recursively prepares
// @param {Object} module
// @param {function()} callback
// @param {Array=} stack
function ready (module, callback, stack) {
  if (!module.factory) {
    return load_module(module, function () {
      ready(module, callback, stack);
    });
  }

  var deps = module.deps;
  var counter = deps.length;

  var callbacks = module.r;
  // `module.r` is `[]` in origin.
  // `!callbacks` means the module is ready
  if (!counter || !callbacks) {
    module.r = FALSE;
    return callback();
  }

  callbacks.push(callback);
  // if already registered, skip checking
  if (callbacks.length > 1) {
    return;
  }

  var cb = function () {
    if (!-- counter) {
      stack.length = 0;
      stack = NULL;
      run_callbacks(module, 'r');
    }
  };

  stack = stack
    ? [module].concat(stack)
    : [module];

  deps.forEach(function (dep) {
    var child = get_module(dep, module);
    // If the child is already in the stack,
    // which means there might be cyclic dependency, skip it.
    if (~stack.indexOf(child)) {
      return cb();
    }
    ready(child, cb, stack);
  });
}
