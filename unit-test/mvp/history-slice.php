<style>
.container{
	width: 600px;
	margin: 0 auto;
}
</style>



<div class="container">

<br/><br/>
<a class="J_state" data-back="1" href="http://neuron.lc/unit-test/mvc/back.php">back</a>　
<a class="J_state" href="http://neuron.lc/unit-test/mvc/forward.php">forward</a>
<br/><br/>

<img id="img" src="i/1.jpg" />
</div>

<script>

var imgs = [
	'i/1.jpg',
	'i/2.jpg',
	'i/0.jpg'
];


KM.provide('mvc/history', function(K, History){
	
	var img = $('img'),
		count = 1,
		href = location.href + '/';
	
	History.on(function(data){ console.log('statechange', data, data.src);
		data.src && img.attr('src', data.src);
	});

	$.all('.J_state').on('click', function(e){
		e.prevent();
		
		count = Math.abs( count + ( $(e.target).attr('data-back') ? -1 : 1 ) );
		var	flag = count % 3;
		
		History.push({src: imgs[flag] }, '', href + flag);
	});
	
	History.start();
});


</script>