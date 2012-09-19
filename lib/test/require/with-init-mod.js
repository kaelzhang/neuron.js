NR.define(function(){
    window.test_require_with_init_mod = true;

    return {
        init: function(config){
            window.test_require_with_init_mod_id = config ? config.id : 100;
        }
    }
});