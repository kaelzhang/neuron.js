'use strict';

var fs = require('fs');
var node_path = require('path');

var jshintjs = node_path.join(__dirname, '..', 'jshintrc.js');
var jshintrc = node_path.join(__dirname, '..', '.jshintrc');

var json = require(jshintjs);

fs.writeFileSync(jshintrc, JSON.stringify(json, null, 2));
