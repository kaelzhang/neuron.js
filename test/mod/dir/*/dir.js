define('dir@*/lib/dir/index.js', [], function (require, exports) {
  exports.a = 1;
}, {
  map: {}
});

define('dir@*/lib/index.js', ['./dir'], function (require, exports) {
  exports.a = require('./dir').a;
}, {
  main: true,
  map: {
    './dir': 'dir@*/lib/dir/index.js'
  }
});
