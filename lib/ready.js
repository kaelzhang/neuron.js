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
      // require('a@1.1.0')
      // -> define('a@1.1.0/index.js', ...)
      module.graph[module.id] = module;
      ready(module, callback);
    });
  }

  var deps = module.deps;
  var counter = deps.length;

  var callbacks = module.r;
  if (!counter || !callbacks) {
    module.r = NULL;
    return callback();
  }


  callbacks.push(callback);
  // if already registered, skip checking
  if (callbacks.length > 1) {
    return;
  }

  var cb = function () {
    -- counter || run_callbacks(module, 'r');
  }

  stack || (stack = []);
  stack.push(module);
  deps.forEach(function (dep) {
    var child = get_module(dep, module);
    // If the child is already in the stack,
    // which means there might be cyclic dependency, skip it.
    if (~stack.lastIndexOf(child)) {
      return -- counter;
    }
    ready(child, cb, stack);
  });

  // First in, last out.
  stack.pop();
}


// @override
neuron.ready = ready;

