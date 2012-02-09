<script>

describe('', function(){
	it('', function(){
		
	});
});



KM.provide('mvp/converter', function(K, converter){
	
	 console.log(converter.toQuery({a:1, b:[1,'2','b'], c: {a:1, b:'2', d:'a'}, d:'c'}));
	 console.log(converter.toObject('a/1&b/1,2,b&c/a=1,b=2,d=a&d/c'));
	
	
});


</script>