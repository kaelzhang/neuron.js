module_require_2_loaded = true;

NR.define('require-2', [], function(require, exports, module){


module.exports = {
    init: function() {
        module_require_2_inited = true;
    }
}


});