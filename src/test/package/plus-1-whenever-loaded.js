if(!window._ekfj01_test_counter){
    window._ekfj01_test_counter = 1;
    
}else{
    _ekfj01_test_counter ++;
}

NR.define('test/an-unexisted-module', [], function(require, exports, module){

exports.getCounter = function(){
    return _ekfj01_test_counter;
};

});