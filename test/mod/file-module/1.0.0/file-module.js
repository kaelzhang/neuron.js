define('dir@1.0.0/lib/index.js', ['./dir'], function (require, exports) {
  exports.a = require('./dir').a;
}, {
  main: true,
  alias: {
    './dir': './dir.js'
  }
});


define('dir@1.0.0/lib/dir.js', [], function (require, exports) {
  exports.a = 1;
});