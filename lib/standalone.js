
// Check and make sure the module is ready for running factory
// By default, 
// neuron core is only a module manager who doesn't care about module loading, 
// and consider all modules are already ready.
// By attaching `load.js` and `ready.js`, neuron will be an loader
function ready (module, callback) {
  callback();
};