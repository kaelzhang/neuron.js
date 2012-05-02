<a href="javascript:" id="change">change url</a>


<script>

KM.provide(['mvp/router', 'mvp/tpl'], function(K, Router, Tpl){
	var router = new Router();
	
	router.add('/page/:page/shopid/:shopID', function(data){
		console.log('action: page', data);
	});
	
	router.add('/shop/:shopID/type/:shopType', function(data){
		console.log('action: shop', data);
	});
	
	router.add('/url/*url', function(data){
		console.log('action: url', data);
	});
	
		
	function roll(){
		var r = Math.random();
		
		if(r < .35){
			return '/page/' + random(10) + '/shopid/' + random(100000);
		}else if(random > .55){
			return '/shop/' + random(100000) + '/type/' + random(100);
		}else{
			return '/url/abcdefg_' + random(100000);
		}
	};
	
	
	function random(range){
		return parseInt( Math.random() * range );
	};
	
	
	$('#change').on('click', function(e){
		e.prevent();
		
		router.navigate(roll());
	});
});

</script>