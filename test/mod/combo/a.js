define('combo-a@0.0.0', ['./a'], function(require, exports, module) {
  var a = require('./a');

  exports.init = function(n) {
    return a.a(n);
  }
}, {
  main: true,
  map: {
    './a': 'combo-a@0.0.0/a'
  }
});

define('combo-a@0.0.0/a', [], function(require, exports, module) {
  exports.a = function(n) {
    return n;
  }
});