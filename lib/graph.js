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

// @param {Object} module Current module to check
// @param {Object=} startpoints The array of 
//   checking startpoints of a potential strongly connected graph.
function check_ready (module, startpoints) {
  if (module.ready) {
    return true;
  }

  var children = module.children;
  // If has no dependencies
  if (is_object_empty(children)) {
    return module.ready = true;
  }

  startpoints || (startpoints = []);
  startpoints.push(module);

  var id;
  var child;
  var pass = true;

  for (id in children) {
    child = children[id];
    if (
      // If no factory, means module is not downloaded.
      !child.factory
      || 
        // If `child` is in `startpoints`,
        //   which forms a strongly connected graph
        //   See https://github.com/kaelzhang/neuron/blob/master/doc/graph.md#dependency-loading
        // And using `lastIndexOf` to check the latest circle
        !~startpoints.lastIndexOf(child)
        && !check_ready(child, startpoints)
    ) {
      pass = false;
      break;
    }
  }

  // If recursively called, pop out current child module to switch to another branch,
  // or empty the stack.
  startpoints.pop();

  // If all dependencies are ok, then returns true
  return pass;
}
