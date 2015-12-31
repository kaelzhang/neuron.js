define('late-main@*/lib/entry.js', ['late-main@*/index.js'], function (require, exports, module) {
  module.exports = require('..')
}, {
  map: {
    '..': 'late-main@*/index.js'
  }
});


define('late-main@*/index.js', [], function (require, exports, module) {
  module.exports = {
    a: 1
  }
}, {
  main: true
});