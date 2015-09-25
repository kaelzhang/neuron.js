'use strict';

var neuron = exports;

var fs = require('fs');
var fse = require('fs-extra');
var node_path = require('path');
var concat = require('./node/concat');

neuron.content = concat.normal;
neuron.version = concat.version;


neuron.write = function (dist, callback, force) {
  fs.exists(dist, function (exists) {
    if (!exists) {
      return copy(dist, callback);
    }

    if (!force) {
      return callback(null);
    }

    fse.remove(dist, function (err) {
      if (err) {
        return callback(err);
      }

      copy(dist, callback);
    });
  });
};


function copy (dist, callback) {
  neuron.content(function (err, content) {
    if (err) {
      return callback(err);
    }

    fse.outputFile(dist, content, callback);
  });
}
