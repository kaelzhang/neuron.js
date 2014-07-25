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
  emit('beforeready', module_id(module) + ':' + module.g);

  if (!module.factory) {
    emit('beforeload', module.id);
    return load_module(module, function () {
      emit('load', module_id(module));
      ready(module, callback, stack);
    });
  }

  var deps = module.deps;
  var counter = deps.length;

  var callbacks = module.r;
  // `module.r` is `[]` in origin.
  // `!callbacks` means the module is ready
  if (!counter || !callbacks) {
    module.r = NULL;
    emit_ready(module);
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
      emit_ready(module);
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


function emit_ready (module) {
  emit('ready', module_id(module) + ':' + module.g);
}


function module_id (module) {
  return module.main ? module.k : module.id;
}

// @override
neuron.ready = ready;

