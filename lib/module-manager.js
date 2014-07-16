// ## Neuron Core: Module Manager
//////////////////////////////////////////////////////////////////////

// ## CommonJS
// Neuron 3.x or newer is not the implementation of any CommonJs proposals
// but only [module/1.0](http://wiki.commonjs.org/wiki/Modules/1.0), one of the stable CommonJs standards.
// And by using neuron and [cortex](http://github.com/cortexjs/cortex), user could write module/1.0 modules.
// Just FORGET `define`.

// ## Naming Conventions of Variables
// All naming of variables should accord to this.

// Take `'a@1.0.0/relative'` for example:

// ### package 
// The package which the current module belongs to.
// - name or package name:  {string} package `name`: 'a'
// - package or package id: {string} contains package `name` and `version` and the splitter `'@'`. 
//   'a@1.0.0' for instance.

// ### module
// A package is consist of several module objects.
// - mod: {object} the module object. use `mod` instead of `module` to avoid confliction
// - id or module id: the descripter that contains package name, version, and path information
//      {string} for example, `'a@1.0.0/relative'` is a module id(entifier)

// ### version
// Package version: '1.0.0'

// ### main entry
// The module of a package that designed to be accessed from the outside


// map -> identifier: module
// Expose the object for debugging
// @expose
var mods = neuron.mods = {};


// Legacy
// Old neuron modules will not define a real resolved id.
// We determine the new version by `env.map`
// Since 6.2.0, actually, neuron will and should no longer add file extension arbitrarily,
// because `commonjs-walker@3.x` will do the require resolve during parsing stage.
// But old version of neuron did and will add a `config.ext` to the end of the file.
// So, if commonjs-walker does so, we adds a 
function legacy_transform_id (id, env) {
  return env.map
    ? id
    : id + '.js';
}





// Formally define a module with id,
// and dealing with the equivalent modules, merging registered callbacks.
function define_by_id (id, options) {
  var parsed = parse_module_id(id);

  // Legacy
  // in old times, main entry: 
  // - define(id_without_ext)
  // - define(pkg) <- even older
  // now, main entry: define(id_with_ext)
  if (parsed.p) {
    id = legacy_transform_id(id, options);
    parsed.p = legacy_transform_id(parsed.p, options);
  }

  var pkg = format_package_id(parsed);

  var mod = mods[id];
  if (!mod) {
    mod = create_module(parsed, id, pkg);
  }

  if (options.main) {
    // If define a main module,
    // `id === pkg` must be true 
    //    'a@1.2.9/index' is equivalent to 'a@1.2.9'
    // But mods[pkg] might exist
    var modMain = mods[pkg];

    if (modMain && modMain !== mod) {
      // Combine registered callbacks of `mods['a@1.2.9']`
      mod.c = mod.c.concat(modMain.c);
      // Clean
      modMain.c.length = 0;
    }
      
    mods[pkg] = mod;
  }

  return mod;
}


// cases:

// 1. calculate relative paths 
// 2. load modules

// ```
// 'a@0.0.1/b.js'
// -> define('a@0.0.1/b', ['./c'], factory, {main: true});
// if main entry is not 
// -> {
//     'a@0.0.1/b': mod_b,
//     'a@0.0.1': mod_b
// }
// -> 'a/0.0.1/a.js'

// 'a@0.0.1/c'
// -> define('a@0.0.1/c', [], factory, {});
// -> {
//     'a@0.0.1/c': mod_c
// }
// ```

