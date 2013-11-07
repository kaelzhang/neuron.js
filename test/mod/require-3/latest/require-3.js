console.log('require-3/latest loaded');

define('require-3', [], function(require, exports, module){


module.exports = {
    init: function(data) {
        module_require_3_inited = data && data.value;
    }
}


});