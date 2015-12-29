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
var FALSE = !1;

// // Check and make sure the module is downloaded, 
// // if not, it will download the module
// neuron.load = function (module, callback){
//   callback();
// }