// Get a module by id. 
// If not exists, a ghost module(which will be filled after its first `define`) will be created
// @param {string} id
// @param {Object} env the environment module, 
// @param {boolean} main whether is main module
// @param {boolean} strict whether is strict definition. if a module is not found, 
//   it will throw errors instead of creating a new module
function get_module_by_id(id, env, strict) {
  var notFound = "Cannot find module '" + id + "'";
  env || (env = {});

  // commonjs parser could not parse non-literal argument of `require`
  if (!id) {
    err('null id');
  }

  // {
  //   alias: {
  //     // id -> path
  //     './a' -> './a.js'
  //   }
  // }
  var map = env.map || {};
  id = map[id] || id;

  // Two kinds of id:
  // - relative module path
  // - package name
  // - a module with path loaded by facade or _use
  var parsed;
  var pkg;
  var relative = is_path_relative(id);

  // `env` exists, which means the module is accessed by requiring within another module.
  // `id` is something like '../abc'
  if (relative) {
    if (!env.id) {
      err(notFound);
    }

    // path_resolve('align', './abc') -> 'align/abc'
    id = path_resolve(env.id, id);

    // Legacy
    // If >= 6.2.0, there is always a map,
    // and a value of map is always a top level module id.
    // So, only if it is old wrappings, it would come here.
    // Besides, if not a relative id, we should not adds `'.js'` even it is an old wrapping.
    // How ever, we pass `env` to have a double check.
    id = legacy_transform_id(id, env);

    parsed = parse_module_id(id);
    pkg = format_package_id(parsed);

  // `id` is something like 'jquery'
  } else {
    // 1. id is a package name
    // 'jquery' -> 'jquery@~1.9.3'
    // 2. id may be is a package id
    // 'jquery@^1.9.3' -> 'jquery@^1.9.3'
    id = env.v && env.v[id] || id;
    // 'jquery' -> {n: 'jquery', v: '*', p: ''}
    // 'jquery@~1.9.3' -> {n: 'jquery', v: '~1.9.3', p: ''}
    parsed = parse_module_id(id);

    // We route a package of certain range to a specific version according to `config.tree`
    // so several modules may point to a same exports
    parsed.v = NEURON_CONF.r(parsed.v, parsed.n, env);
    pkg = format_package_id(parsed);
    id = pkg + parsed.p;
  }

  var mod = mods[id];
  if (!mod) {
    if (strict) {
      err(notFound);
    }
    mod = create_module(parsed, id, pkg);
  }

  return mod;
}


function ready (mod) {
  // execute pending callbacks and clean
  var callbacks = mod.c;
  // We might use the same method inside the previous, then `mod.c` will be `forEach()`d.
  // So we must clean the callbacks before they are called, 
  // or the callback of the latter `use` will never be called.
  // ```
  // _use(a, function () {
  //   _use(a, function (){});
  // });
  // ```
  delete mod.c;

  callbacks.forEach(function(c) {
    c(mod);
  });
  callbacks.length = 0;

  // never delete `mod.v`, coz `require` method might be executed after module factory executed
  // ```js
  // module.exports = {
  //    abc: function() {
  //        return require('b'); 
  //    }
  // }
  // ```
}


// @private
// create version info of the dependencies of current module into current sandbox
// @param {Array.<string>} modules no type detecting
// @param {Object} host

// ['a@~0.1.0', 'b@~2.3.9']
// -> 
// {
//     a: '~0.1.0',
//     b: '~2.3.9'
// }
function generate_module_version_map(modules, host) {
  modules.forEach(function(mod) {
    var name = mod.split('@')[0];
    host[name] = mod;
  });
}


// Generate the exports
// @param {Object} mod
function get_exports(mod) {
  // Since 6.0.0, neuron will not emit a "cyclic" event.
  // But, detecing static cyclic dependencies is a piece of cake for compilers, 
  // such as [cortex](http://github.com/cortexjs/cortex)
  var exports = mod.loaded
    ? mod.exports

    // #82: since 4.5.0, a module only initialize factory functions when `require()`d.
    // A single module might
    : generate_exports(mod);

  return exports;
}


function generate_exports (mod) {
  var exports = {};
  // @expose
  var module = {
    exports: exports
  };

  // # 85
  // Before module factory being invoked, mark the module as `loaded`
  // so we will not execute the factory function again.
  
  // `mod.loaded` indicates that a module has already been `require()`d
  // When there are cyclic dependencies, neuron will not fail.
  mod.loaded = true;
  var __filename = mod.p = absolutize_url(module_id_to_relative_url_path(mod.id));
  var __dirname = dirname(__filename);

  // to keep the object mod away from the executing context of factory,
  // use `factory` instead `mod.factory`,
  // preventing user from fetching runtime data by 'this'
  var factory = mod.factory;
  factory(create_require(mod), exports, module, __filename, __dirname);
  // delete mod.factory;

  // during the execution of `factory`, `module.exports` might be changed
  // exports:
  // TWO ways to define the exports of a module
  // 1. 
  // exports.method1 = method1;
  // exports.method2 = method2;

  // 2.
  // module.exports = {
  //        method1: method1,
  //        method2: method2
  // }

  // priority: 2 > 1
  return mod.exports = module.exports;
}


