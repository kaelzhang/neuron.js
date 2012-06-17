<style>
#tween-box{border:1px solid #000; width:10px; height:10px; position:absolute; margin-left:0;}

</style>


<div id="tween-box"></div>



<script>

KM.define('http://i3.neuron.lc/app/one/a.v1.js', true);
// KM.define('http://i1.js.lc/Neuron/lib/fx/core.js', true);


KM.define.on();

KM.define('switch/core.js', [], function(){
   return true;
});

KM.define.off();


KM.provide(['fx/tween', 'fx/easing', 'switch/core', 'one::a'], function(K, tween, Easing){
	new tween('#tween-box', {
		duration: 3000,
		property: 'left',
		transition: Easing.linear
	}).start(1000);
});



</script>

<?php

/*
inc('fx/core.js', true);
inc('fx/tween.js', true);
inc('fx/css.js', true);
inc('fx/easing.js', true);
*/
    
?>