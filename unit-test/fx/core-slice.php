<style>
#tween-box{border:1px solid #000; width:10px; height:10px; position:absolute;}

</style>


<div id="tween-box"></div>

<script>

KM.provide('fx/tween', function(K, Tween){
	new Tween('#tween-box', {
		property: 'left',
		duration: 3000
	}).start(1000);
});



</script>