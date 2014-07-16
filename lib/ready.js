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
      ready(module, callback);
    });
  }

  var children = module.children || {};
  var ids = Object.keys(children);
  var counter = ids.length;

  var callbacks = module.r;
  if (counter === 0 || !callbacks) {
    module.r = undefined;
    return callback();
  }

  stack || (stack = []);
  stack.push(module);
  callbacks.push(callback);
  if (callbacks.length > 1) {
    return;
  }

  var cb = function () {
    if (-- counter === 0) {
      callbacks.forEach(function (c) {
        c();
      });
      callbacks.length = 0;
      // Mark the module is ready
      // `delete module.c` is not safe
      module.r = undefined;
    }
  }

  ids.forEach(function (id) {
    var child = children[id];
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

