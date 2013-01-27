if(!window._df3kkd_test_counter){
    window._df3kkd_test_counter = 1;
}else{
    _df3kkd_test_counter ++;
}



NR.define('test/mod-1', [], function(require, exports){
	exports.getCounter = function(){
	    return _df3kkd_test_counter;
	}
});


NR.define('test::mod-2', [], function(require, exports){
	exports.getCounter = function(){
	    return _df3kkd_test_counter + 1;
	}
});