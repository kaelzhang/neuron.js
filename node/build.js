#!/usr/bin/env node

'use strict';

var concat = require('./concat');
var node_path = require('path');
var fse = require('fs-extra');

function get_version () {
  var package_json = node_path.join(__dirname, '..', 'package.json');
  return require(package_json).cortex.version;
}


function write (type, filename) {
  concat[type](function (err, content) {
    if (err) {
      console.error(err.stack || err);
      process.exit(1);
    }

    var path = node_path.join(__dirname, '..', 'dist', filename);
    content = content.replace('@VERSION', get_version());
    fse.outputFile(path, content, function (err) {
      if (err) {
        return console.error(err.stack || err);
      }

      console.log('write to "' + path + '"');
    });
  });
}

var type = process.argv.pop() === 'ecma5'
  ? 'safe-ecma5'
  : 'normal';

if (type === 'safe-ecma5') {
  write('safe-ecma5', 'neuron-ecma5.js');
} else {
  write('normal', 'neuron.js');
}
