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
function parse_id(id, env) {
  // commonjs parser could not parse non-literal argument of `require`
  id || err('null id');

  env || (env = {});
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
  var relative = is_path_relative(id);

  // `env` exists, which means the module is accessed by requiring within another module.
  // `id` is something like '../abc'
  if (relative) {
    env.id || module_not_found(id);

    id = resolve_id(id, env);

    // Legacy
    // If >= 6.2.0, there is always a map,
    // and a value of map is always a top level module id.
    // So, only if it is old wrappings, it would come here.
    // Besides, if not a relative id, we should not adds `'.js'` even it is an old wrapping.
    // How ever, we pass `env` to have a double check.
    id = legacy_transform_id(id, env);

    parsed = parse_module_id(id);

  // `id` is something like 'jquery'
  } else {
    // 1. id is a package name
    // 'jquery' -> 'jquery@~1.9.3'
    // 2. id may be is a package id
    // 'jquery@^1.9.3' -> 'jquery@^1.9.3'
    id = env.m && env.m[id] || id;
    // 'jquery' -> {n: 'jquery', v: '*', p: ''}
    // 'jquery@~1.9.3' -> {n: 'jquery', v: '~1.9.3', p: ''}
    parsed = parse_module_id(id);
  }

  
  if (parsed.k === env.k) {
    // if inside the same package of the parent module,
    // it uses a same sub graph of the package
    parsed.graph = env.graph;

  } else {
    // We route a package of certain range to a specific version according to `config.graph`
    // so several modules may point to a same exports
    // if is foreign module, we should parses the graph to the the sub graph
    var sub_graph = get_sub_graph(parsed.k, env.graph) 
      // If sub_graph not found, set it as `[]`
      || [];
    parsed.graph = sub_graph;
    parsed.v = sub_graph[0] || parsed.v;
    format_parsed(parsed);
  }

  return parsed;
}


function get_sub_graph (pkg, graph) {
  function is_in (map) {
    return map
      ? pkg in map
        ? NEURON_CONF.graph[map[pkg]]
        // if sub graph not found, always fallback to global graph.
        : global_graph
      : global_graph;
  }

  var global_graph = NEURON_CONF.graph._;
  return graph
    ? is_in(graph[1]) || is_in(graph[2])
    // Global
    : is_in(global_graph);
}


// Get the exports
// @param {Object} module
function get_exports(module) {
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
    = absolutize_url(module_id_to_relative_url_path(module.id));
  var __dirname = dirname(__filename);

  // to keep the object mod away from the executing context of factory,
  // use `factory` instead `mod.factory`,
  // preventing user from fetching runtime data by 'this'
  var factory = module.factory;
  factory(create_require(module), exports, module, __filename, __dirname);
  return module.exports;
}


var guid = 1;

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

    // guid
    module.g || (module.g = guid ++);
  }

  return module;
}


// @param {Object} module
// @param {function(exports)} callback
function use_module (module, callback) {
  neuron.ready(module, function () {
    callback(get_exports(module));
  });
}


// Create a mod
function get_mod(parsed) {
  var id = parsed.id;
  return mods[id] || (mods[id] = {
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
function test_require_id (id) {
  !~id.indexOf('@') || err("id with '@' is prohibited");
}


// use the sandbox to specify the environment for every id that required in the current module 
// @param {Object} env The object of the current module.
// @return {function}
function create_require(env) {
  var require = function(id) {
    // `require('a@0.0.0')` is prohibited.
    test_require_id(id);

    var module = get_module(id, env, true);
    return get_exports(module);
  };

  // @param {string} id Module identifier. 
  // Since 4.2.0, we only allow to asynchronously load a single module
  require.async = function(id, callback) {
    var origin = id;
    if (callback) {
      // `require.async('a@0.0.0')` is prohibited
      test_require_id(id);
      var relative = is_path_relative(id);
      if (relative) {
        id = path_join(env.id, id);
        var entries = env.entries;
        id = entries
          ? test_entries(id, entries) 
            || test_entries(id + '.js', entries) 
            || test_entries(id + '.json', entries)
            || module_not_found(origin)
          : legacy_transform_id(id, env);
      }

      var module = get_module(id, env);
      if (!module.main) {
        if (relative) {
          // If user try to load a non-entry module, it will get a 404 response
          module.a = true;
        } else {
          // We only allow to `require.async` main module or entries of the current package 
          return;
        }
      }

      use_module(module, callback);
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
      // '', 'a.png' -> 'a.png'
      // '', './a.png' -> 'a.png'
      // '', '../a.png' -> '../a.png'
      // '/index.js', 'a.png' -> 'a.png'
      path = path_join(
        // '' -> '' -> ''
        // '/index.js' -> '/' -> ''
        dirname(env.p).slice(1), 
        path
      );

      // If user try to resolve a url outside the current package
      // it fails silently
      if (!~path.indexOf('../')) {
        return absolutize_url(
          module_id_to_relative_url_path(env.k + '/' + path)
        );
      }
    }
  };

  return require;
}


function test_entries (path, entries) {
  return ~entries.indexOf(path)
    ? path
    : FALSE;
}
