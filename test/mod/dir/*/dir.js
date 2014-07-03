define('dir@*/lib/dir/index.js', [], function (require, exports) {
  exports.a = 1;
});

define('dir@*/lib/index.js', ['./dir'], function (require, exports) {
  exports.a = require('./dir').a;
}, {
  main: true,
  map: {
    './dir': './dir/index.js'
  }
});
