<a href="javascript:" id="change">change url</a>


<script>

KM.provide('mvp/router', function(K, Router){
	var router = new Router();
	
	router.add('/page', {
		action: function(data){
			console.log('action: page', data);
		},
		
		rewrite: '/page/:page/shopid/:shopID'
	});
	
	router.add('/shop', {
		action: function(data){
			console.log('action: shop', data);
		},
		
		rewrite: '/shop/:shopID/type/:shopType'
	});
	
	function roll(){
		return Math.random() > 0.5;
	};
	
	function random(range){
		return parseInt( Math.random() * range );
	};
	
	$('#change').on('click', function(e){
		e.prevent();
		
		history.pushState(
			{},
			'',
			roll() ? 
				'/page/' + random(10) + '/shopid/' + random(100000) :
				'/shop/' + random(100000) + '/type/' + random(100)
		);
		
		router.route(location.href);
	});
});

</script>