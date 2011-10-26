<script>

KM.provide('util/xml', function(K, XML){
	var result = XML.find(
		'dog', 
		'<parent><children><child><dog name="murphy"></dog></child><child><dog></dog></child></children></parent>', 
		true
	);
	
	console.log($(result).attr('name'));
});


</script>