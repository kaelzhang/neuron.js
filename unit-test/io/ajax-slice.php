<script>

KM.provide('io/ajax', function(K, Ajax){
	new Ajax({
		url: 'ajax-handler.php',
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