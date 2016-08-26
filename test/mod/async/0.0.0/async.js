define('async@0.0.0/async.js', [], function(require, exports, module){
    exports.load = function (callback) {
        require.async('./relative', function (relative) {
            callback(relative);
        });
    };
}, {
  map: {
    './relative': 'async@0.0.0/relative.js'
  },
  main: true
});