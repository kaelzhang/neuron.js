NR.define(function(){
    window.test_require_with_init = true;

    return {
        init: function(config){
            window.test_require_with_init_id = config ? config.id : 100;
        }
    }
});