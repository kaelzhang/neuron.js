module_require_loaded = true;

define('require@latest', [], function(require, exports, module){


module.exports = {
    init: function() {
        module_require_inited = true;
    }
}


});