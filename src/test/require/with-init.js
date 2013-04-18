window.test_require_with_init = true;

exports.init = function(config){
    window.test_require_with_init_id = config ? config.id : 100;
};