console.log('require/latest loaded');

module_require_loaded = true;

NR.define('require', [], function(require, exports, module){


module.exports = {
    init: function() {
        module_require_inited = true;
    }
}


});