/**
 * @preserve Neuron JavaScript Framework (c) Kael Zhang <i@kael.me>
 */

// Goal
// Manage module dependencies and initialization 

// Non-goal
// > What neuron will never do
// 1. Neuron will never care about non-browser environment
// 2. Neuron core will never care about module loading

'use strict';

var neuron = {
  version: '@VERSION'
};

var NULL = null;

var timestamp = + new Date;

// // Check and make sure the module is downloaded, 
// // if not, it will download the module
// neuron.load = function (module, callback){
//   callback();
// }

// Check and make sure the module is ready for running factory
// By default, 
// neuron core is only a module manager who doesn't care about module loading, 
// and consider all modules are already ready.
// By attaching `load.js` and `ready.js`, neuron will be an loader
neuron.ready = function (module, callback) {
  callback();
};
