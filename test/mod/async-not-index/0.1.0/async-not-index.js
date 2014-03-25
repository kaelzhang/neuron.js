define('async-not-index@0.1.0/lib/index', [], function(require, exports, module){
    exports.load = function (callback) {
        require.async('./relative', function (relative) {
            callback(relative);
        });
    };
}, {
    main: true
});