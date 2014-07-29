'use strict';

var neuron = exports;

var fs = require('fs');
var fse = require('fs-extra');
var node_path = require('path');
var readJson = require('read-cortex-json');
var file = node_path.join(__dirname, 'dist', 'neuron.js');
var concat = require('./node/concat');

neuron.content = function (callback) {
  fs.readFile(file, callback);
};


// Methods to get the neuron core
neuron.core = concat.core;


var version = require('./package.json').cortex.version;
neuron.version = function () {
  return version;
};


neuron.write = function (dist, callback, force) {
  fs.exists(dist, function (exists) {
    if (!exists) {
      return fse.copy(file, dist, callback);
    }

    if (!force) {
      return callback(null);
    }

    fse.remove(dist, function (err) {
      if (err) {
        return callback(err);
      }

      fse.copy(file, dist, callback);
    });
  });
};


neuron.dist = function (dist, callback, force) {
  var to = node_path.join(dist, version, 'neuron.js');
  async.parallel([
    function (done) {
      neuron.write(dist, done, force);
    },

    function (done) {
      readJson.enhanced(__dirname, function (err, pkg) {
        if (err) {
          return done(err);
        }

        readJson.save(dist, pkg, done);
      });
    }
  ], callback);
};
