define('async-main@1.0.0/a.js', [], function(require, exports, module, __filename, __dirname){
  exports.load = function (callback) {
    require.async('./index', function (main) {
      callback(main);
    });
  }
}, {
  map: {},
  entries: [
    'async-main@1.0.0/a.js'
  ]
});