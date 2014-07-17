'use strict';

var concat = require('./concat');
var node_path = require('path');
var fs = require('fs');

function get_version () {
  var package_json = node_path.join(__dirname, '..', 'package.json');
  return require(package_json).cortex.version;
}


function write (type, filename) {
  concat[type](function (err, content) {
    if (err) {
      return console.error(err.stack || err);
    }

    var path = node_path.join(__dirname, '..', 'dist', filename);
    content = content.replace('@VERSION', get_version());
    fs.writeFile(path, content, function (err) {
      if (err) {
        return console.error(err.stack || err);
      }

      console.log('write to "' + path + '"');
    });
  });
}


write('full', 'neuron.js');
write('core', 'neuron-core.js');
