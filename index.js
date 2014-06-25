'use strict';

var fs = require('fs');
var node_path = require('path');
var dist = node_path.join(__dirname, 'dist', 'neuron.js');

exports.content = function (callback) {
  fs.readFile(dist, callback);
};


exports.version = function () {
  return require('./cortex.json').version;
};
