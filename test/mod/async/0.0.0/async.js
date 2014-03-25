define('async@0.0.0', [], function(require, exports, module){
    exports.load = function (callback) {
        require.async('./relative', function (relative) {
            callback(relative);
        });
    };
});