(function(){
function mix(a,b){for(var k in b){a[k]=b[k];}return a;}
var _0 = "cyclic@1.0.0/a.js";
var _1 = "cyclic@1.0.0/index.js";
var asyncDepsToMix = {};
var globalMap = asyncDepsToMix;
define(_1, [_0], function(require, exports, module, __filename, __dirname) {

// Opt in to strict mode of JavaScript, [ref](http://is.gd/3Bg9QR)
// Use this statement, you can stay away from several frequent mistakes 
'use strict';


var a = require('./a');
exports.a = 1;

// How to use a foreign module ?
// Take 'jquery' for example:
//
// 1. to install a dependency, exec the command in your terminal
// ```bash
// cortex install jquery --save
// ```

// 2. use `require(id)`:

// var $ = require('jquery');


// 3. define exports:
// `exports` is the API of the current module,
// If another module `require('foo')`, it returns `exports`

// exports.my_method = function() {
// };

// or you could code like this:

// module.exports = {
//   my_method: function() {
//   }
// };

// But, NEVER do this: (Why?)
// exports = {my_method: ...}

}, {
    main:true,
    map:mix(globalMap,{"./a":_0})
});

define(_0, [_1], function(require, exports, module, __filename, __dirname) {
require('./index');
}, {
    map:mix(globalMap,{"./index":_1})
});
})();