define('file-module@1.0.0/lib/index.js', ['./dir'], function (require, exports) {
  exports.a = require('./dir').a;
}, {
  main: true,
  map: {
    './dir': './dir.js'
  }
});


define('file-module@1.0.0/lib/dir.js', [], function (require, exports) {
  exports.a = 1;
}, {
  map: {}
});