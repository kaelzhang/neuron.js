define('exports-priority@*', [], function(require, exports, module){

    exports.a = 2;

    module.exports = {
        a: 1
    };

    exports.a = 2;

});