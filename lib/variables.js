/**
 * @preserve Neuron JavaScript Framework (c) Kael Zhang <i@kael.me>
 */

// Goal
// 1. Implement safe native ecma5 methods for they are basic requirements which, nevertheless, is pluggable
// 2. Manage module dependencies and initialization 

// Non-goal
// > What neuron will never do
// 1. Neuron will never care about non-browser environment
// 2. Neuron core will never care about module loading

'use strict';

var neuron = {};

var undefined;

// map -> identifier: module
// Expose the object for debugging
// @expose
var mods = neuron.mods = {};

