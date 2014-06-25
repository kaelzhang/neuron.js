'use strict';

var fs = require('fs');
var fse = require('fs-extra');
var node_path = require('path');
var file = node_path.join(__dirname, 'dist', 'neuron.js');
var version = require('./package.json').cortex.version;

exports.content = function (callback) {
  fs.readFile(file, callback);
};


exports.version = function () {
  return version;
};


exports.write = function (dist, callback) {
  dist = node_path.join(dist, 'neuron', version, 'neuron.js');
  fse.copy(file, dist, callback);
};
