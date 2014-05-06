/**
 * @preserve Neuron JavaScript Framework
 *   author i@kael.me
 */

// Goal
// 1. Implement safe native ecma5 methods for they are basic requirements which, nevertheless, is pluggable
// 2. Manage module dependencies and initialization 

// Non-goal
// > What neuron will never do
// 1. Neuron will never care about non-browser environment
// 2. Neuron core will never care about module loading

'use strict';

// version @VERSION
// build @DATE

// @param {Window|Object} ENV environment
// @param {undefined=} undefined
;(function(ENV, undefined){

// @const
var DOC = document;
var NULL = null;

// Create new `neuron` object or use the existing one
var neuron = ENV.neuron || (ENV.neuron = {});

neuron.version = '@VERSION';

