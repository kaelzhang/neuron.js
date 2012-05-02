<style>
.container{
	width: 600px;
	margin: 0 auto;
}

.G_H .img{display:none;}
</style>



<div class="container">

<br/><br/>
<a class="J_state" data-back="1" href="http://neuron.lc/unit-test/mvc/back.php">back</a>　
<a class="J_state" href="http://neuron.lc/unit-test/mvc/forward.php">forward</a>
<br/><br/>

<img class="img" id="img" src="i/1.jpg" />
</div>

<script>

var imgs = [
	'i/1.jpg',
	'i/2.jpg',
	'i/0.jpg'
];


KM.provide('mvp/history', function(K, History){
	
	var img = $('#img'),
		count = 1,
		href = location.href + '?img=';
	
	History.on({
		pushstate: function(e){
			console.log('pushstate', e, e.state.src);
			
			var src = e.state.src;
			src && img.attr('src', src);
		},
		
		popstate: function(e){
			console.log('popstate', e, e.state.src);
			
			var src = e.state.src;
			src && img.attr('src', src);
		},
		
		start: function(){
			document.documentElement.className = '';
		}
	});

	$.all('.J_state').on('click', function(e){
		e.prevent();
		
		count = Math.abs( count + ( $(e.target).attr('data-back') ? -1 : 1 ) );
		var	flag = count % 3;
		
		console.log('flag', flag);
		
		History.push({src: imgs[flag] }, '', href + flag);
	});
	
	History.start();
	
	window.onpopstate = function(e){
		console.log(e)
	}
});


</script>