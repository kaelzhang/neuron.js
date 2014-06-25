define('require-3@*', [], function(require, exports, module){

if ( typeof module_require_3_load_count !== 'undefined') {
    ++ module_require_3_load_count;
}

module.exports = {
    init: function(data) {
        module_require_3_inited = data && data.value;
    }
}

});