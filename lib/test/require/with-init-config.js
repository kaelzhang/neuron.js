window.test_require_with_init_config = true;

exports.init = function(config){
    window.test_require_with_init_config_id = config ? config.id : 100;
};