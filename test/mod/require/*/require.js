module_require_loaded = true;

define('require@*', [], function(require, exports, module){


module.exports = {
    init: function() {
        module_require_inited = true;
    }
}


});