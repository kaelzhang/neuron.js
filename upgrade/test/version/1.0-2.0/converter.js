"use strict";

var

FILE = 'var.js',
// FILE = 'simple.js',
// FILE = 'fn-arg.js',

fs = require('fs'),

UglifyJS = require('uglify-js'),
upgrade = require('../../../lib/converter'),
analyzer = require('../../../lib/util/analyzer');


var

ast = upgrade.parse(fs.readFileSync(FILE).toString());

ast = upgrade.convert(ast);


analyzer(ast);


var

tree_output = fs.openSync(FILE.replace(/\.js$/, '-tree-output.js'), 'w+');

fs.writeSync(tree_output, analyzer(ast));

fs.closeSync(tree_output);


var

output = fs.openSync(FILE.replace(/\.js$/, '-output.js'), 'w+');

fs.writeSync(output, upgrade.printCode(ast));

fs.closeSync(output);




return;
