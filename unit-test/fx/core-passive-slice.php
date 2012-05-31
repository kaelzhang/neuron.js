<style>
#tween-box{border:1px solid #000; width:10px; height:10px; position:absolute; margin-left:0;}

</style>


<div id="tween-box"></div>

<?php

inc('fx/tween.js', true);
inc('fx/easing.js', true);
inc('fx/css.js', true);
inc('fx/core.js', true); 
?>

<script>

/*
KM.provide('fx/tween', function(K, Tween){
	new Tween('#tween-box', {
		property: 'left',
		duration: 3000
	}).start(1000);
});
*/

KM.provide(['fx/tween', 'fx/easing'], function(K, tween, Easing){
	new tween('#tween-box', {
		duration: 3000,
		property: 'left',
		transition: Easing.linear
	}).start(1000);
});



</script>