module_require_2_loaded = true;

define('require-2@*', [], function(require, exports, module){

require.resolve('./abc.png');

module.exports = {
    init: function() {
        module_require_2_inited = true;
    }
}


});