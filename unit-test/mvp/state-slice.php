<a href="javascript:" id="mvp-state-add">add</a><br/>
<a href="javascript:" id="mvp-state-prev">prev</a>
<a href="javascript:" id="mvp-state-next">next</a>

<script>

KM.provide('mvp/state', function(K, State){
	function create(){
		return parseInt(Math.random() * 1000);
	};
	
	function log(e){
		console.log(e.state, e.offset);
	};
	
	var state = new State().on({
		push: log,
		prev: log,
		next: log
	});
	
	$('#mvp-state-add').on('click', function(e){
		e.prevent();
		
		state.push(create());	
	
	});
	
	$('#mvp-state-prev').on('click', function(e){
		e.prevent();
		
		state.prev();
	});
	
	$('#mvp-state-next').on('click', function(e){
		e.prevent();
		
		state.next();
	});
});

</script>