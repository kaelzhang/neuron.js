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

// ### shadow module and module
// A single module may have different contexts and runtime results
// - mod: the original module definition, including factory function, dependencies and so on
// - module: the shadow module, which is inherited from `mod`

////////////////////////////////////////////////////////////////////////////////////////////////


// Parse an id within an environment, and do range mapping, resolving, applying aliases.
// Returns {Object} parsed object
// @param {string} id
// @param {Object=} env the environment module
function parse_id (id, env) {
  var origin = id;

  // commonjs parser could not parse non-literal argument of `require`
  // So, users might pass a null value into `require()`
  id || err('null id');

  env || (env = {});
  var map = env.map || {};

  // 3 kinds of id:
  // - relative module path
  // - package name
  // - a module with path loaded by `facade` or `neuron._use`

  // './a' -> 'module@1.0.0/a.js'
  // 'jquery' -> 'jquery'
  id = map[id] || id;

  // If the `id` is still a relative path,
  // there must be something wrong.
  // For most cases, 
  is_path_relative(id) && module_not_found(origin);

  // Adds version to a package name
  // 'jquery' -> 'jquery@^1.9.3'
  id = env.m && env.m[id] || id;

  // 'jquery' -> {n: 'jquery', v: '*', p: ''}
  // 'jquery@^1.9.3' -> {n: 'jquery', v: '^1.9.3', p: ''}
  var parsed = parse_module_id(id);
  
  if (parsed.k === env.k) {
    // if inside the same package of the parent module,
    // it uses a same sub graph of the package
    parsed.graph = env.graph;

  } else {
    // We route a package of certain range to a specific version according to `config.graph`
    // so several modules may point to a same exports
    // if is foreign module, we should parses the graph to the the sub graph
    // For more details about graph, see '../doc/graph.md'
    var sub_graph = get_sub_graph(parsed.k, env.graph) 
      // If sub_graph not found, set it as `[]`
      || [];
    parsed.graph = sub_graph;

    // If the range is not defined in the graph,
    // range will remain and not convert to version,
    // which indicate that loader might try to load a module 
    //   like 'jquery@^1.9.2'.
    // For most cases, it will not happen, 
    //   or the module that matches the range indeed does not exist.
    parsed.v = sub_graph[0] || parsed.v;
    format_parsed(parsed);
  }

  return parsed;
}


function get_sub_graph (pkg, graph) {
  var global_graph = NEURON_CONF.graph._;
  var deps = graph
    ? graph[1]
    // If `graph` is undefined, fallback to global_graph
    : global_graph;

  return deps && (pkg in deps)
    // `deps[pkg]` is the graph id for the subtle graph
    ? NEURON_CONF.graph[deps[pkg]]
    : global_graph;
}


// Get the exports
// @param {Object} module
function get_exports (module) {
  // Since 6.0.0, neuron will not emit a "cyclic" event.
  // But, detecing static cyclic dependencies is a piece of cake for compilers, 
  // such as [cortex](http://github.com/cortexjs/cortex)
  return module.loaded
    ? module.exports

    // #82: since 4.5.0, a module only initialize factory functions when `require()`d.
    : generate_exports(module);
}


// Generate the exports of the module
function generate_exports (module) {
  // # 85
  // Before module factory being invoked, mark the module as `loaded`
  // so we will not execute the factory function again.
  
  // `mod.loaded` indicates that a module has already been `require()`d
  // When there are cyclic dependencies, neuron will not fail.
  module.loaded = true;

  // During the execution of factory, 
  // the reference of `module.exports` might be changed.
  // But we still set the `module.exports` as `{}`, 
  // because the module might be `require()`d during the execution of factory 
  // if cyclic dependency occurs.
  var exports = module.exports = {};

  // TODO:
  // Calculate `filename` ahead of time
  var __filename
    // = module.filename 
    = NEURON_CONF.resolve(module.id);
  var __dirname = dirname(__filename);

  // to keep the object mod away from the executing context of factory,
  // use `factory` instead `mod.factory`,
  // preventing user from fetching runtime data by 'this'
  var factory = module.factory;
  factory(create_require(module), exports, module, __filename, __dirname);
  return module.exports;
}


// Get a shadow module or create a new one if not exists
// facade({ entry: 'a' })
function get_module (id, env, strict) {
  var parsed = parse_id(id, env);
  var graph = parsed.graph;
  var mod = get_mod(parsed);

  var real_id = mod.main
    // if is main module, then use `pkg` as `real_id`
    ? parsed.k
    : parsed.id;

  // `graph` is the list of modules for a certain package
  var module = graph[real_id];

  if (!module) {
    !strict || module_not_found(id);
    // So that `module` could be linked with a unique graph
    module = graph[real_id] = create_shadow_module(mod);
    module.graph = graph;
  }

  return module;
}


// @param {Object} module
// @param {function(exports)} callback
function use_module (module, callback) {
  ready(module, function () {
    callback(get_exports(module));
  });
}


// Create a mod
function get_mod (parsed) {
  var id = parsed.id;

  // id -> '@kael/a@1.1.0/b'
  return mods[id] || (mods[id] = {
    // package scope:  
    s: parsed.s,
    // package name: 'a'
    n: parsed.n,
    // package version: '1.1.0'
    v: parsed.v,
    // module path: '/b'
    p: parsed.p,
    // module id: 'a@1.1.0/b'
    id: id,
    // package id: 'a@1.1.0'
    k: parsed.k,
    // version map of the current module
    m: {},
    // loading queue
    l: [],
    // If no path, it must be a main entry.
    // Actually, it actually won't happen when defining a module
    main: !parsed.p
    // map: {Object} The map of aliases to real module id
  });
}


// @param {Object} mod Defined data of mod
function create_shadow_module (mod) {
  function F () {
    // callbacks
    this.r = [];
  }
  F.prototype = mod;
  return new F;
}


// Since 4.2.0, neuron would not allow to require an id with version
// TODO:
// for scoped packages
function prohibit_require_id_with_version (id) {
  !~id.indexOf('@') || err("id with '@' is prohibited");
}


// use the sandbox to specify the environment for every id that required in the current module 
// @param {Object} env The object of the current module.
// @return {function}
function create_require (env) {
  function require (id) {
    // `require('a@0.0.0')` is prohibited.
    prohibit_require_id_with_version(id);

    var module = get_module(id, env, true);
    return get_exports(module);
  }

  // @param {string} id Module identifier. 
  // Since 4.2.0, we only allow to asynchronously load a single module
  require.async = function(id, callback) {
    if (callback) {
      // `require.async('a@0.0.0')` is prohibited
      prohibit_require_id_with_version(id);
      var module = get_module(id, env);

      // If `require.async` a foreign module, it must be a main entry
      if (!module.main) {

        // Or it should be a module inside the current package
        if (module.n !== env.n) {
          // Otherwise, we will stop that.
          return;
        }
        module.a = true;
      }

      use_module(module, callback);
    }
  };

  // @param {string} path
  require.resolve = function (path) {
    return NEURON_CONF.resolve(parse_id(path, env).id);
  };

  return require;
}
