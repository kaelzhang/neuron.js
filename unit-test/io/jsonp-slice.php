<script>

KM.provide('io/jsonp', function(K, JSONP){
	new JSONP({
		url: 'jsonp-handler.php',
		data: {
			a: 1,
			b: 2
		}
	}).on({
		success: function(rt){
			console.log(rt);
		},
		
		error: function(){
			console.log('error');
		}
		
	}).send();
});

</script>