// function emit (mod, type) {
//   neuron.emit(type, {
//     mod: mod
//   });
// }

// module load
// ---------------------------------------------------------------------------------------------------

// @private
// @param {Array.<String>} dependencies
// @param {(function()} callback
// @param {Object} env Environment for cyclic detecting and generating the uri of child modules
// {
//     r: {string} the uri that its child dependent modules referring to
//     n: {string} namespace of the current module
// }
function load_dependencies(dependencies, callback, env) {
  var counter = dependencies.length;

  dependencies.forEach(function(id) {
    if (id) {
      var mod = get_module_by_id(id, env);
      register_module_load_callback(mod, function() {
        if (--counter === 0) {
          callback();

          // prevent memleak
          callback = NULL;
        }
      }, env);

      // Prevent bad dependencies
    } else {
      --counter;
    }
  });
}


function use_module (mod, callback) {
  register_module_load_callback(mod, function (mod) {
    callback(get_exports(mod));
  });
}


// provide a module
// method to provide a module
// @param {Object} mod
// @param {function()} callback
function register_module_load_callback(mod, callback) {
  if (!mod.c) {
    return callback(mod);
  }

  var length = mod.c.length;
  mod.c.push(callback);

  if (!mod.factory) {
    load_by_module(mod);
  } else {
    // If the module is required after `define()`d.
    !length && load_module_dependencies(mod);
  }
}


function load_module_dependencies (mod) {
  load_dependencies(mod.deps, function() {
    ready(mod);
  }, mod);
}


// Since 4.2.0, neuron would not allow to require an id with version
function test_require_id (id) {
  if (~id.indexOf('@')) {
    err("id with '@' is prohibited");
  }
}


// use the sandbox to specify the environment for every id that required in the current module 
// @param {Object} env The object of the current module.
// @return {function}
function create_require(env) {
  var require = function(id) {
    // `require('a@0.0.0')` is prohibited.
    test_require_id(id);

    var mod = get_module_by_id(id, env, true);
    return get_exports(mod);
  };

  // @param {string} id Module identifier. 
  // Since 4.2.0, we only allow to asynchronously load a single module
  require.async = function(id, callback) {
    if (callback) {
      // `require.async('a@0.0.0')` is prohibited
      test_require_id(id);
      var relative = is_path_relative(id);
      if (relative) {
        id = path_resolve(env.id, id);
        var entries = env.entries;
        id = entries
          ? test_entries(id, entries) 
            || test_entries(id + '.js', entries) 
            || test_entries(id + '.json', entries)
            || id
          : legacy_transform_id(id, env);
      }

      var mod = get_module_by_id(id, env);
      if (!mod.main) {
        if (relative) {
          // If user try to load a non-entry module, it will get a 404 response
          mod.a = true;
        } else {
          // We only allow to `require.async` main module or entries of the current package 
          return;
        }
      }

      use_module(mod, callback);
    }
  };

  // @param {string} path
  // @returns
  // - {string} if valid
  // - otherwise `undefined`
  require.resolve = function (path) {
    // NO, you should not do this:
    // `require.resolve('jquery')`
    // We only allow to resolve a relative path

    // Trying to load the resources of a foreign package is evil.
    if (is_path_relative(path)) {
      // Prevent leading `'/'`,
      // which will cause empty item of an array
      path = path_resolve(env.path.slice(1), path);

      // If user try to resolve a url outside the current package
      // it fails silently
      if (!~path.indexOf('../')) {
        return absolutize_url(
          module_id_to_relative_url_path(env.pkg + '/' + path)
        );
      }
    }
  };

  return require;
}


function test_entries (path, entries) {
  return ~entries.indexOf(path)
    ? path
    : NULL;
}


// Format package id 
function format_package_id(parsed) {
  return parsed.n + '@' + parsed.v;
}
